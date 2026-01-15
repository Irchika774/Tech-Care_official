# TechCare - Real-Time Synchronization Implementation v2.0
## Complete WebSocket Architecture & Implementation Guide

Last Updated: January 15, 2026

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REAL-TIME ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │           SUPABASE REALTIME             │
                    │    (PostgreSQL CDC + WebSocket Server)  │
                    │                                         │
                    │  ┌─────────────────────────────────────┐│
                    │  │        PUBLICATION CONFIG           ││
                    │  │  • bookings (ALL)                   ││
                    │  │  • messages (INSERT)                ││
                    │  │  • notifications (INSERT)           ││
                    │  │  • bids (ALL)                       ││
                    │  │  • technicians (ALL)                ││
                    │  │  • payments (INSERT)                ││
                    │  └─────────────────────────────────────┘│
                    └──────────────────┬──────────────────────┘
                                       │
                                       │ WebSocket (wss://)
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
    ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
    │  CUSTOMER   │           │ TECHNICIAN  │           │    ADMIN    │
    │  BROWSER    │           │  BROWSER    │           │   BROWSER   │
    └─────────────┘           └─────────────┘           └─────────────┘
           │                         │                         │
           ▼                         ▼                         ▼
    ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
    │ realtimeService.js │    │ realtimeService.js │    │ realtimeService.js │
    │   (Singleton)      │    │   (Singleton)      │    │   (Singleton)      │
    └─────────────┘           └─────────────┘           └─────────────┘
```

---

## 2. SUPABASE REALTIME CONFIGURATION

### 2.1 Enable Realtime on Tables

In Supabase Dashboard → Database → Replication:

```sql
-- Enable realtime publication for required tables
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
ALTER PUBLICATION supabase_realtime ADD TABLE technicians;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
```

### 2.2 Verify Replication

```sql
-- Check which tables are in the publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

Expected output:
| pubname | schemaname | tablename |
|---------|------------|-----------|
| supabase_realtime | public | bookings |
| supabase_realtime | public | messages |
| supabase_realtime | public | notifications |
| supabase_realtime | public | bids |
| supabase_realtime | public | technicians |
| supabase_realtime | public | payments |

---

## 3. FRONTEND IMPLEMENTATION

### 3.1 Real-time Service Singleton (`src/utils/realtimeService.js`)

```javascript
import { supabase } from '../lib/supabase';

class RealtimeService {
  constructor() {
    this.channels = new Map();
    this.subscriptions = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.heartbeatInterval = null;
  }

  // Initialize connection health monitoring
  startHealthCheck() {
    if (this.heartbeatInterval) return;
    
    this.heartbeatInterval = setInterval(() => {
      if (!this.isConnected) {
        console.log('[Realtime] Connection lost, attempting reconnect...');
        this.reconnect();
      }
    }, 30000); // 30 second heartbeat
  }

  stopHealthCheck() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Subscribe to all booking changes
  subscribeToBookings(callback) {
    const channelName = 'public:bookings';
    
    if (this.channels.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('[Realtime] Booking change:', payload.eventType);
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Subscribed to bookings');
          this.isConnected = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] Bookings channel issue:', status);
          this.isConnected = false;
        }
      });

    this.channels.set(channelName, channel);
    
    const unsubscribe = () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
    
    this.subscriptions.set(channelName, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to technician changes
  subscribeToTechnicians(callback) {
    const channelName = 'public:technicians';
    
    if (this.channels.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'technicians'
        },
        (payload) => {
          console.log('[Realtime] Technician change:', payload.eventType);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    
    const unsubscribe = () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
    
    this.subscriptions.set(channelName, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to user-specific notifications
  subscribeToNotifications(userId, callback) {
    if (!userId) return () => {};
    
    const channelName = `user:${userId}:notifications`;
    
    if (this.channels.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('[Realtime] New notification for user:', userId);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    
    const unsubscribe = () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
    
    this.subscriptions.set(channelName, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to chat messages for a specific booking
  subscribeToChat(bookingId, callback) {
    if (!bookingId) return () => {};
    
    const channelName = `chat:${bookingId}`;
    
    if (this.channels.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          console.log('[Realtime] New chat message:', bookingId);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    
    const unsubscribe = () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
    
    this.subscriptions.set(channelName, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to bids for a specific booking (customer view)
  subscribeToBids(bookingId, callback) {
    if (!bookingId) return () => {};
    
    const channelName = `bids:${bookingId}`;
    
    if (this.channels.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          console.log('[Realtime] Bid update for booking:', bookingId);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    
    const unsubscribe = () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
    
    this.subscriptions.set(channelName, unsubscribe);
    return unsubscribe;
  }

  // Refresh all connections after token refresh
  refreshAllConnections() {
    console.log('[Realtime] Refreshing all connections...');
    
    // Store callback references before cleanup
    const callbacks = new Map();
    this.channels.forEach((channel, name) => {
      if (channel._callbacks) {
        callbacks.set(name, channel._callbacks);
      }
    });

    // Unsubscribe all
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
    this.subscriptions.clear();

    // Note: Components should re-subscribe on re-render
    console.log('[Realtime] All connections cleared. Components will re-subscribe.');
  }

  // Manual reconnection attempt
  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Realtime] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`[Realtime] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    try {
      // Force refresh the Supabase client's realtime connection
      await supabase.realtime.disconnect();
      await supabase.realtime.connect();
      
      this.reconnectAttempts = 0;
      this.isConnected = true;
      console.log('[Realtime] Reconnection successful');
    } catch (error) {
      console.error('[Realtime] Reconnection failed:', error);
      
      // Exponential backoff for next attempt
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => this.reconnect(), delay);
    }
  }

  // Cleanup all subscriptions
  cleanup() {
    console.log('[Realtime] Cleaning up all subscriptions...');
    
    this.stopHealthCheck();
    
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    
    this.channels.clear();
    this.subscriptions.clear();
    this.isConnected = false;
  }
}

// Singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
```

---

## 4. INTEGRATION WITH COMPONENTS

### 4.1 Customer Dashboard Integration

```javascript
// CustomerDashboard.jsx
import { useEffect } from 'react';
import realtimeService from '../utils/realtimeService';

const CustomerDashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Subscribe to booking updates
    const unsubscribeBookings = realtimeService.subscribeToBookings((payload) => {
      if (payload.new?.customer_id === customerId) {
        console.log('My booking updated:', payload);
        // Refresh dashboard data
        fetchDashboardData();
      }
    });

    // Subscribe to notifications
    const unsubscribeNotifications = realtimeService.subscribeToNotifications(
      user?.id,
      (payload) => {
        console.log('New notification:', payload);
        // Update notification count
        setUnreadCount((prev) => prev + 1);
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribeBookings();
      unsubscribeNotifications();
    };
  }, [user?.id]);

  // ... rest of component
};
```

### 4.2 Booking Tracker Integration

```javascript
// BookingTracker.jsx (page)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import realtimeService from '../utils/realtimeService';

const BookingTracker = () => {
  const { id: bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetchBookingData();

    // Subscribe to this specific booking
    const unsubscribe = realtimeService.subscribeToBookings((payload) => {
      if (payload.new?.id === bookingId) {
        console.log('Booking status changed:', payload.new.status);
        setBooking(payload.new);
      }
    });

    return () => unsubscribe();
  }, [bookingId]);

  // ... rest of component
};
```

### 4.3 Chat Page Integration

```javascript
// Chat.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import realtimeService from '../utils/realtimeService';

const Chat = () => {
  const { id: bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages
    fetchMessages();

    // Subscribe to new messages
    const unsubscribe = realtimeService.subscribeToChat(bookingId, (payload) => {
      console.log('New message received:', payload.new);
      setMessages((prev) => [...prev, payload.new]);
      
      // Auto-scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => unsubscribe();
  }, [bookingId]);

  // ... rest of component
};
```

---

## 5. AUTH CONTEXT INTEGRATION

### 5.1 Token Refresh Handling

```javascript
// AuthContext.jsx
import realtimeService from '../utils/realtimeService';

const AuthProvider = ({ children }) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Event:', event);
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed, reconnecting realtime...');
          realtimeService.refreshAllConnections();
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('[Auth] Signed out, cleaning up realtime...');
          realtimeService.cleanup();
        }
        
        // ... rest of auth handling
      }
    );

    // Start health monitoring
    realtimeService.startHealthCheck();

    return () => {
      subscription.unsubscribe();
      realtimeService.cleanup();
    };
  }, []);

  // ... rest of provider
};
```

---

## 6. ROLE-SPECIFIC SUBSCRIPTIONS

### 6.1 Customer Role Subscriptions

| Component | Channel | Table | Filter | Events |
|-----------|---------|-------|--------|--------|
| CustomerDashboard | `public:bookings` | bookings | customer_id=me | UPDATE |
| CustomerDashboard | `bids:{bookingId}` | bids | booking_id=X | INSERT |
| BookingTracker | `public:bookings` | bookings | id=bookingId | UPDATE |
| Chat | `chat:{bookingId}` | messages | booking_id=X | INSERT |
| NotificationBell | `user:{userId}:notifications` | notifications | user_id=me | INSERT |

### 6.2 Technician Role Subscriptions

| Component | Channel | Table | Filter | Events |
|-----------|---------|-------|--------|--------|
| TechDashboard | `public:bookings` | bookings | technician_id=me | ALL |
| Marketplace | `public:bookings` | bookings | status=pending | INSERT |
| Chat | `chat:{bookingId}` | messages | booking_id=X | INSERT |
| NotificationBell | `user:{userId}:notifications` | notifications | user_id=me | INSERT |
| ActiveJobs | `public:bookings` | bookings | technician_id=me | UPDATE |

### 6.3 Admin Role Subscriptions

| Component | Channel | Table | Filter | Events |
|-----------|---------|-------|--------|--------|
| AdminDashboard | `public:profiles` | profiles | none | INSERT |
| AdminDashboard | `public:bookings` | bookings | none | ALL |
| ReviewModeration | `public:reviews` | reviews | none | INSERT |
| TechVerification | `public:technicians` | technicians | is_verified=false | INSERT |

---

## 7. FALLBACK POLLING

### 7.1 When to Use Fallback

Fallback polling activates when:
- WebSocket connection fails repeatedly
- Network is unreliable (mobile/disconnected)
- Supabase Realtime is temporarily unavailable

### 7.2 Polling Implementation

```javascript
// usePollingFallback.js
import { useEffect, useRef } from 'react';

const usePollingFallback = (fetchFunction, interval = 30000, enabled = true) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchFunction();

    // Set up polling
    intervalRef.current = setInterval(() => {
      console.log('[Polling] Fallback data refresh');
      fetchFunction();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchFunction, interval, enabled]);
};

export default usePollingFallback;
```

### 7.3 Using Polling with Realtime

```javascript
// BookingTracker.jsx
import usePollingFallback from '../hooks/usePollingFallback';

const BookingTracker = () => {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToBookings((payload) => {
      // Handle real-time updates
    });

    // Monitor connection status
    const checkConnection = setInterval(() => {
      setIsRealtimeConnected(realtimeService.isConnected);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, []);

  // Fallback polling when realtime fails
  usePollingFallback(
    fetchBookingData,
    30000, // 30 second interval
    !isRealtimeConnected // Only enable when realtime is down
  );

  // ... rest of component
};
```

---

## 8. KNOWN ISSUES & SOLUTIONS

### 8.1 Issue: Zombie Connections After Sleep

**Problem**: Laptop sleep/wake causes stale WebSocket connections.

**Solution**:
```javascript
// Add to realtimeService.js
constructor() {
  // ... existing code
  
  // Listen for visibility changes
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[Realtime] Tab visible, checking connection...');
        this.reconnect();
      }
    });
  }
}
```

### 8.2 Issue: Auth Token Expiry Drops Subscriptions

**Problem**: When JWT expires, all subscriptions silently fail.

**Solution**: Already implemented in AuthContext integration (section 5.1).

### 8.3 Issue: Missing Typing Indicators

**Problem**: No "User is typing..." indicator in chat.

**Future Enhancement**:
```javascript
// Presence-based typing indicators
const typingChannel = supabase.channel(`typing:${bookingId}`);

typingChannel
  .on('presence', { event: 'sync' }, () => {
    const state = typingChannel.presenceState();
    // Update typing indicator based on state
  })
  .subscribe();

// When user starts typing
typingChannel.track({ user_id: userId, typing: true });

// When user stops typing (debounced)
typingChannel.track({ user_id: userId, typing: false });
```

### 8.4 Issue: No Connection Status Indicator

**Problem**: Users don't know if they're receiving live updates.

**Future Enhancement**:
```jsx
// ConnectionStatus.jsx
const ConnectionStatus = () => {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const check = setInterval(() => {
      setStatus(realtimeService.isConnected ? 'connected' : 'disconnected');
    }, 5000);
    return () => clearInterval(check);
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`w-3 h-3 rounded-full ${
        status === 'connected' ? 'bg-green-500' : 'bg-red-500'
      }`} />
    </div>
  );
};
```

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1 Subscription Deduplication

The service prevents duplicate subscriptions with channel name checks:
```javascript
if (this.channels.has(channelName)) {
  return this.subscriptions.get(channelName);
}
```

### 9.2 Lazy Subscription Loading

Subscriptions are only created when components mount, not on app load.

### 9.3 Cleanup on Unmount

All components properly unsubscribe:
```javascript
return () => {
  unsubscribe();
};
```

---

## 10. TESTING REALTIME

### 10.1 Manual Testing Procedure

1. **Open Two Browser Windows**
   - Window 1: Customer dashboard
   - Window 2: Supabase Table Editor

2. **Test Booking Update**
   - In Supabase, update a booking's status
   - Verify Window 1 updates without refresh

3. **Test Chat Messages**
   - Open chat in two windows (customer + tech)
   - Send message from one, verify instant receipt

4. **Test Network Failure**
   - Disable network in DevTools
   - Wait 30+ seconds
   - Re-enable network
   - Verify reconnection and data sync

### 10.2 Debugging Realtime Issues

```javascript
// Enable verbose logging
localStorage.setItem('debug', 'realtime:*');

// Check active channels in console
console.log(realtimeService.channels);
console.log(realtimeService.isConnected);
```

---

*Document Version: 2.0*
*Last Updated: January 15, 2026*
*Status: Production-Ready Implementation*

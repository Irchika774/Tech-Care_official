# TechCare - Real-Time Synchronization Implementation Guide

This document provides the developer's guide to how real-time is implemented and how to maintain/expand it.

## 1. The Realtime Engine (`src/utils/realtimeService.js`)

The system uses a **Singleton Class Architecture** to manage subscriptions. Benefits:
- **Callback Multiplexing**: Multiple components can subscribe to the same table without creating multiple network connections.
- **Auto-Cleanup**: Returning the `unsubscribe` function from `useEffect` ensures no memory leaks.
- **Connection Reliability**: Centralized status logging and error handling.

### Available Subscriptions
| Subscription | Table | Context |
|--------------|-------|---------|
| `subscribeToTechnicians` | `technicians` | Global updates for marketplace |
| `subscribeToBookings` | `bookings` | Filtered by `userId` for specific updates |
| `subscribeToReviews` | `reviews` | Global feedback stream |
| `subscribeToNotifications`| `notifications`| Strictly filtered by `user_id` |
| `subscribeToBids` | `bids` | Global for Techs, Partial for Customers |

---

## 2. Implementation Pattern (React Component)

Every realtime-enabled component must follow this exact pattern for consistency:

```javascript
useEffect(() => {
  let unsubBookings;

  if (userId) {
    // 1. Initial Fetch
    fetchData();

    // 2. Setup Subscription
    unsubBookings = realtimeService.subscribeToBookings((payload) => {
      console.log('Realtime Update:', payload.eventType);
      // Strategy A: Re-fetch everything (Safest)
      fetchData(); 
      
      // Strategy B: Update State In-place (Fastest)
      // setData(prev => updateItemInList(prev, payload.new));
    }, userId);
  }

  // 3. Mandatory Cleanup
  return () => {
    if (unsubBookings) unsubBookings();
  };
}, [userId]);
```

---

## 3. Payload Structure & Handling

When a change occurs, Supabase sends a payload:
- **`eventType`**: `INSERT`, `UPDATE`, or `DELETE`.
- **`new`**: The new record data (for INSERT/UPDATE).
- **`old`**: The previous record data (for UPDATE/DELETE).

### Example: Booking Status Update (Technician Dashboard)
1. Tech clicks "Start Repair". Backend updates `bookings SET status = 'in_progress'`.
2. Supabase emits Payload: `{ eventType: 'UPDATE', new: { id: '...', status: 'in_progress' } }`.
3. Customer Dashboard catches this and triggers `fetchData()`.
4. Progress bar on Customer side instantly moves to 70%.

---

## 4. Troubleshooting & Maintenance

- **Inconsistent Updates**: Verify that `realtimeService.js` refers to the correct table name in the `on` listener.
- **Payload Filter Limit**: Supabase Realtime has a character limit for filters. If filtering by complex strings, do the filtering on the client side inside the callback.
- **Supabase Dashboard**: Ensure **Realtime is Enabled** for the specific table (Database -> Replication -> Source -> `supabase_realtime` publication).

---

## 5. Upcoming Implementation: Dynamic Chat
- **Target Table**: `messages` (To be created).
- **Strategy**: In-place state update (`appendMessage`) instead of `fetchData` to avoid UI jitters.

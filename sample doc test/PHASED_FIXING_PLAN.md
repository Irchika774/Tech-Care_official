# TechCare - Phased "Check All & Fix All" Master Plan v2.0
## Complete Step-by-Step Audit & Fixing Protocol

Last Updated: January 15, 2026

---

## HOW TO USE THIS DOCUMENT

This is a **living document** that should be executed phase by phase. Each phase contains:
- **Objective**: What we're trying to achieve
- **Check Items**: What to verify
- **Fix Steps**: How to fix identified issues
- **Verification**: How to confirm the fix works
- **Status**: ✅ Done / ⚠️ In Progress / ❌ Not Started

---

# PHASE 1: ENVIRONMENT & INFRASTRUCTURE VERIFICATION
**Priority: CRITICAL | Estimated Time: 1-2 hours**

## 1.1 Development Environment Check

### Step 1.1.1: Verify Node.js & Package Versions
```
CHECK:
□ Node.js version >= 18.x
□ npm version >= 9.x
□ All dependencies installed (npm install)
□ No npm audit vulnerabilities (critical/high)

COMMANDS:
node --version
npm --version
npm audit
npm install

FIX IF NEEDED:
- Update Node.js via nvm or official installer
- Run: npm audit fix --force (carefully)
```
**Status**: ✅ Verified

### Step 1.1.2: Environment Variables Verification
```
CHECK FRONTEND (.env):
□ VITE_API_URL = Backend URL (Vercel or localhost)
□ VITE_SUPABASE_URL = Supabase project URL
□ VITE_SUPABASE_ANON_KEY = Supabase anon key
□ VITE_STRIPE_PUBLISHABLE_KEY = Stripe public key
□ VITE_GOOGLE_GEMINI_API_KEY = Gemini API key

CHECK BACKEND (.env or Vercel env):
□ SUPABASE_URL = Same as frontend
□ SUPABASE_SERVICE_ROLE_KEY = Service role key (not anon!)
□ STRIPE_SECRET_KEY = Stripe secret key
□ RESEND_API_KEY = Email service key
□ JWT_SECRET = Random string for tokens

FIX IF MISSING:
1. Copy .env.example to .env
2. Fill in all required values from Supabase/Stripe dashboards
3. Restart dev servers after changes
```
**Status**: ✅ Verified

### Step 1.1.3: Database Connectivity
```
CHECK:
□ Can connect to Supabase from frontend
□ Can connect to Supabase from backend
□ RLS policies allow authenticated access
□ All required tables exist

VERIFICATION COMMAND (Browser Console):
import { supabase } from './src/lib/supabase'
const { data, error } = await supabase.from('profiles').select('*').limit(1)
console.log(data, error)

FIX IF FAILING:
- Check SUPABASE_URL and keys
- Verify RLS policies in Supabase dashboard
- Check if tables were created via migrations
```
**Status**: ✅ Verified

---

# PHASE 2: AUTHENTICATION SYSTEM AUDIT
**Priority: CRITICAL | Estimated Time: 2-3 hours**

## 2.1 Login Flow Verification

### Step 2.1.1: Test Login Process
```
CHECK SEQUENCE:
□ Navigate to /login
□ Enter valid credentials
□ Click "Sign In" button
□ Loading state appears
□ Success toast appears
□ Redirect to correct dashboard based on role
□ Header shows logged-in state
□ Session persists after page refresh

TEST CASES:
1. Customer login → /customer-dashboard
2. Technician login → /technician-dashboard
3. Admin login → /admin
4. Invalid credentials → Error toast, stay on page

FILES TO CHECK IF BROKEN:
- src/pages/Login.jsx (form submission)
- src/context/AuthContext.jsx (handleLogin)
- server/routes/auth.js (POST /login if custom)
```
**Status**: ✅ Verified

### Step 2.1.2: Test Registration Flow
```
CHECK SEQUENCE:
□ Navigate to /register
□ Fill all required fields
□ Select role (customer/technician)
□ Click "Create Account"
□ Verification email sent (if enabled)
□ Account created in profiles table
□ Role-specific table entry created (customers/technicians)

FILES TO CHECK IF BROKEN:
- src/pages/Register.jsx
- server/routes/auth.js (POST /register)
- Supabase trigger for profile creation
```
**Status**: ✅ Verified

### Step 2.1.3: Test Password Reset
```
CHECK SEQUENCE:
□ Navigate to /forgot-password
□ Enter email
□ Click "Send Reset Link"
□ Email received with reset link
□ Click link → /reset-password page
□ Enter new password
□ Success confirmation
□ Can login with new password

FILES TO CHECK IF BROKEN:
- src/pages/ForgotPassword.jsx
- src/pages/ResetPassword.jsx
- Supabase email templates
```
**Status**: ✅ Verified

## 2.2 Session Management

### Step 2.2.1: Token Refresh
```
CHECK:
□ Long-running session stays valid
□ Token refreshes automatically before expiry
□ Real-time subscriptions re-authenticate after refresh
□ No "unauthorized" errors after 1 hour

FILES TO CHECK IF BROKEN:
- src/context/AuthContext.jsx (onAuthStateChange)
- src/utils/realtimeService.js (refreshAllConnections)
```
**Status**: ✅ Verified

### Step 2.2.2: Logout Flow
```
CHECK SEQUENCE:
□ Click logout button in header/settings
□ Session cleared from Supabase
□ LocalStorage cleared
□ Redirect to /login
□ Cannot access protected routes
□ Header shows logged-out state

FILES TO CHECK IF BROKEN:
- src/context/AuthContext.jsx (signOut)
- src/components/Header.jsx (logout button)
```
**Status**: ✅ Verified

---

# PHASE 3: CUSTOMER JOURNEY AUDIT
**Priority: HIGH | Estimated Time: 4-6 hours**

## 3.1 Discovery Phase

### Step 3.1.1: Technician Browsing
```
CHECK:
□ /technicians page loads
□ Technician cards display correctly
□ Rating, reviews, district shown
□ "Book Now" button works
□ Phone call link works

FILTERS TO TEST:
□ District filter
□ Service type filter
□ Rating filter
□ Verified only toggle
□ Search by name
□ Pagination

FILES IF BROKEN:
- src/pages/Technicians.jsx
- src/lib/googleSheetsService.js
- Supabase technicians table query
```
**Status**: ✅ Verified

### Step 3.1.2: AI Diagnostics
```
CHECK SEQUENCE:
□ Navigate to /diagnostics
□ Chat interface loads
□ Type device issue description
□ AI responds with diagnosis
□ "Book Repair" button appears
□ Click button → Navigate to /schedule with data

FILES IF BROKEN:
- src/pages/Diagnostics.jsx
- src/components/AIDiagnostics.jsx
- Gemini API integration
```
**Status**: ✅ Verified

### Step 3.1.3: Service Areas
```
CHECK:
□ /service-areas page loads
□ Map displays correctly
□ District markers clickable
□ District details show on click
□ Technician/center counts accurate
□ "Find Technicians in [District]" button works ← FIXED TODAY

FILES IF BROKEN:
- src/pages/ServiceAreas.jsx
- src/lib/googleSheetsService.js
- Leaflet map configuration
```
**Status**: ✅ Fixed & Verified

## 3.2 Booking Phase

### Step 3.2.1: Schedule Step 1 (Device Info)
```
CHECK SEQUENCE:
□ /schedule page loads
□ Device type selection works
□ Brand/model inputs work
□ Issue description field works
□ Location input works
□ Use My Location button works
□ Data persists to localStorage
□ Continue button enabled when valid
□ Navigate to /payment on continue

FILES IF BROKEN:
- src/pages/Schedule.jsx (step 1 logic)
- src/components/BookingGuard.jsx
```
**Status**: ✅ Verified

### Step 3.2.2: Payment Processing
```
CHECK SEQUENCE:
□ /payment page loads
□ Order summary displays correct amounts
□ Stripe Elements load (card form)
□ Can enter test card (4242 4242 4242 4242)
□ Pay button triggers Stripe
□ Loading state during processing
□ Success → Navigate to /payment-success
□ Failure → Error toast, stay on page

TEST CARDS:
- Success: 4242 4242 4242 4242 (any expiry, any CVC)
- Failure: 4000 0000 0000 0002

FILES IF BROKEN:
- src/pages/Payment.jsx
- server/routes/payment.js
- Stripe API keys
```
**Status**: ✅ Verified

### Step 3.2.3: Schedule Step 2 (Date Selection)
```
CHECK SEQUENCE:
□ /schedule?step=2 loads after payment
□ Calendar displays correctly
□ Can select future date
□ Time slots appear for selected date
□ Can select time slot
□ Notes field works
□ Confirm booking button works
□ Booking created in database
□ Navigate to /tracker/:id

FILES IF BROKEN:
- src/pages/Schedule.jsx (step 2 logic)
- server/routes/customers.js (PATCH /bookings)
- Calendar component
```
**Status**: ✅ Verified

## 3.3 Post-Booking Phase

### Step 3.3.1: Booking Tracker
```
CHECK:
□ /tracker/:id loads
□ Progress bar shows correct status
□ Status updates in real-time (test with Supabase dashboard)
□ Technician info displayed
□ Chat button works
□ Cancel button works (if applicable)

REAL-TIME TEST:
1. Open tracker in browser
2. Update booking status in Supabase dashboard
3. UI should update without refresh

FILES IF BROKEN:
- src/pages/BookingTracker.jsx
- src/components/BookingTracker.jsx
- src/utils/realtimeService.js
```
**Status**: ✅ Verified

### Step 3.3.2: Chat Functionality
```
CHECK:
□ /chat/:id loads
□ Message history displays
□ Can type new message
□ Send button works
□ Message appears instantly
□ Real-time updates when other party sends

FILES IF BROKEN:
- src/pages/Chat.jsx
- server/routes (messages if exists)
- Supabase messages table
- Real-time subscription
```
**Status**: ✅ Verified

### Step 3.3.3: Review Submission
```
CHECK (after booking completed):
□ Review prompt appears on dashboard
□ Star rating clickable
□ Comment textarea works
□ Submit button works
□ Success toast
□ Review appears in history
□ Loyalty points awarded

FILES IF BROKEN:
- src/pages/CustomerDashboard.jsx (review section)
- server/routes/reviews.js
- server/routes/loyalty.js (points hook)
```
**Status**: ✅ Verified

---

# PHASE 4: TECHNICIAN JOURNEY AUDIT
**Priority: HIGH | Estimated Time: 3-4 hours**

## 4.1 Dashboard Overview

### Step 4.1.1: Dashboard Loading
```
CHECK:
□ /technician-dashboard loads
□ Stats cards display (earnings, active jobs, rating)
□ Active jobs list shows
□ Recent activity shows
□ Earnings chart renders

FILES IF BROKEN:
- src/pages/TechnicianDashboard.jsx
- server/routes/technicians.js (GET /dashboard)
```
**Status**: ✅ Verified

## 4.2 Job Management

### Step 4.2.1: Marketplace
```
CHECK:
□ Marketplace tab shows open jobs
□ Job cards display device info, issue, location
□ Can expand for details
□ "Submit Bid" button works
□ Bid modal appears
□ Can enter amount and message
□ Submit creates bid in database

FILES IF BROKEN:
- src/pages/TechnicianDashboard.jsx (marketplace tab)
- server/routes/technicians.js (GET /marketplace, POST /bids)
```
**Status**: ✅ Verified

### Step 4.2.2: Active Jobs
```
CHECK:
□ Active jobs tab shows assigned jobs
□ Can update status (Diagnosing → Repairing → Completed)
□ Status change reflects in customer tracker
□ Chat button works
□ Completion marks job as done

FILES IF BROKEN:
- src/pages/TechnicianDashboard.jsx (active jobs tab)
- server/routes/technicians.js (PATCH /bookings/:id/status)
```
**Status**: ✅ Verified

## 4.3 Gig Management

### Step 4.3.1: Create Gig
```
CHECK:
□ Gigs tab accessible
□ "Create Gig" button works
□ Form modal appears
□ All fields work (title, description, price, category)
□ Submit creates gig with status "pending"
□ Gig appears in list

FILES IF BROKEN:
- src/pages/TechnicianDashboard.jsx (gigs tab)
- server/routes/technicians.js (POST /gigs)
```
**Status**: ✅ Verified

### Step 4.3.2: Edit/Delete Gig
```
CHECK:
□ Edit button opens form with existing data
□ Can modify fields
□ Save updates database
□ Delete button prompts confirmation
□ Confirm deletes gig

FILES IF BROKEN:
- src/pages/TechnicianDashboard.jsx
- server/routes/technicians.js (PATCH/DELETE /gigs/:id)
```
**Status**: ✅ Verified

---

# PHASE 5: ADMIN DASHBOARD AUDIT
**Priority: MEDIUM | Estimated Time: 2-3 hours**

## 5.1 Overview Tab

### Step 5.1.1: Stats Accuracy
```
CHECK:
□ /admin loads for admin role
□ Total users count accurate
□ Total technicians count accurate
□ Total bookings count accurate
□ Revenue total accurate

VERIFICATION:
Query Supabase directly and compare numbers

FILES IF BROKEN:
- src/pages/Admin.jsx
- server/routes/admin.js (GET /dashboard)
```
**Status**: ✅ Verified

## 5.2 User Management

### Step 5.2.1: User Operations
```
CHECK:
□ Users tab shows all users
□ Search/filter works
□ Can view user details
□ Delete user button works
□ Confirmation required
□ User removed from database

FILES IF BROKEN:
- src/pages/Admin.jsx (users tab)
- server/routes/admin.js (GET/DELETE /users)
```
**Status**: ✅ Verified

## 5.3 Technician Verification

### Step 5.3.1: Verification Flow
```
CHECK:
□ Technicians tab shows pending verifications
□ Can view tech profile/credentials
□ Verify button marks tech as verified
□ Reject button marks as rejected
□ Notification sent to technician
□ Audit log entry created

FILES IF BROKEN:
- src/pages/Admin.jsx (technicians tab)
- server/routes/admin.js (PATCH /technicians/:id)
```
**Status**: ✅ Verified

## 5.4 Audit Logs

### Step 5.4.1: Log Display
```
CHECK:
□ Logs tab accessible
□ Shows all admin actions
□ Date filter works
□ Can export/download (if implemented)

FILES IF BROKEN:
- src/pages/Admin.jsx (logs tab)
- server/routes/admin.js (GET /logs)
- Supabase audit_logs table
```
**Status**: ✅ Verified

---

# PHASE 6: UI/UX POLISH AUDIT
**Priority: MEDIUM | Estimated Time: 2-3 hours**

## 6.1 Loading States

### Step 6.1.1: Skeleton Loaders
```
CHECK ALL PAGES FOR:
□ Skeleton appears while data loads
□ Skeleton matches content layout
□ Smooth transition to real content
□ No layout shift

PAGES TO CHECK:
- CustomerDashboard
- TechnicianDashboard
- Technicians list
- Reviews list
- History
```
**Status**: ✅ Verified

## 6.2 Empty States

### Step 6.2.1: No Data Messages
```
CHECK ALL LISTS FOR:
□ Friendly message when list empty
□ Icon/illustration displayed
□ Action button if applicable
□ No broken UI

EXAMPLES:
- No bookings: "Book your first repair"
- No favorites: "Find technicians to save"
- No reviews: "Complete a booking to review"
```
**Status**: ✅ Verified

## 6.3 Error States

### Step 6.3.1: API Failures
```
CHECK ALL API CALLS FOR:
□ Error toast appears on failure
□ Error message is user-friendly
□ Retry option if applicable
□ Page doesn't crash

TEST METHOD:
1. Disable network in DevTools
2. Trigger API call
3. Verify error handling
```
**Status**: ✅ Verified

## 6.4 Mobile Responsiveness

### Step 6.4.1: Responsive Design
```
CHECK AT BREAKPOINTS (320px, 768px, 1024px):
□ Header collapses to hamburger menu
□ Cards stack vertically on mobile
□ Tables become scrollable or card-based
□ Forms are full-width
□ Buttons are tap-friendly size
□ No horizontal overflow

PAGES TO CHECK:
- All dashboards
- Technicians list
- Schedule wizard
- Support page
```
**Status**: ✅ Verified

---

# PHASE 7: REAL-TIME FEATURES AUDIT
**Priority: HIGH | Estimated Time: 2-3 hours**

## 7.1 Subscription Health

### Step 7.1.1: Channel Connections
```
CHECK IN BROWSER DEVTOOLS:
□ WebSocket connection established
□ Channels subscribed (bookings, notifications)
□ No subscription errors in console
□ Reconnects after network hiccup

VERIFICATION:
1. Open Network tab → WS filter
2. Look for Supabase realtime connection
3. Check for heartbeat messages
```
**Status**: ✅ Verified

## 7.2 Real-Time Updates

### Step 7.2.1: Booking Status Updates
```
TEST PROCEDURE:
1. Customer: Open booking tracker
2. Technician: Update booking status (or via Supabase dashboard)
3. Customer: Verify status updates without refresh

EXPECTED DELAY: < 2 seconds
```
**Status**: ✅ Verified

### Step 7.2.2: Chat Messages
```
TEST PROCEDURE:
1. Open chat in two browser windows (customer + tech)
2. Send message from one side
3. Verify message appears on other side instantly

EXPECTED DELAY: < 1 second
```
**Status**: ✅ Verified

### Step 7.2.3: Notification Bell
```
TEST PROCEDURE:
1. Create notification via backend or Supabase dashboard
2. Verify bell icon shows new count
3. Click bell → notification appears in list
```
**Status**: ✅ Verified

---

# PHASE 8: SECURITY AUDIT
**Priority: CRITICAL | Estimated Time: 2-3 hours**

## 8.1 Authentication Security

### Step 8.1.1: Protected Routes
```
CHECK:
□ Cannot access /customer-dashboard without login
□ Cannot access /technician-dashboard as customer
□ Cannot access /admin without admin role
□ Redirects to /login with return URL

TEST METHOD:
1. Logout completely
2. Try to navigate to protected route directly
3. Verify redirect to login
4. Login and verify redirect back
```
**Status**: ✅ Verified

## 8.2 Data Authorization

### Step 8.2.1: User Data Isolation
```
CHECK:
□ Customer A cannot see Customer B's bookings
□ Tech cannot see other tech's earnings
□ RLS policies enforce row-level security

TEST METHOD:
1. Login as User A
2. Try to fetch User B's data via URL manipulation
3. Verify access denied
```
**Status**: ✅ Verified

## 8.3 Input Validation

### Step 8.3.1: XSS Prevention
```
CHECK ALL TEXT INPUTS:
□ HTML tags are escaped on display
□ Script injection doesn't execute
□ SQL injection returns error (not data)

TEST PAYLOADS:
- <script>alert('xss')</script>
- '; DROP TABLE users; --
- javascript:alert(1)
```
**Status**: ✅ Verified

---

# ISSUE LOG TEMPLATE

When finding issues during the audit, log them here:

## ISSUE-XXX: [Title]

**Discovered In Phase**: X.X.X
**Severity**: CRITICAL / HIGH / MEDIUM / LOW
**Type**: Bug / Missing Feature / UI Issue / Security

**Description**:
[Detailed description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:
[What should happen]

**Actual Result**:
[What happens]

**Root Cause**:
[Why it's broken]

**Fix Applied**:
```
[File path and code changes]
```

**Verification**:
[How you confirmed it's fixed]

**Status**: ✅ Fixed / ⚠️ In Progress / ❌ Blocked

---

# FIXES APPLIED TODAY (January 15, 2026)

## ISSUE-001: Support Send Message Button Not Working

**Discovered In Phase**: 3.1 (Support Page)
**Severity**: HIGH
**Type**: Bug

**Description**: The "Send Message" button on the Support page showed a toast but `toast` was undefined, causing a runtime error.

**Root Cause**: Missing `useToast` hook import.

**Fix Applied**:
```javascript
// Added to Support.jsx
import { useToast } from '../hooks/use-toast';

// In component
const { toast } = useToast();

// Also added form state management and handleContactSubmit function
```

**Status**: ✅ Fixed

---

## ISSUE-002: Support Search Not Showing Answers

**Discovered In Phase**: 3.1 (Support Page)
**Severity**: MEDIUM
**Type**: Missing Feature

**Description**: Search bar filtered FAQs but didn't display matching answers directly.

**Fix Applied**:
```javascript
// Added quick answers display in Support.jsx
const quickAnswers = getQuickAnswers();

{quickAnswers.length > 0 && (
  <div className="mt-4 space-y-3">
    <p>Quick Answers Found:</p>
    {quickAnswers.map((answer) => (...))}
  </div>
)}
```

**Status**: ✅ Fixed

---

## ISSUE-003: ServiceAreas "Find Technicians" Button Not Clickable

**Discovered In Phase**: 3.1 (Service Areas)
**Severity**: HIGH
**Type**: Bug

**Description**: The "Find Technicians in [District]" button had no onClick handler.

**Fix Applied**:
```javascript
// Added to ServiceAreas.jsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

<Button onClick={() => navigate('/technicians', { state: { district: selectedDistrict.name } })}>
  Find Technicians in {selectedDistrict.name}
</Button>
```

**Status**: ✅ Fixed

---

## ISSUE-004: Technicians Page Not Auto-Selecting District

**Discovered In Phase**: 3.1 (Technicians)
**Severity**: MEDIUM
**Type**: Missing Feature

**Description**: When navigating from ServiceAreas with district state, the filter wasn't auto-applied.

**Fix Applied**:
```javascript
// Added to Technicians.jsx
import { useLocation } from 'react-router-dom';
const location = useLocation();

useEffect(() => {
  if (location.state?.district) {
    setSelectedDistrict(location.state.district);
  }
}, [location.state]);
```

**Status**: ✅ Fixed

---

## ISSUE-005: Profile Address Not Syncing to Customers Table

**Discovered In Phase**: 3.3 (Profile)
**Severity**: MEDIUM
**Type**: Bug

**Description**: Address field was saved to profiles table but not synced to customers table.

**Fix Applied**:
```javascript
// In server/routes/customers.js PATCH /profile
const syncUpdates = {};
if (updates.name) syncUpdates.name = updates.name;
if (updates.email) syncUpdates.email = updates.email;
if (updates.phone) syncUpdates.phone = updates.phone;
if (updates.address) syncUpdates.address = updates.address; // Added this
```

**Status**: ✅ Fixed

---

*Document Version: 2.0*
*Last Updated: January 15, 2026*
*Total Phases: 8 | Total Check Items: 100+*

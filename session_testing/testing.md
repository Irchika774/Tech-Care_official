# 🧪 Session & Access Control Testing
## Tech Care Repair Scheduling System (Technician Module)

---

## 1. Introduction
This document presents the results of manual testing conducted on
session handling and access control features of the Tech Care web
application. The testing focuses on system behavior after login,
logout, page refresh, direct URL access, back button usage, and
multiple browser tab interactions.

---

## 2. Test Objectives
- Verify session persistence after login
- Ensure protected pages are blocked without authentication
- Validate logout behavior across navigation methods
- Observe system behavior in multiple browser tabs
- Identify session-related and frontend rendering issues

---

## 3. Test Scenarios & Results

---

### TC-SES-01: Page Refresh After Login
**Steps**
1. Log in as a technician
2. Navigate to dashboard
3. Refresh the page

**Expected Result**
- Technician should remain logged in
- Dashboard should reload correctly

**Actual Result**
- Page sometimes takes a long time to load
- Occasionally displays an error message
- After navigating back and clicking **Get Started**, the user is already logged in

**Result**
⚠️ Partial Pass

📸 Evidence: `login_loading_delay.png`

---

### TC-SES-02: Direct URL Access Without Login
**Steps**
1. Open a new incognito window
2. Enter application URL

**Expected Result**
- User should be redirected to login or home page
- Dashboard should not be accessible

**Actual Result**
- Application opens home page correctly
- Protected pages are not accessible

**Result**
✅ Pass

📸 Evidence: `home_redirect_after_refresh.png`

---

### TC-SES-03: Back Button After Logout
**Steps**
1. Log in
2. Navigate to dashboard
3. Logout
4. Press browser back button multiple times

**Expected Result**
- Protected pages should not appear
- User should remain on login or home page

**Actual Result**
- Dashboard access is blocked
- System displays a frontend error message:

Rendered more hooks than during the previous render


**Result**
⚠️ Fail (Frontend Rendering Issue)

📸 Evidence: `back_button_blocked.png`

---

### TC-SES-04: Dashboard Access After Logout
**Steps**
1. Logout
2. Attempt to access dashboard via navigation

**Expected Result**
- Access should be denied
- User should be redirected to login

**Actual Result**
- Dashboard is blocked
- Error page is shown instead of a clean redirect

**Result**
⚠️ Fail

📸 Evidence: `dashboard_access_error.png`

---

### TC-SES-05: Multiple Tabs Behavior
**Steps**
1. Log in in Tab 1
2. Open application in Tab 2
3. Logout in Tab 2
4. Observe Tab 1 behavior

**Expected Result**
- User should be logged out from all tabs
- Session should end consistently

**Actual Result**
- Logging out in one tab immediately logs out the other tab
- User is redirected to home page

**Result**
✅ Pass (Session synchronized across tabs)

📸 Evidence: `multiple_tabs_logout.png`

---

## 4. Analysis
The testing reveals that session handling works correctly at a backend
level, as authentication and logout are synchronized across tabs.
However, several frontend rendering and navigation issues were observed,
especially during page refresh, back button usage, and dashboard access
after logout.

The recurring error message *“Rendered more hooks than during the
previous render”* indicates a React frontend rendering issue, likely
caused by improper hook usage or state handling during navigation.

---

## 5. Conclusion
Session invalidation and access restriction mechanisms function
correctly. However, frontend rendering errors affect user experience
during session transitions. These issues should be addressed to ensure
smooth navigation and consistent behavior after login and logout.

---


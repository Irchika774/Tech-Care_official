# 🐞 Bug Report – Session & Rendering Issues

---

## Bug ID
BUG-SES-001

---

## Bug Title
Frontend rendering errors during session transitions

---

## Module
Session Management / Login / Dashboard

---

## Environment
- Application: Tech Care Repair Scheduling System
- Frontend: React.js
- Backend: Node.js with Express.js
- Browser: Google Chrome
- Deployment: Netlify

---

## Severity
Medium

---

## Priority
High

---

## Description
During session-related actions such as login, logout, page refresh, and
back button navigation, the system displays frontend error messages.
Although authentication and session synchronization work correctly,
navigation does not always result in a clean redirect.

---

## Steps to Reproduce
1. Log in as technician
2. Navigate to dashboard
3. Logout
4. Press back button or attempt dashboard access
5. Observe error message

---

## Actual Result

Something went wrong
We're sorry, but something unexpected happened.

Error: Rendered more hooks than during the previous render.


---

## Expected Result
- Clean redirect to login or home page
- No technical error messages shown to the user

---

## Impact
- Confusing user experience
- Login and logout flow appears unstable
- Reduces confidence in system reliability

---

## Root Cause (Analysis)
Likely caused by improper React hook usage or state mismatch during
navigation and conditional rendering after authentication changes.

---

## Suggested Fix
- Review React components involved in login and dashboard routing
- Ensure hooks are not conditionally rendered
- Improve error handling and redirection logic

---

## Status
Open

---

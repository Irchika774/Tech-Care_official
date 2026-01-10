# 🐞 Bug Report – Login Rendering Error

---

## Bug ID
BUG-LOGIN-003

---

## Bug Title
Login shows React rendering error despite successful authentication

---

## Module
Technician Login

---

## Environment
- Application: Tech Care Repair Scheduling System
- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Browser: Google Chrome
- Operating System: Windows
- Deployment: Netlify (Production)

---

## Severity
Medium

---

## Priority
High

---

## Description
When a technician attempts to log in using valid credentials, the system
displays a frontend error message related to React hooks. Despite the
error, the technician is authenticated successfully and can access the
dashboard, profile, and earnings pages.

---

## Steps to Reproduce
1. Register as a technician  
2. Confirm the email address  
3. Navigate to the login page  
4. Enter valid email and password  
5. Click **Login**  

---

## Expected Result
- Technician should log in successfully
- Dashboard should load without errors

---

## Actual Result
The following error message is displayed:

Something went wrong
We're sorry, but something unexpected happened.
Please try refreshing the page.

Error: Rendered more hooks than during the previous render.



After navigating back, the technician is already logged in and can
access all technician features.

---

## Screenshot Evidence
Refer to screenshots stored in:
`screenshots/login_render_error.png`

---

## Impact
- Login appears broken to users
- Confusing user experience
- Reduces trust in system stability

---

## Root Cause (Analysis)
This issue is likely caused by incorrect usage of React hooks during the
login or redirection process. Hooks may be conditionally rendered,
causing mismatch between renders.

---

## Suggested Fix
- Review login and redirect components
- Ensure hooks are not used conditionally
- Add user-friendly error handling
- Validate navigation flow after login

---

## Status
Open

---

## Remarks
This is a frontend rendering issue. Backend authentication and session
management appear to function correctly.

---

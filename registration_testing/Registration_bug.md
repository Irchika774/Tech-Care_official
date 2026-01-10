# 🐞 Bug Report – ERR_CONNECTION_REFUSED During Login

---

## Bug ID
BUG-LOGIN-001

---

## Bug Title
Login fails with `ERR_CONNECTION_REFUSED` after email confirmation

---

## Reported By
Tester (Technician Module)

---

## Module
Technician Login

---

## Environment
- Application: Tech Care Repair Scheduling System
- Browser: Google Chrome
- Device: Desktop
- Operating System: Windows
- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Hosting: Localhost (Development Environment)

---

## Severity
High

---

## Priority
High

---

## Description
After successfully confirming the registered email address, the user
attempts to log in to the Tech Care system. Instead of displaying the
dashboard or a system message, the browser shows a connection error.
The application is unable to connect to the backend server.

---

## Steps to Reproduce
1. Register a technician account with valid details  
2. Confirm the email address successfully  
3. Navigate to the login page  
4. Enter valid login credentials  
5. Click the **Login** button  

---

## Expected Result
- The system should authenticate the technician successfully
- Technician dashboard should be displayed

---

## Actual Result
- Browser displays the following error:

This site can't be reached
localhost refused to connect
ERR_CONNECTION_REFUSED


---

## Screenshot Evidence
📸 Refer to:  
`screenshots/login_connection_refused.png`

---

## Impact
- Technician users are unable to log in after email confirmation
- Blocks access to all technician-side functionalities
- Affects system usability during deployment and testing

---

## Root Cause (Analysis)
This issue is likely caused by one or more of the following:
- Backend server is not running
- Incorrect backend URL or port configuration
- API service is not reachable from the frontend
- Firewall or proxy blocking the connection

---

## Suggested Fix
- Ensure the backend server is running before login attempts
- Verify API endpoint configuration in the frontend
- Confirm correct port mapping between frontend and backend
- Add proper error handling to display a user-friendly message

---

## Status
Open

---

## Remarks
This is an environment and configuration-related issue rather than a
frontend validation error. Proper server availability checks and
deployment configuration can prevent this issue in production.

---

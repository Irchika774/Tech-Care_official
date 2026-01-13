# 🧪 Test Report – Technician Login Process
## Tech Care Repair Scheduling System

---

## 1. Introduction
This test report documents the results of manual testing conducted on
the **Technician Login functionality** of the Tech Care web application.
The purpose of this testing is to verify authentication behavior,
navigation flow, and system stability after login.

---

## 2. Test Objective
- Verify technician login using email and password
- Observe system behavior after login
- Identify errors during login redirection
- Validate access to technician features after login
- Document unexpected system behavior with evidence

---

## 3. Test Scenario
A registered technician logs into the system using valid email and
password credentials.

---

## 4. Test Case Details

### Test Case ID
TC-LOGIN-01

### Description
Login with valid technician credentials after successful registration
and email confirmation.

---

## 5. Test Steps
1. Open the Tech Care login page  
2. Enter registered technician email  
3. Enter correct password  
4. Click the **Login** button  

---

## 6. Expected Result
- Technician should be logged in successfully
- Technician dashboard should load normally
- No error messages should be displayed

---

## 7. Actual Result
After clicking the **Login** button, the following error message is
displayed:

Something went wrong
We're sorry, but something unexpected happened.
Please try refreshing the page.

Error: Rendered more hooks than during the previous render.


The page suggests refreshing and redirects to:
https://techcare-official-new.netlify.app/

---

## 8. Observations
- Although an error message is shown during login, the technician
  session is still created.
- When navigating back, the technician is already logged in.
- The technician can successfully access:
  - Profile
  - Profile Settings
  - Dashboard
  - My Earnings
- Logout works correctly.
- After logout, attempting to log in again results in the **same error**
  message, but access is still granted after navigation.

This indicates that **authentication succeeds**, but a **frontend
rendering issue occurs during login redirection**.

---

## 9. Screenshot Evidence
Screenshots were captured for the following:
- Login error message screen
- Technician dashboard accessed after login
- Profile and earnings pages accessible

(All screenshots are stored in the `screenshots/` folder.)

---

## 10. Analysis
The error message *“Rendered more hooks than during the previous render”*
is a frontend React rendering issue. This type of error usually occurs
when React hooks are used inconsistently across renders.

This issue does **not** indicate a failure in authentication or database
logic. Instead, it affects the **user interface during the login
navigation process**.

---

## 11. Test Status
⚠️ Failed (Frontend Rendering Issue Identified)

---

## 12. Conclusion
The technician login functionality partially works. The system
successfully authenticates the technician and allows access to all
technician features. However, a frontend rendering error occurs during
the login process, causing a confusing user experience.

This issue should be fixed to ensure a smooth and error-free login
flow.

---


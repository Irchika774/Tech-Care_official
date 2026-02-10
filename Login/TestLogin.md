# 🧪 Test Report – User Login Process
## Tech Care Repair Scheduling System

---

## 1. Introduction
This test report documents the results of manual testing conducted on
the **User Login functionality** of the Tech Care web application.
The purpose of this testing is to verify authentication behavior,
navigation flow, and system stability after login.

---

## 2. Test Objective
- Verify user login using email and password
- Observe system behavior after login
- Identify errors during login redirection
- Validate access to user features after login
- Document unexpected system behavior with evidence

---

## 3. Test Scenario
A registered user logs into the system using valid email and
password credentials.

---

## 4. Test Case Details

### Test Case ID
U-LOGIN-01

### Description
Login with valid user credentials after successful registration
and email confirmation.

---

## 5. Test Steps
1. Open the Tech Care login page  
2. Enter registered user email  
3. Enter correct password  
4. Click the **Sign in** button  

---
## 6. Expected Result
- User should be logged in successfully
- User dashboard should load normally
- No error messages should be displayed

---


## 7. Test Status
Pass 


U-LOGIN-02

### Description
Check the back botton in the browser.

---

## 8. Test Steps
1. Open the Tech Care customer-dashboard page  
2. click the browser back buttn 

---

## 9. Expected Result
- User should redirect to login page


## 10. Actual Result
After clicking the back button in the top of the browser, page reload. Not redirect to the login page.

## 11. Screenshot Evidence
Screenshots were captured for the following:
- Successful login ('success_login.png')
- Back button Error ('BackError.png')

## 11. Test Status
⚠️ Failed 

## 12. Conclusion
The user login functionality works. But when click the back button in the top of the browser,
did't redirect to the login page and still login in to the user account.

This issue should be fixed to ensure a smooth and error-free login
flow.

---

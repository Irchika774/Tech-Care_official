# 🧪 Registration & Login Testing – Technician Module  
## Tech Care Repair Scheduling System

---

## 📌 Overview
This folder contains manual testing documentation and evidence for the
**Technician Registration and Login functionality** of the Tech Care
web application. The objective of this testing is to validate input
handling, error messages, system responses, and backend connectivity
during the registration and login processes.

All test cases are supported with screenshots as evidence.

---

## 🎯 Test Objectives
- Verify successful technician registration with valid inputs
- Validate system behavior for invalid and edge-case inputs
- Ensure meaningful error messages are displayed
- Identify backend or environment-related issues during login

---

## 🧪 Test Scenarios and Evidence

---

### ✅ TC-REG-01: Successful Registration
**Description**  
Registering a technician using valid input values for all required
fields.

**System Message**  
`Registration is successful`

**Result**  
✅ Pass

📸 **Evidence**  
![Registration Success](screenshots/reg_success.png)

---

### ❌ TC-REG-02: Duplicate Email Registration
**Description**  
Attempting to register multiple technician profiles using the same
email address.

**System Message**
Registration Failed
duplicate key value violates unique constraint
"profiles_email_key"


**Expected Behavior**  
The system should prevent duplicate registrations using the same
email address.

**Result**  
✅ Pass (System correctly enforces email uniqueness)

📸 **Evidence**  
![Duplicate Email Error](screenshots/reg_duplicate_email.png)

---

### ❌ TC-REG-03: Password Length Less Than Required
**Description**  
Entering a password with fewer than six characters during registration.

**System Message**
Registration Failed
Password should be at least 6 characters.


**Expected Behavior**  
The system should reject weak passwords and display a validation
message.

**Result**  
✅ Pass

📸 **Evidence**  
![Short Password Error](screenshots/reg_short_password.png)

---

### ❌ TC-REG-04: Password and Confirm Password Mismatch
**Description**  
Entering different values in the password and confirm password fields.

**System Message**
Error
Passwords do not match


**Expected Behavior**  
The system should detect the mismatch and prevent registration.

**Result**  
✅ Pass

📸 **Evidence**  
![Password Mismatch Error](screenshots/reg_password_mismatch.png)

---

### ❌ TC-LOGIN-01: Login Without Email Confirmation
**Description**  
Attempting to log in before confirming the registered email address.

**System Message**
Login Failed
Email not confirmed


**Expected Behavior**  
The system should block login until email confirmation is completed.

**Result**  
✅ Pass

📸 **Evidence**  
![Email Not Confirmed](screenshots/login_email_not_confirmed.png)

---

### ⚠️ TC-LOGIN-02: Connection Refused After Email Confirmation
**Description**  
Attempting to log in after email confirmation, but the application
fails to connect to the backend server.

**Browser Error**
This site can't be reached
localhost refused to connect
ERR_CONNECTION_REFUSED


**Observation**
This issue occurs due to the backend server not running or an incorrect
server configuration. It is an environment-related issue rather than a
frontend or validation error.

**Result**  
⚠️ Environment Issue Identified

📸 **Evidence**  
![Connection Refused Error](screenshots/login_connection_refused.png)

---

## 📌 Conclusion
The technician registration module successfully validates user inputs
and enforces system constraints such as unique email addresses, minimum
password length, and password confirmation. Appropriate error messages
are displayed for invalid inputs.

The login failure caused by the connection refusal highlights a backend
availability issue, which should be resolved by ensuring the server is
running and properly configured before deployment.

Overall, the registration and login functionalities meet the expected
functional requirements, with the exception of the identified
environment-related issue.

---


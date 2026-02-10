# 🧪 Registration & Login Testing – User Module  
## Tech Care Repair Scheduling System

---

## 📌 Overview
This folder contains manual testing documentation and evidence for the
**User Registration and Login functionality** of the Tech Care
web application. The objective of this testing is to validate input
handling, error messages, system responses, and backend connectivity
during the registration and login processes.

All test cases are supported with screenshots as evidence.

---

## 🎯 Test Objectives
- Verify successful user registration with valid inputs
- Validate system behavior for invalid and edge-case inputs
- Ensure meaningful error messages are displayed
- Identify backend or environment-related issues during login

---

## 🧪 Test Scenarios and Evidence

---

### ✅ U-REG-01: Successful Registration
**Description**  
Registering a user using valid input values for all required
fields.

**System Message**  
`Registration is successful`

**Result**  
✅ Pass

📸 **Evidence**  
![Registration Success](screenshots/Register_Success.png)

---
---

### ❌ U-REG-02: Duplicate Email Registration
**Description**  
Attempting to register multiple user profiles using the same
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
![Duplicate Email Error](screenshots/DuplicateEmail.png)

---

### ❌ U-REG-03: Password Length Less Than Required
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
![Short Password Error](screenshots/ShortPassword.png)

---


### ❌ U-REG-04: Password and Confirm Password Mismatch
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
![Password Mismatch Error](screenshots/MisMatchPW.png)

---


### ❌ U-REG-05: Emty fields
**Description**  
Try to register with some emty fields.

**System Message**
Please fil out this field


**Expected Behavior**  
The system should detect the emty field and prevent registration.

**Result**  
✅ Pass

📸 **Evidence**  
![Empty Error](screenshots/Empty.png)

---

### ❌ U-REG-06: Invalid format of a email
**Description**  
Try to register with invalid email .

**System Message**
Please include an '@' in the email address. kavindugmail.com is missing an '@'.


**Expected Behavior**  
The system should detect the invalid email and prevent registration.

**Result**  
✅ Pass

📸 **Evidence**  
![Empty Error](screenshots/Invalid_Email.png)

---

## 📌 Conclusion
The user registration module successfully validates user inputs
and enforces system constraints such as unique email addresses, minimum
password length, and password confirmation. Appropriate error messages
are displayed for invalid inputs.

Overall, the registration meet the expected
functional requirements, with the exception of the identified
environment-related issue.

---



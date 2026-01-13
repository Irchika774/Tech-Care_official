# 👤 Profile Testing – Technician Module

## Introduction
This document describes the manual testing performed on the Technician
Profile functionality of the Tech Care Repair Scheduling System. Profile
testing ensures that technician personal information is displayed
correctly, can be updated securely, and is protected from unauthorized
access.

---

## Test Objectives
- Verify that profile details load correctly
- Validate accuracy of technician information
- Ensure profile editing and saving works properly
- Confirm validation and persistence of data
- Verify security by blocking unauthorized access

---

## Test Environment
- Application: Tech Care Repair Scheduling System
- User Role: Technician
- Browser: Google Chrome
- Platform: Web (Netlify Deployment)

---

## Test Scenarios & Results

---

### TC-PRO-01: View Profile Details
**Steps**
1. Log in as a technician
2. Navigate to Profile page

**Expected Result**
- Profile page loads correctly
- Technician details are visible

**Actual Result**
- Profile page loaded successfully
- All details displayed correctly

**Result**
✅ Pass

---

### TC-PRO-02: Profile Data Accuracy
**Steps**
1. Compare profile details with registration data

**Expected Result**
- Profile data should match registration information

**Actual Result**
- Profile data matched the registered information

**Result**
✅ Pass

---

### TC-PRO-03: Edit Profile Information
**Steps**
1. Navigate to Profile page
2. Edit allowed profile fields
3. Save changes

**Expected Result**
- Changes should be saved successfully

**Actual Result**
- Profile information updated successfully

**Result**
✅ Pass

---

### TC-PRO-04: Field Validation
**Steps**
1. Enter invalid or empty data in editable fields
2. Attempt to save changes

**Expected Result**
- Validation errors should be displayed

**Actual Result**
- Validation messages displayed correctly

**Result**
✅ Pass

---

### TC-PRO-05: Profile Update Persistence
**Steps**
1. Update profile details
2. Refresh the page
3. Revisit profile page

**Expected Result**
- Updated data should persist after refresh

**Actual Result**
- Updated data remained unchanged after refresh

**Result**
✅ Pass

---

### TC-PRO-06: Profile Page Refresh
**Steps**
1. Navigate to profile page
2. Refresh the browser

**Expected Result**
- Profile page should reload without errors

**Actual Result**
- Profile page reloaded correctly

**Result**
✅ Pass

---

### TC-PRO-07: Navigation From Profile
**Steps**
1. Navigate from Profile to Dashboard
2. Navigate back to Profile

**Expected Result**
- Navigation should work smoothly

**Actual Result**
- Navigation worked as expected

**Result**
✅ Pass

---

### TC-PRO-08: Unauthorized Access (Security)
**Steps**
1. Open an incognito browser window
2. Enter the direct profile page URL

**Expected Result**
- User should be redirected to login page
- Profile page should not be accessible

**Actual Result**
- User was redirected to  
  `https://techcare-official-new.netlify.app/login`
- Profile access was blocked successfully

**Result**
✅ Pass

---

## Conclusion
All profile-related test cases were executed successfully. The Profile
module functions correctly, supports secure data updates, maintains data
persistence, and properly restricts unauthorized access. No defects
were identified during profile testing.

---

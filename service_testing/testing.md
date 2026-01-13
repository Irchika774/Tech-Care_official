# 🛠️ Service Management Testing

## Introduction
This document describes the manual testing performed on the Service
Management feature of the Technician module. Testing covers service
creation, validation, image upload behavior, edit/delete actions, and
page refresh functionality.

---

## Test Environment
- Application: Tech Care Repair Scheduling System
- User Role: Technician
- Browser: Google Chrome
- Platform: Web (Netlify)

---

## Test Scenarios & Results

---

### TC-SER-01: Open Create New Service Gig
**Steps**
1. Navigate to Services section
2. Click Create New Service Gig

**Expected Result**
- Service creation modal should open

**Actual Result**
- Modal opened successfully

**Result**
✅ Pass

---

### TC-SER-02: Create Service With Valid Data (Without Image)
**Steps**
1. Enter valid service title, description, price, and duration
2. Do not upload an image
3. Click Save Gig

**Expected Result**
- Service should be saved successfully

**Actual Result**
- Service saved and displayed correctly

**Result**
✅ Pass

---

### TC-SER-03: Required Field Validation
**Steps**
1. Leave Service Title empty
2. Leave Price empty
3. Click Save Gig

**Expected Result**
- Validation should prevent saving the service

**Actual Result**
- Service was not saved

**Result**
✅ Pass

---

### TC-SER-04: Negative Price Validation
**Steps**
1. Enter price as -1000
2. Click Save Gig

**Expected Result**
- System should reject negative price

**Actual Result**
- System accepted negative price and saved service

**Result**
❌ Fail

---

### TC-SER-05: Long Description Handling
**Steps**
1. Enter a very long description text
2. Click Save Gig

**Expected Result**
- Long text should be handled without UI break

**Actual Result**
- Long description accepted successfully

**Result**
✅ Pass

---

### TC-SER-06: Image Upload (Small File Size)
**Steps**
1. Upload a valid image file (KB size, less than 5MB)
2. Click Save Gig

**Expected Result**
- Image should upload successfully
- Service should be saved

**Actual Result**
- Error message displayed: Bucket not found

**Result**
❌ Fail

---

### TC-SER-07: Edit Service
**Steps**
1. Select an existing service
2. Click Edit
3. Update details
4. Save changes

**Expected Result**
- Service should update successfully

**Actual Result**
- Edit functionality worked correctly

**Result**
✅ Pass

---

### TC-SER-08: Delete Service
**Steps**
1. Select an existing service
2. Click Delete
3. Confirm deletion

**Expected Result**
- Service should be removed

**Actual Result**
- Service deleted successfully

**Result**
✅ Pass

---

### TC-SER-09: Page Refresh Behavior
**Steps**
1. Navigate to Services page
2. Refresh the browser

**Expected Result**
- Page should reload and remain on Services page

**Actual Result**
- Page refreshed correctly and remained on same page

**Result**
✅ Pass

---

## Conclusion
Service creation, editing, deletion, and refresh behavior function
correctly. However, validation issues were found with negative pricing,
and image upload fails even for small image files, indicating a backend
or storage configuration issue.

---

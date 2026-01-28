# 🐞 Bug Report – Service Management Module

---

## BUG-SER-01: Negative Price Accepted

**Module:** Service Management  
**Severity:** Medium  
**Priority:** High  

**Description**  
The system allows saving a service with a negative price value.

**Steps to Reproduce**
1. Open Create New Service Gig
2. Enter price as -1000
3. Click Save Gig

**Expected Result**
- Negative price values should be rejected

**Actual Result**
- Service saved successfully with negative price

---

## BUG-SER-02: Image Upload Fails for All Image Sizes

**Module:** Service Management  
**Severity:** High  
**Priority:** High  

**Description**  
Uploading a service cover image fails even when the image size is very
small (KB range). The system displays a technical error message instead
of uploading the image.

**Steps to Reproduce**
1. Open Create New Service Gig
2. Upload a valid image file (less than 5MB)
3. Click Save Gig

**Expected Result**
- Image should upload successfully
- Service should be saved with image

**Actual Result**
- Error message displayed: Bucket not found

---

## Impact
- Technicians cannot upload service images
- Poor user experience due to technical error messages
- Service presentation is incomplete without images

---

## Possible Cause
- Storage bucket misconfiguration
- Incorrect environment variables for image storage
- Backend image upload service not connected

---

## Status
Open

---

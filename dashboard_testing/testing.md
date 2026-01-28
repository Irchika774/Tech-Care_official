# 🧑‍🔧 Dashboard Testing – Technician Module

## Introduction
This document describes the manual testing conducted on the Technician
Dashboard of the Tech Care Repair Scheduling System. The dashboard is the
first screen displayed after a successful login and provides an overview
of technician activities and earnings.

---

## Test Objective
- Verify that the dashboard loads correctly after login
- Validate the display of earnings, jobs, and ratings
- Ensure proper handling of zero data states
- Confirm UI stability during page refresh

---

## Test Environment
- Application: Tech Care Repair Scheduling System
- User Role: Technician
- Browser: Google Chrome
- Platform: Web (Netlify Deployment)

---

## Test Scenarios & Results

---

### TC-DASH-01: Dashboard Load After Login
**Steps**
1. Log in as a technician
2. Redirect to dashboard

**Expected Result**
- Dashboard loads successfully without errors

**Actual Result**
- Dashboard loaded correctly

**Result**
✅ Pass

---

### TC-DASH-02: Display of Earnings, Jobs, and Ratings
**Steps**
1. Log in to the system
2. Observe dashboard summary sections

**Expected Result**
- Earnings, job count, and ratings are displayed correctly

**Actual Result**
- All dashboard metrics were displayed correctly

**Result**
✅ Pass

---

### TC-DASH-03: Zero State Display
**Steps**
1. Log in with a technician account having no completed jobs
2. Observe earnings and job sections

**Expected Result**
- Zero values (e.g., Rs. 0, 0 jobs) should be displayed clearly

**Actual Result**
- Zero state values were displayed correctly without UI issues

**Result**
✅ Pass

---

### TC-DASH-04: Dashboard UI on Page Refresh
**Steps**
1. Navigate to dashboard
2. Refresh the page

**Expected Result**
- Dashboard should reload correctly
- No UI break or data loss

**Actual Result**
- Dashboard reloaded successfully without breaking the UI

**Result**
✅ Pass

---

## Conclusion
The Technician Dashboard functions as expected. All tested scenarios
passed successfully, including data display, zero state handling, and
page refresh behavior. The dashboard provides a stable and clear overview
of technician-related information after login.

---

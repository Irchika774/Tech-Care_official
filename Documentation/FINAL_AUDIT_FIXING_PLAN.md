# TechCare - Comprehensive Final Audit & Fixing Plan

This document outlines the detailed steps required to "Fix All" and "Check All" to ensure the TechCare application is production-ready, clean, and fully functional.

## Phase 1: Architecture & Route Cleanup
**Goal**: Remove unused files and ensure all active features are correctly routed.

- [x] **Redundant Page Deletion**:
    - Deleted `LandingPage.jsx`, `LandingPage.css`, `TermsOfService.jsx`, `PrivacyPolicy.jsx`, `Home_backup.jsx`.
    - Deleted unused `TechCareLanding.jsx`, `Blog.jsx`, `BlogPost.jsx`.
- [x] **Profile Route Integration**:
    - Added `<Route path="/profile" ... />` to `App.jsx`.
    - Profile is now accessible via `/profile` and linked in `AccountModal.jsx`.
- [x] **Component Audit**:
    - Deleted `DataSourceToggle.jsx` and removed legacy mock data logic from `store.js`.
    - Verified `googleSheetsService.js` is used as a fallback for the public Technicians page.

## Phase 2: Real-Time Standardization (Consistency)
**Goal**: Ensure every component uses the centralized `realtimeService.js`.

- [x] **TechnicianDashboard.jsx**: Standardized.
- [x] **Admin.jsx**: Standardized.
- [x] **Technicians.jsx**: Standardized to `realtimeService.js`.
- [x] **CustomerDashboard.jsx**: Standardized to `realtimeService.js`.
- [ ] **NotificationSystem**: Verify `realtimeService.subscribeToNotifications` is active in `Header.jsx` or a global layout.

## Phase 3: Feature Logic & Bug Fixes
**Goal**: Fix logical inconsistencies discovered during deep dive.

- [x] **Technician Marketplace**: Fixed filtering to exclude jobs already bid on.
- [x] **Admin Reviews**: Fixed PATCH permission for admins.
- [ ] **Profile Consolidator**:
    - `Profile.jsx` contains a "Settings" tab. Determine if `Settings.jsx` should be merged into `Profile.jsx` to have a single "Account Hub".
- [ ] **Booking Tracker real-time**: Ensure `BookingTracker.jsx` correctly updates when a technician changes the status via their dashboard.
- [ ] **Currency Consistency**: Ensure `CurrencyDisplay` component is used everywhere (especially in `Admin.jsx` and `TechnicianDashboard.jsx` instead of manual formatting).

## Phase 4: Security & Production Readiness
**Goal**: Secure the database and optimize performance.

- [ ] **Supabase RLS Audit**:
    - Verify `technicians` can only be updated by owners or admins.
    - Verify `bookings` are only visible to the customer who created it and the assigned technician.
- [ ] **Environment Variables**:
    - Ensure all services (Stripe, Google Maps, Supabase) have correct VITE prefixed variables.
- [ ] **SEO & Meta Tags**:
    - Verify every page has a unique `<SEO />` or `<Helmet />` tag with proper titles and descriptions.

## Phase 5: UI/UX Finishing Touches
**Goal**: Ensure a premium, high-end feel.

- [ ] **Loading States**: Add skeleton loaders to all dashboard tabs.
- [ ] **Empty States**: Create "No jobs found" or "No reviews yet" illustrations/components.
- [ ] **Glassmorphism Consistency**: Ensure all cards use the same `bg-zinc-900/40 backdrop-blur` style for a cohesive look.

---

## Technical Debt to Resolve
1.  **Duplicate Data Sources**: Some components still fetch from `techniciansAPI` (axios) while others use `supabase` (direct). Standardize to a single pattern.
2.  **Naming Inconsistency**: `user` role vs `customer` role in code (needs standardization).
3.  **LKR Formatting**: Ensure `Rs.` vs `LKR` is consistent across the app.

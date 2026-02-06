# 📜 Version History

## v2.5.1 - 2026-02-06
### 🛠️ Technical Improvements & Bug Fixes
- **Profile Loading Stability:** Resolved "Cannot read properties of undefined (reading 'name')" error on the profile page by implementing robust data unwrapping and safe fallbacks for all user roles.
- **Technician API Fix:** Rectified a `ReferenceError` in the technician profile route where the `technician` object was accessed before being fetched from the database.
- **UI Resiliency:** Added safe-guards in the profile header and avatar components to prevent crashes when extended profile data is partially missing or delayed.

## v2.5.0 - 2026-02-03
### 🏗️ Architecture & Maintenance
- **Schema Simplification:** Removed redundant `TECHNICIAN_SERVICES` and `TECHNICIAN_AVAILABILITY` tables, consolidating into unified `TECHNICIANS` model.
- **ER Diagram Update:** Refreshed Entity Relationship diagrams to reflect simplified database schema.
- **Use Case Cleanup:** Streamlined system diagrams by removing custom pricing complexity.
- **Permissions Matrix:** Updated role-based permissions to remove deprecated features.
- **Codebase Cleanup:** Removed deprecated migration files and optimized dashboard components.
- **Documentation Sync:** All diagrams and docs synchronized with current production architecture.

---

### v2.3.1 - 2026-02-02
### 🛠️ Technical Improvements
- **Admin Dashboard Stability**: Fixed a critical `ReferenceError` during initialization in the Admin dashboard by resolving forward-reference dependencies in `Admin.jsx`.
- **Initialization Sequence**: Optimized the auth and data loading order to ensure a stable state before rendering dashboard components.
- **Git Identity Correction**: Standardized all project commits under the `Wenura17125` identity.

## v2.3.0 - 2026-02-02
### ✨ New Features
- **Technician Schedule Management**: Technicians can now set their weekly availability (days off, working hours) directly from their profile settings.
- **Enhanced Profile Editing**: Improved UI for profile picture uploads with instant preview and status indicators.
- **Job Notifications**: Technicians receive instant notifications upon payment confirmation.
- **Feature Cleanup**: Removed AI-Powered Diagnostics to streamline the user workflow.

### 🐛 Bug Fixes
- **Profile Picture Upload**: Fixed an issue where the profile picture upload button was invisible or non-functional.
- **Technician Notifications**: Resolved a regression where job assignment notifications were not triggering after successful payment.
- **Schedule Editing**: Fixed missing schedule input fields in the profile edit modal.

### 🛠️ Technical Improvements
- **Payment Workflow**: Optimized Stripe payment confirmation webhook and API logic to ensure atomic updates with notification triggers.
- **Codebase Cleanup**: Removed legacy Mongoose artifacts in favor of pure Supabase implementation for specific routes.

---

## v2.2.1 - 2026-01-29
### 🚀 Deployment & Docs
- Finalized production deployment configuration for Netlify (Frontend) and Vercel (Backend).
- Updated architectural documentation (ERD, Sequence Flows) in README.

---

## v2.2.0 - 2026-01-28
### ⚡ Core Updates
- **Supabase Integration**: Full migration to Supabase for authentication and database.
- **Stripe Payments**: Integrated secure payment processing with LKR currency support.
- **Dashboard UI**: Revamped Customer and Technician dashboards with real-time stats.

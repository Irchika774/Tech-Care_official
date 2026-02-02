# 📜 Version History

## v2.3.0 - 2026-02-02
### ✨ New Features
- **Technician Schedule Management**: Technicians can now set their weekly availability (days off, working hours) directly from their profile settings.
- **Enhanced Profile Editing**: Improved UI for profile picture uploads with instant preview and status indicators.
- **Real-time Job Notifications**: Technicians now receive instant notifications when a payment is confirmed for their job assignment.

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

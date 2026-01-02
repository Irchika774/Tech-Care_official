# Role-Based Access Control (RBAC) & Visibility Report

This document outlines the specific permissions, actions, and visible components for each user role within the TechCare ecosystem.

## 1. Role Definitions

| Role | Description |
| :--- | :--- |
| **Guest** | Unauthenticated user visiting the website. |
| **Customer** | Authenticated user searching for repairs and managing bookings. |
| **Technician** | Authenticated service provider managing their shop and jobs. |
| **Admin** | System administrator with full oversight. |

---

## 2. Guest Role

### ✅ What they can do (Actions)
- **Search**: Search for technicians by location, name, or device type.
- **Filter**: Filter search results by rating, distance, price, and category.
- **View Profiles**: View public technician profiles, ratings, and reviews.
- **AI Diagnostics**: use the AI Diagnostic tool (Basic level) to get estimated repair costs.
- **Register/Login**: Sign up as a Customer or Technician.

### 👁️ What is visible to them (UI/UX)
- **Landing Page**: Full promotional content.
- **Technicians Page**: List of repair shops (Basic details: Name, Rating, Address).
   - *Hidden*: Exact contact details might be masked until login (optional).
- **Service Pages**: Mobile, PC, and Smart Device repair information.
- **Navigation**: Home, Services, Find Technicians, AI Diagnostics, Login, Register.
- **AI Tool**: Chat interface for diagnostics.

---

## 3. Customer Role (Authenticated)

### ✅ What they can do (Actions)
- **Everything from Guest Role**, plus:
- **Bookings**: Schedule appointments with technicians.
- **Chat**: Chat with technicians about specific jobs.
- **Reviews**: Leave ratings and reviews for completed services.
- **Profile Management**: Update personal info, view service history.
- **Favorites**: Save preferred repair shops.

### 👁️ What is visible to them (UI/UX)
- **Dashboard**: "My Bookings", "Service History", "Saved Technicians".
- **Booking Status**: Real-time updates (Pending, In Progress, Completed).
- **Invoices**: View and download digital invoices for repairs.
- **Navigation**: Adds "Dashboard", "My Account", "Logout".

---

## 4. Technician Role (Service Provider)

### ✅ What they can do (Actions)
- **Manage Profile**: Update shop hours, services offered, bio, and banners.
- **Job Management**: Accept or reject booking requests.
- **Status Updates**: Update job status (e.g., "Diagnosing", "Waiting for Parts", "Fixed").
- **Earnings**: View earnings reports and analytics.
- **Customer Chat**: Respond to customer inquiries.

### 👁️ What is visible to them (UI/UX)
- **Technician Dashboard**:
  - **Overview**: Active jobs, earnings summary, rating overview.
  - **Job Board**: List of incoming and active repair requests.
  - **Schedule**: Calendar view of appointments.
- **Profile Editor**: Tools to customize their public listing.
- **Analytics**: Charts showing profile views and booking trends.

---

## 5. Admin Role

### ✅ What they can do (Actions)
- **User Management**: Ban/Suspend users or technicians.
- **Verification**: Verify technician documents and approve "Verified" badges.
- **Platform Settings**: Update global currency rates, service categories.
- **Content Moderation**: Delete inappropriate reviews or chats.
- **Data Oversight**: Access global Google Sheets data sync settings.

### 👁️ What is visible to them (UI/UX)
- **Admin Dashboard**:
  - **User Stats**: Total users, active technicians.
  - **Verification Queue**: List of technicians awaiting approval.
  - **Reports**: Flagged content or disputes.
  - **System Health**: Database and API status.

---

## 6. Matrix Summary

| Feature | Guest | Customer | Technician | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Search Technicians** | ✅ | ✅ | ✅ | ✅ |
| **Use AI Diagnostics** | ✅ | ✅ | ✅ | ✅ |
| **Book Appointments** | ❌ | ✅ | ❌ | ❌ |
| **Message Users** | ❌ | ✅ | ✅ | ✅ |
| **Manage Shop Profile**| ❌ | ❌ | ✅ | ✅ |
| **Accept/Reject Jobs** | ❌ | ❌ | ✅ | ❌ |
| **Verify Users** | ❌ | ❌ | ❌ | ✅ |
| **View Analytics** | ❌ | ❌ | ✅ (Own) | ✅ (Global) |

# Speckit Workflow: Tech-Care Official

This document serves as the single source of truth for the **Tech-Care** project, structured according to the Speckit workflow. It defines the project's constitution, specifications, implementation plan, and current task status.

---

## 1.0 Project Description & Executive Summary

### 🌟 What is Tech-Care?
**Tech-Care** is a state-of-the-art, on-demand device repair platform designed to bridge the gap between users with broken devices and skilled, reliable technicians. It transforms the traditionally chaotic experience of finding a repair shop into a seamless, premium digital experience akin to booking an Uber or ordering food.

### 💡 The Core Value Proposition
*   **Trust & Transparency:** Users can view detailed technician profiles, verified reviews, and transparent pricing before booking.
*   **Convenience:** The platform offers robust search and filtering (by brand, issue, distance, price) to find the perfect match instantly.
*   **Premium Experience:** Unlike typical utility sites, Tech-Care offers a visually stunning, "dark-mode first" interface with glassmorphism effects, smooth animations, and a highly responsive design that feels native on any device.

### 🔍 Detailed Feature Ecosystem

#### 📱 Mobile Repair Hub (Home)
The entry point of the application. Users are greeted with a modern hero section and an intuitive search interface.
*   **Smart Filtering:** Users can filter technicians by specific device brands (Apple, Samsung), issues (Screen, Battery), and budget.
*   **Visual Discovery:** Technicians are presented in sleek cards showing ratings, distance, and starting prices.

#### 💻 PC & Laptop Specialist Zone
A dedicated section for more complex computer repairs.
*   **Advanced Diagnostics:** Filters tailored for PC issues (OS installation, Hardware upgrades, Virus removal).
*   **Detailed Insights:** Modal views allow users to deep-dive into a technician's expertise, seeing their specific skills and past customer feedback.

#### 👤 The User Command Center (Dashboard)
A fully-featured account management suite that keeps users in control.
*   **Service History:** A timeline of all past and upcoming repairs, complete with status tracking (Pending, In Progress, Completed).
*   **Favorites & Shortcuts:** Users can "heart" technicians they trust for instant re-booking.
*   **Profile Management:** A polished interface for managing personal details, avatars, and security settings.
*   **Settings:** Granular control over app preferences, including a global Dark/Light mode toggle and notification settings.

#### 🛡️ Admin & Operations Portal
The "Brain" of the platform for business owners.
*   **360° Oversight:** A dashboard displaying real-time metrics on users, bookings, and revenue.
*   **Content Control:** Full CRUD (Create, Read, Update, Delete) capabilities for managing users, technicians, and service categories.
*   **Quality Assurance:** Tools to moderate reviews and ensure platform integrity.

---

## 2.1 /speckit.constitution - Establish Project Principles

### 🛠️ Technology Stack
*   **Frontend Framework:** React 18.3.1 (Vite 5.4.21)
*   **Language:** JavaScript (ES Modules)
*   **Styling:** Tailwind CSS 3.4.3 + Tailwind Animate
*   **UI Components:** Radix UI Primitives (Shadcn-like), Lucide React Icons
*   **Routing:** React Router DOM 7.9.5
*   **Backend:** Node.js + Express 4.19.2
*   **Database:** MongoDB (Mongoose 8.3.4)
*   **Authentication:** JWT (jsonwebtoken), bcryptjs
*   **State Management:** React Context (ThemeProvider), Local State (useState/useReducer)

### 📐 Design Philosophy
*   **Mobile-First:** All layouts must be fully responsive, optimized for 375px width (iPhone SE) up to large desktops.
*   **Aesthetics:** "Premium & Modern" - use gradients, glassmorphism, smooth transitions (0.3s ease), and interactive hover states.
*   **Theme:** Native Dark Mode support with persistent user preference.
*   **Performance:** Zero console errors, optimized bundle size, lazy loading where appropriate.

### 📝 Coding Standards
*   **Structure:** Modular component architecture (`src/components`, `src/pages`, `src/context`).
*   **Naming:** PascalCase for components, camelCase for functions/variables.
*   **Linting:** ESLint with React Hooks and Refresh plugins.
*   **Clean Code:** No hardcoded secrets (use `.env`), meaningful variable names, comprehensive comments for complex logic.

---

## 2.2 /speckit.specify - Create Baseline Specification

### 🎯 Project Vision
Tech-Care is a comprehensive platform connecting users with device repair technicians. It offers a seamless booking experience for mobile and PC repairs, complete with user profiles, reviews, and an admin dashboard.

### 👤 User Roles
1.  **User:** Can browse technicians, book appointments, leave reviews, and manage their profile.
2.  **Technician:** (Future) Can manage their availability and view bookings.
3.  **Admin:** Full control over users, technicians, appointments, and platform settings.

### 📦 Core Modules & Features

#### 1. Mobile Repair (Home)
*   **Search & Filter:** Find technicians by brand, issue, price, and distance.
*   **Listings:** Grid view of available technicians with ratings and "Book Now" options.
*   **Hero Section:** Engaging landing area with quick access to services.

#### 2. PC Repair
*   **Advanced Filtering:** Filter by specific PC issues, OS, and hardware types.
*   **Sorting:** Sort by Price, Rating, Distance.
*   **Technician Details:** Modal view with full bio, expertise, and reviews.

#### 3. User Account
*   **Profile:** Editable personal information and avatar.
*   **History:** List of past and upcoming appointments with status badges.
*   **Favorites:** Saved technicians for quick access.
*   **Settings:** App preferences (Dark Mode, Notifications, Language).

#### 4. Reviews System
*   **Submission:** Interactive star rating and text review.
*   **Display:** List of reviews with user avatars and helpful counts.
*   **Stats:** Aggregate rating and breakdown.

#### 5. Admin Panel
*   **Dashboard:** High-level metrics (Users, Bookings, Revenue).
*   **Management:** CRUD operations for Users, Technicians, and Services.

---

## 2.3 /speckit.plan - Create Implementation Plan

### 🏗️ Architecture
*   **Client-Side (SPA):** The application runs as a Single Page Application served by Vite.
*   **API Layer:** Express server provides REST endpoints (`/api/users`, `/api/technicians`, etc.).
*   **Database:** MongoDB stores all persistent data.

### 🗺️ Routing Structure
```
/                   -> Home (Mobile Repair)
/pc-repair          -> PC Repair Services
/schedule           -> Appointment Booking
/reviews            -> Reviews & Ratings
/login              -> User Authentication
/register           -> New User Registration
/profile            -> User Profile Dashboard
/history            -> Service History
/favorites          -> Saved Technicians
/settings           -> Application Settings
/admin              -> Admin Dashboard (Protected)
```

### 💾 Data Models (Key Schemas)
*   **User:** `name`, `email`, `password`, `role`, `avatar`, `preferences`
*   **Technician:** `name`, `specialization`, `rating`, `location`, `services`, `availability`
*   **Appointment:** `userId`, `technicianId`, `date`, `status`, `serviceType`
*   **Review:** `userId`, `technicianId`, `rating`, `comment`, `date`

---

## 2.4 /speckit.tasks - Generate Actionable Tasks

### ✅ Completed Tasks
*   [x] **Project Setup:** Vite + React + Tailwind configuration.
*   [x] **PC Repair Page:** Full implementation with filters, sorting, and modals. (100% Complete)
*   [x] **Admin Panel:** Comprehensive dashboard with CRUD forms. (100% Complete)
*   [x] **User Dashboard:** Profile, History, Favorites, and Settings pages.
*   [x] **UI Components:** Toast notifications, Modals, Loading spinners, Technician Cards.
*   [x] **Theming:** Robust Light/Dark mode implementation.

### 🚧 In Progress / Pending Tasks
*   [ ] **Home Page Enhancement:**
    *   [ ] Implement functional filters (Brand, Issue, Price).
    *   [ ] Add "Load More" pagination.
    *   [ ] Integrate Technician Detail modal (port from PC Repair).
*   [ ] **Reviews Page Enhancement:**
    *   [ ] Enable real review submission (connect to state/backend).
    *   [ ] Add filtering and sorting for reviews.
    *   [ ] Visualize rating breakdown.
*   [ ] **Backend Integration:**
    *   [ ] Connect frontend forms to Express API endpoints.
    *   [ ] Replace mock data with MongoDB queries.
*   [ ] **Authentication:**
    *   [ ] Finalize JWT flow for Login/Register.
    *   [ ] Protect `/admin` and `/profile` routes.

---

## 2.5 /speckit.implement - Execute Implementation

### 🚀 Current Status: **Production Ready (Frontend)**
The frontend is highly polished and functional as a standalone demo. The PC Repair and Admin sections are the "Gold Standard" for the rest of the application.

### 📅 Implementation Log
*   **2025-11-05:** PC Repair and Admin Panel marked as 100% complete.
*   **2025-11-20:** Mobile responsiveness optimized for iPhone SE (375px).
*   **2025-11-25:** User Dashboard pages (Profile, History, Settings) finalized.

### 🔮 Next Sprint Focus
1.  **Home Page Parity:** Bring the Home page functionality up to the same level as the PC Repair page.
2.  **Review System Logic:** Make the reviews page interactive and stateful.
3.  **API Connection:** Begin wiring up the "Real" backend.

---

## Enhancement Commands (Usage Guide)

*   **/speckit.clarify:** Run before starting the "Backend Integration" task to define exact API payloads.
*   **/speckit.analyze:** Run after "Home Page Enhancement" to ensure it matches the PC Repair page's quality.
*   **/speckit.checklist:** Use to verify all acceptance criteria before marking a feature as "Done".

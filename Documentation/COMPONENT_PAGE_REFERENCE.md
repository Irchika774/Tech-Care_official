# TechCare - Component & Page Reference (100% Coverage)

This document provides a comprehensive map of all pages, components, and logic within the TechCare application.

## 1. Frontend Pages (32 Active Pages)

| Page | Route | Component | Purpose | Key Buttons & Features | Critical Logic |
|------|-------|-----------|---------|------------------------|----------------|
| **Home** | `/` | `Home.jsx` | Main Landing | "Book Now", "Find Tech", Device Categories, Statistics, Reviews slider | Fetches featured techs, dynamic scrolling |
| **Mobile Repair** | `/mobile-repair` | `MobileRepair.jsx` | Mobile Landing | Device selection, "Book Now" | Filters techs by specialty: 'Mobile' |
| **PC Repair** | `/pc-repair` | `PCRepair.jsx` | PC Landing | Brand search, "Book Now" | Filters techs by specialty: 'PC' |
| **Technicians** | `/technicians` | `Technicians.jsx` | Directory | Filter by District, Specialty, Rating. Search bar. | Multi-source fetch (Supabase -> Axios -> GS) |
| **Reviews** | `/reviews` | `Reviews.jsx` | Public Feedback | Submit Review (Modal), Filter by Service | Aggregate rating logic, Pagination |
| **Services** | `/services` | `Services.jsx` | Catalog | Service cards, "Select" button | Redirects to `/schedule` with state |
| **Diagnostics** | `/diagnostics` | `Diagnostics.jsx` | AI Troubleshooting | Chat Interface, "Book Repair" | ⚠️ Bug: Navigates to `/booking` instead of `/schedule` |
| **Schedule** | `/schedule` | `Schedule.jsx` | Booking Flow | Step 1: Details, Step 2: Payment (via redirect), Step 3: Time Selection | `BookingGuard`, multi-step state management |
| **Payment** | `/payment` | `Payment.jsx` | Stripe Checkout | "Pay Now", "Cancel" | `Stripe Elements` integration, webhook fallback |
| **Customer Dashboard**| `/customer-dashboard` | `CustomerDashboard.jsx` | User Hub | "Book Now", "Track Detail", "Chat", "Cancel Repair", "Add Device" | Subscribes to `bookings`, `notifications`, `bids` |
| **Technician Dashboard**| `/technician-dashboard` | `TechnicianDashboard.jsx`| Tech Hub | "Bid Now", "Update Status", "Withdraw Earnings", "CRUD Gigs", "Inventory" | 6+ Real-time subscriptions, Payout logic |
| **Admin Panel** | `/admin` | `Admin.jsx` | Management | "Verify Tech", "Approve Gig", "System Stats", "Member Management" | Master controller for all DB tables |
| **Chat** | `/chat/:bookingId` | `Chat.jsx` | Messaging | "Send Message", "Upload Image", "Voice Note"(?) | Real-time message streaming, Auth protected |
| **Booking Tracker** | `/tracker/:bookingId` | `BookingTracker.jsx` | Status Viewer | Live progress bar, Technician contact | Subscribes to `bookings` for status changes |
| **Profile** | `/profile` | `Profile.jsx` | Account Hub | "Update Info", "Change Avatar", "Switch Role"(?) | Common core for User/Tech/Admin |
| **Settings** | `/settings` | `Settings.jsx` | Preferences | Theme toggle, Notification settings, Privacy | Persists settings via `useDataStore` (now cleaned) |
| **History** | `/history` | `History.jsx` | Past Repairs | "Download Receipt", "Re-book" | Fetches completed status bookings |
| **Favorites** | `/favorites` | `Favorites.jsx` | Saved Techs | "Hire Again", "Remove" | CRUD for `favorites` table |
| **Compare** | `/compare` | `Compare.jsx` | Analysis | Side-by-side view | Selection logic between multiple techs |
| **Careers** | `/careers` | `Careers.jsx` | HR Page | "Apply Now" | Static forms |
| **Support** | `/support` | `Support.jsx` | Help Center | FAQ Accordion, Contact Form | Knowledge base navigation |
| **Company** | `/company` | `Company.jsx` | About Us | Timeline, Team section | Static content |
| **Login** | `/login` | `Login.jsx` | Auth | Google Login, Email Login | `AuthContext` provider sync |
| **Register** | `/register` | `Register.jsx` | New Account | Role selection (Customer/Tech) | Multi-table insert (Auth + Profile) |

---

## 2. Shared Components (53 Total)

### Core UI Components (`/src/components/ui/`)
All Shadcn UI primitives: `Button`, `Input`, `Card`, `Tabs`, `Dialog`, `Toaster`, `Badge`, `Avatar`, `Skeleton`, `Popover`, `ScrollArea`, `Select`, `Switch`.

### Specialized Business Components (`/src/components/`)
| Component | Purpose | Key Interactive Elements |
|-----------|---------|-------------------------|
| `Header.jsx` | Navigation | Search Icon, Notification Bell, Account Dropdown, Theme Toggle |
| `Footer.jsx` | Global Linkage | Newsletter Signup, Social Links, Service Tree |
| `QuickBookingForm.jsx`| Fast repair request | Device pickers, Issue description, "Next" button |
| `TechnicianCard.jsx` | Search Result Card | "View Profile", "Hire Now", Favorite Toggle |
| `AIDiagnostics.jsx` | Conversational Tool | Bot Chat, Symptom Chips, Auto-Analysis |
| `CurrencyDisplay.jsx` | Price consistency | Absolute value formatting, LKR prefix |
| `EarningsChart.jsx` | Data Visualization | Tooltips, Timeframe filter (Weekly/Monthly) |
| `GoogleMap.jsx` | Location Picking | Interactive pins, Address Geocoding |
| `ImageUpload.jsx` | Media handling | Drag & Drop, Preview, Compression |
| `InvoiceGenerator.jsx`| Document creation | "Download PDF" |
| `NotificationBell.jsx`| Real-time alerts | Unread badge, Dropdown list |

---

## 3. Backend API Reference (`/server/routes/`)

| Route Group | Base Path | Key Endpoints | Logic |
|-------------|-----------|---------------|-------|
| **Technicians** | `/api/technicians` | `GET /dashboard`, `PUT /profile`, `POST /bids`, `GET /jobs` | Complex aggregation for shop stats |
| **Bookings** | `/api/bookings` | `POST /`, `PATCH /:id`, `PUT /:id/status` | Notification triggers on status change |
| **Customers** | `/api/customers` | `GET /me`, `POST /devices`, `DELETE /me` | User account lifecycle |
| **Admin** | `/api/admin` | `GET /stats`, `PATCH /verify/:id`, `GET /logs` | Cross-system data overrides |
| **Services** | `/api/services` | `GET /`, `POST /` | Pricing and category master |
| **Payments** | `/api/payment` | `POST /create-intent`, `POST /webhook` | Stripe lifecycle management |

---

## 4. Current Incomplete / Missing Things (Backlog)

1.  **Logic Bugs**:
    *   `Diagnostics.jsx` links to `/booking` (Route does not exist - should be `/schedule`).
    *   `Schedule.jsx` Step 2 skip logic sometimes fails if browser is refreshed during payment.
2.  **Incomplete Features**:
    *   `Chat.jsx` supports images but backend cleanup for old images is missing.
    *   `Admin.jsx` "System Logs" tab is UI-only, no backend connection yet.
    *   `InvoiceGenerator.jsx` needs styling for the generated PDF.
3.  **UI/UX Gaps**:
    *   Skeleton loaders missing on `History.jsx` and `Favorites.jsx`.
    *   Error boundaries are global; need component-level boundaries for Dashboards.
4.  **Security**:
    *   Supabase RLS for `user_devices` needs stricter "owner only" policy.

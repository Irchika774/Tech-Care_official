# TechCare - Complete Component & Page Reference (Master Inventory v2.0)
## Every Page, Component, Button, Feature & API Endpoint

Last Updated: January 15, 2026

---

## 1. FRONTEND PAGES INVENTORY (35 Total)

### 1.1 Public Pages (Accessible Without Login)

| # | Page Name | File | Route | Purpose | Status | Known Issues |
|---|-----------|------|-------|---------|--------|--------------|
| 1 | Home | `Home.jsx` | `/` | Landing page, redirects logged users | ✅ Working | None |
| 2 | PC Repair | `PCRepair.jsx` | `/pc-repair` | PC/Laptop repair services | ✅ Working | None |
| 3 | Mobile Repair | `MobileRepair.jsx` | `/mobile-repair` | Phone repair services | ✅ Working | None |
| 4 | Tablet Repair | `TabletRepair.jsx` | `/tablet-repair` | Tablet repair services | ✅ Working | None |
| 5 | Technicians | `Technicians.jsx` | `/technicians` | Browse all technicians | ✅ Working | **Fixed**: District filter from navigation |
| 6 | Reviews | `Reviews.jsx` | `/reviews` | Public reviews feed | ✅ Working | None |
| 7 | Services | `Services.jsx` | `/services` | Service categories | ✅ Working | None |
| 8 | Diagnostics | `Diagnostics.jsx` | `/diagnostics` | AI diagnosis chat | ✅ Working | None |
| 9 | Service Areas | `ServiceAreas.jsx` | `/service-areas` | Coverage map | ✅ Working | **Fixed**: Find Technicians button navigation |
| 10 | Company | `Company.jsx` | `/company` | About us page | ✅ Working | None |
| 11 | Support | `Support.jsx` | `/support` | Help center & FAQ | ✅ Working | **Fixed**: Send Message button, search answers |
| 12 | Terms | `Terms.jsx` | `/terms` | Terms of Service | ✅ Working | None |
| 13 | Privacy | `Privacy.jsx` | `/privacy` | Privacy Policy | ✅ Working | None |
| 14 | Blog | `Blog.jsx` | `/blog` | Article listing | ✅ Working | None |
| 15 | Blog Post | `BlogPost.jsx` | `/blog/:slug` | Single article | ✅ Working | None |
| 16 | Careers | `Careers.jsx` | `/careers` | Job listings | ✅ Working | None |
| 17 | Partner | `Partner.jsx` | `/partner` | Partnership portal | ✅ Working | None |
| 18 | How It Works | `HowItWorks.jsx` | `/how-it-works` | Platform guide | ✅ Working | None |

### 1.2 Authentication Pages

| # | Page Name | File | Route | Purpose | Status | Known Issues |
|---|-----------|------|-------|---------|--------|--------------|
| 19 | Login | `Login.jsx` | `/login` | User login | ✅ Working | None |
| 20 | Register | `Register.jsx` | `/register` | New user signup | ✅ Working | None |
| 21 | Forgot Password | `ForgotPassword.jsx` | `/forgot-password` | Password recovery | ✅ Working | None |
| 22 | Reset Password | `ResetPassword.jsx` | `/reset-password` | Password reset | ✅ Working | None |

### 1.3 Customer Protected Pages (Role: user/customer)

| # | Page Name | File | Route | Purpose | Status | Known Issues |
|---|-----------|------|-------|---------|--------|--------------|
| 23 | Customer Dashboard | `CustomerDashboard.jsx` | `/customer-dashboard` | User home | ✅ Working | None |
| 24 | Profile | `Profile.jsx` | `/profile` | User profile | ✅ Working | **Fixed**: Address sync |
| 25 | History | `History.jsx` | `/history` | Past bookings | ✅ Working | None |
| 26 | Favorites | `Favorites.jsx` | `/favorites` | Saved technicians | ✅ Working | None |
| 27 | Settings | `Settings.jsx` | `/settings` | Account settings | ✅ Working | None |
| 28 | Compare | `Compare.jsx` | `/compare` | Technician comparison | ✅ Working | None |
| 29 | Schedule | `Schedule.jsx` | `/schedule` | Booking wizard | ✅ Working | None |
| 30 | Payment | `Payment.jsx` | `/payment` | Stripe checkout | ✅ Working | None |
| 31 | Payment Success | `PaymentSuccess.jsx` | `/payment-success` | Post-payment | ✅ Working | None |
| 32 | Booking Tracker | `BookingTracker.jsx` | `/tracker/:id` | Live status | ✅ Working | None |
| 33 | Chat | `Chat.jsx` | `/chat/:id` | Messaging | ✅ Working | None |

### 1.4 Technician Protected Pages (Role: technician)

| # | Page Name | File | Route | Purpose | Status | Known Issues |
|---|-----------|------|-------|---------|--------|--------------|
| 34 | Tech Dashboard | `TechnicianDashboard.jsx` | `/technician-dashboard` | Tech hub | ✅ Working | None |

### 1.5 Admin Protected Pages (Role: admin)

| # | Page Name | File | Route | Purpose | Status | Known Issues |
|---|-----------|------|-------|---------|--------|--------------|
| 35 | Admin Dashboard | `Admin.jsx` | `/admin` | System management | ✅ Working | None |

---

## 2. FRONTEND COMPONENTS INVENTORY (28 Core + 23 UI)

### 2.1 Core Application Components

| # | Component | File | Purpose | Used By | Status |
|---|-----------|------|---------|---------|--------|
| 1 | Header | `Header.jsx` | Navigation bar | All pages (Layout) | ✅ Complete |
| 2 | Footer | `Footer.jsx` | Site footer | All pages (Layout) | ✅ Complete |
| 3 | Layout | `Layout.jsx` | Page wrapper | App.jsx routing | ✅ Complete |
| 4 | SEO | `SEO.jsx` | Meta tags | All pages | ✅ Complete |
| 5 | Loading | `Loading.jsx` | Loading spinner | Multiple pages | ✅ Complete |
| 6 | ErrorBoundary | `ErrorBoundary.jsx` | Error handling | App.jsx | ✅ Complete |
| 7 | ProtectedRoute | `ProtectedRoute.jsx` | Auth guard | App.jsx routing | ✅ Complete |
| 8 | RoleBasedRedirect | `RoleBasedRedirect.jsx` | Role routing | App.jsx | ✅ Complete |
| 9 | Toast | `Toast.jsx` | Notifications | Global (useToast) | ✅ Complete |

### 2.2 Feature Components

| # | Component | File | Purpose | Used By | Status |
|---|-----------|------|---------|---------|--------|
| 10 | AIDiagnostics | `AIDiagnostics.jsx` | AI chat logic | Diagnostics.jsx | ✅ Complete |
| 11 | AccountModal | `AccountModal.jsx` | User dropdown | Header.jsx | ✅ Complete |
| 12 | BookingCancellation | `BookingCancellation.jsx` | Cancel flow | CustomerDashboard | ✅ Complete |
| 13 | BookingGuard | `BookingGuard.jsx` | Schedule guard | Schedule.jsx | ✅ Complete |
| 14 | BookingTracker | `BookingTracker.jsx` | Progress bar | Tracker page | ✅ Complete |
| 15 | CurrencyDisplay | `CurrencyDisplay.jsx` | LKR formatting | Multiple | ✅ Complete |
| 16 | EarningsChart | `EarningsChart.jsx` | Revenue chart | TechDashboard | ✅ Complete |
| 17 | EmptyState | `EmptyState.jsx` | Empty data view | Multiple | ✅ Complete |
| 18 | GoogleMap | `GoogleMap.jsx` | Map embed | ServiceAreas | ⚠️ Needs Key |
| 19 | ImageUpload | `ImageUpload.jsx` | File upload | Profile, Gigs | ✅ Complete |
| 20 | InvoiceGenerator | `InvoiceGenerator.jsx` | PDF invoices | TechDashboard | ✅ Complete |
| 21 | LoyaltyPoints | `LoyaltyPoints.jsx` | Points display | CustomerDashboard | ✅ Complete |
| 22 | NotificationBell | `NotificationBell.jsx` | Alert icon | Header.jsx | ✅ Complete |
| 23 | NotificationsModal | `NotificationsModal.jsx` | Notifications list | Header.jsx | ✅ Complete |
| 24 | QuickBookingForm | `QuickBookingForm.jsx` | Fast booking | Home variants | ✅ Complete |
| 25 | SearchModal | `SearchModal.jsx` | Global search | Header.jsx | ✅ Complete |
| 26 | TechCareLogo | `TechCareLogo.jsx` | Logo component | Header, Footer | ✅ Complete |
| 27 | TechnicianCard | `TechnicianCard.jsx` | Tech profile card | Technicians | ✅ Complete |
| 28 | VideoHeroBackground | `VideoHeroBackground.jsx` | Video bg | Landing pages | ✅ Complete |

### 2.3 UI Components (shadcn/ui based)

| # | Component | File | Purpose | Status |
|---|-----------|------|---------|--------|
| 1 | Button | `ui/button.jsx` | Buttons | ✅ |
| 2 | Card | `ui/card.jsx` | Card containers | ✅ |
| 3 | Input | `ui/input.jsx` | Text inputs | ✅ |
| 4 | Select | `ui/select.jsx` | Dropdowns | ✅ |
| 5 | Badge | `ui/badge.jsx` | Status badges | ✅ |
| 6 | Dialog | `ui/dialog.jsx` | Modal dialogs | ✅ |
| 7 | Tabs | `ui/tabs.jsx` | Tab navigation | ✅ |
| 8 | Table | `ui/table.jsx` | Data tables | ✅ |
| 9 | Avatar | `ui/avatar.jsx` | User avatars | ✅ |
| 10 | Progress | `ui/progress.jsx` | Progress bars | ✅ |
| 11 | Skeleton | `ui/skeleton.jsx` | Loading placeholders | ✅ |
| 12 | Accordion | `ui/accordion.jsx` | Collapsibles | ✅ |
| 13 | Textarea | `ui/textarea.jsx` | Multi-line input | ✅ |
| 14 | Label | `ui/label.jsx` | Form labels | ✅ |
| 15 | Slider | `ui/slider.jsx` | Range sliders | ✅ |
| 16 | Switch | `ui/switch.jsx` | Toggle switches | ✅ |
| 17 | Tooltip | `ui/tooltip.jsx` | Tooltips | ✅ |
| 18 | Calendar | `ui/calendar.jsx` | Date picker | ✅ |
| 19 | Popover | `ui/popover.jsx` | Popovers | ✅ |
| 20 | Separator | `ui/separator.jsx` | Dividers | ✅ |
| 21 | Sheet | `ui/sheet.jsx` | Side panels | ✅ |
| 22 | Toaster | `ui/toaster.jsx` | Toast container | ✅ |
| 23 | DropdownMenu | `ui/dropdown-menu.jsx` | Dropdown menus | ✅ |

---

## 3. BACKEND API ROUTES (18 Route Files)

### 3.1 Authentication Routes (`auth.js`)

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| POST | `/api/auth/register` | Register new user | None | ✅ |
| POST | `/api/auth/login` | User login | None | ✅ |
| POST | `/api/auth/logout` | User logout | Bearer | ✅ |
| POST | `/api/auth/refresh` | Refresh token | JWT | ✅ |
| POST | `/api/auth/forgot-password` | Request reset | None | ✅ |
| POST | `/api/auth/reset-password` | Reset password | Token | ✅ |

### 3.2 Customer Routes (`customers.js`)

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| GET | `/api/customers/dashboard` | Dashboard data | Bearer | ✅ |
| GET | `/api/customers/profile` | Get profile | Bearer | ✅ |
| PATCH | `/api/customers/profile` | Update profile | Bearer | ✅ |
| GET | `/api/customers/bookings` | List bookings | Bearer | ✅ |
| POST | `/api/customers/bookings` | Create booking | Bearer | ✅ |
| PATCH | `/api/customers/bookings/:id` | Update booking | Bearer | ✅ |
| POST | `/api/customers/bookings/:id/select-bid` | Accept bid | Bearer | ✅ |
| GET | `/api/customers/bookings/:id/bids` | Get bids | Bearer | ✅ |
| GET | `/api/customers/favorites` | List favorites | Bearer | ✅ |
| POST | `/api/customers/favorites/:techId` | Add favorite | Bearer | ✅ |
| DELETE | `/api/customers/favorites/:techId` | Remove favorite | Bearer | ✅ |
| POST | `/api/customers/reviews` | Submit review | Bearer | ✅ |
| GET | `/api/customers/notifications` | List notifications | Bearer | ✅ |
| PATCH | `/api/customers/notifications/:id` | Mark read | Bearer | ✅ |

### 3.3 Technician Routes (`technicians.js`)

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| GET | `/api/technicians/dashboard` | Dashboard data | Bearer | ✅ |
| GET | `/api/technicians/profile` | Get profile | Bearer | ✅ |
| PATCH | `/api/technicians/profile` | Update profile | Bearer | ✅ |
| GET | `/api/technicians/jobs` | Active jobs | Bearer | ✅ |
| GET | `/api/technicians/marketplace` | Open jobs | Bearer | ✅ |
| POST | `/api/technicians/bids` | Submit bid | Bearer | ✅ |
| DELETE | `/api/technicians/bids/:id` | Withdraw bid | Bearer | ✅ |
| PATCH | `/api/technicians/bookings/:id/status` | Update status | Bearer | ✅ |
| GET | `/api/technicians/gigs` | My gigs | Bearer | ✅ |
| POST | `/api/technicians/gigs` | Create gig | Bearer | ✅ |
| PATCH | `/api/technicians/gigs/:id` | Update gig | Bearer | ✅ |
| DELETE | `/api/technicians/gigs/:id` | Delete gig | Bearer | ✅ |
| GET | `/api/technicians/earnings` | Earnings data | Bearer | ✅ |
| GET | `/api/technicians/public` | Public list | None | ✅ |
| GET | `/api/technicians/:id` | Public profile | None | ✅ |

### 3.4 Admin Routes (`admin.js`)

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| GET | `/api/admin/dashboard` | Stats overview | Admin | ✅ |
| GET | `/api/admin/users` | All users | Admin | ✅ |
| DELETE | `/api/admin/users/:id` | Delete user | Admin | ✅ |
| GET | `/api/admin/technicians` | All techs | Admin | ✅ |
| PATCH | `/api/admin/technicians/:id` | Verify/block | Admin | ✅ |
| GET | `/api/admin/bookings` | All bookings | Admin | ✅ |
| GET | `/api/admin/reviews` | All reviews | Admin | ✅ |
| DELETE | `/api/admin/reviews/:id` | Delete review | Admin | ✅ |
| GET | `/api/admin/gigs` | All gigs | Admin | ✅ |
| PATCH | `/api/admin/gigs/:id` | Approve gig | Admin | ✅ |
| GET | `/api/admin/logs` | Audit logs | Admin | ✅ |

### 3.5 Payment Routes (`payment.js`)

| Method | Endpoint | Purpose | Auth | Status |
|--------|----------|---------|------|--------|
| POST | `/api/payment/create-intent` | Create Stripe intent | Bearer | ✅ |
| POST | `/api/payment/confirm-payment` | Confirm payment | Bearer | ✅ |
| GET | `/api/payment/status/:id` | Payment status | Bearer | ✅ |
| POST | `/api/payment/refund` | Process refund | Admin | ✅ |

### 3.6 Other Routes

| File | Key Endpoints | Status |
|------|---------------|--------|
| `bookings.js` | `/api/bookings/*` - Status updates, tracking | ✅ |
| `reviews.js` | `/api/reviews/*` - Public reviews, stats | ✅ |
| `search.js` | `/api/search` - Full-text search | ✅ |
| `blog.js` | `/api/blog/*` - Article management | ✅ |
| `common.js` | `/api/common/apply`, `/api/common/partner-request` | ✅ |
| `gigs.js` | `/api/gigs/*` - Service listings | ✅ |
| `jobs.js` | `/api/jobs/*` - Job marketplace | ✅ |
| `loyalty.js` | `/api/loyalty/*` - Points management | ✅ |
| `notifications.js` | `/api/notifications/*` - Alert system | ✅ |
| `services.js` | `/api/services/*` - Service categories | ✅ |
| `emails.js` | `/api/emails/*` - Email sending (Resend) | ✅ |

---

## 4. CONTEXT & SERVICES

### 4.1 React Context Providers

| Context | File | Purpose | Features |
|---------|------|---------|----------|
| AuthContext | `context/AuthContext.jsx` | User auth state | Login, logout, session, role |
| ToastContext | `hooks/use-toast.js` | Toast notifications | Show, dismiss, variants |

### 4.2 Services & Utilities

| Service | File | Purpose | Status |
|---------|------|---------|--------|
| Supabase Client | `lib/supabase.js` | Database access | ✅ |
| Real-time Service | `utils/realtimeService.js` | WebSocket subscriptions | ✅ |
| Google Sheets Service | `lib/googleSheetsService.js` | External tech data | ✅ |
| Currency Formatter | `lib/currency.js` | LKR formatting | ✅ |
| Date Formatter | `lib/dateUtils.js` | Date handling | ✅ |

---

## 5. BUTTONS & INTERACTIONS AUDIT

### 5.1 Critical Action Buttons (All Pages)

| Page | Button | Handler | API Call | Status |
|------|--------|---------|----------|--------|
| Support | Send Message | `handleContactSubmit` | Simulated | ✅ Fixed |
| ServiceAreas | Find Technicians | `navigate('/technicians')` | None | ✅ Fixed |
| Profile | Save Changes | `handleProfileUpdate` | PATCH /profile | ✅ Fixed |
| Schedule | Continue to Payment | Form submit | Navigate | ✅ Working |
| Schedule | Confirm Booking | Form submit | PATCH /bookings | ✅ Working |
| Payment | Pay Now | Stripe confirm | POST /confirm-payment | ✅ Working |
| CustomerDashboard | Accept Bid | `handleSelectBid` | POST /select-bid | ✅ Working |
| CustomerDashboard | Cancel Booking | `handleCancel` | PATCH /bookings | ✅ Working |
| TechDashboard | Submit Bid | `handleSubmitBid` | POST /bids | ✅ Working |
| TechDashboard | Complete Job | `handleStatusUpdate` | PATCH /status | ✅ Working |
| Admin | Verify Technician | `handleVerify` | PATCH /technicians | ✅ Working |
| Admin | Delete User | `handleDeleteUser` | DELETE /users | ✅ Working |
| Chat | Send | `handleSendMessage` | POST /messages | ✅ Working |

### 5.2 Navigation Buttons

| Location | Button | Destination | Status |
|----------|--------|-------------|--------|
| Header | Logo | `/` | ✅ |
| Header | Services dropdown | Service pages | ✅ |
| Header | Technicians | `/technicians` | ✅ |
| Header | AI Diagnostics | `/diagnostics` | ✅ |
| Header | Areas | `/service-areas` | ✅ |
| Header | Support | `/support` | ✅ |
| Header | Login | `/login` | ✅ |
| Header | Register | `/register` | ✅ |
| Header | Dashboard | Role-based | ✅ |
| Footer | All links | Various pages | ✅ |

---

## 6. FEATURE COMPLETENESS CHECKLIST

### 6.1 Customer Features

| Feature | Status | Notes |
|---------|--------|-------|
| Register account | ✅ Complete | |
| Login/Logout | ✅ Complete | |
| Browse technicians | ✅ Complete | |
| Filter technicians | ✅ Complete | By district, service, rating |
| AI Diagnostics | ✅ Complete | Gemini integration |
| Book repair service | ✅ Complete | Multi-step wizard |
| Pay for service | ✅ Complete | Stripe integration |
| Track repair status | ✅ Complete | Real-time updates |
| Chat with technician | ✅ Complete | Real-time messaging |
| Submit review | ✅ Complete | After completion |
| View history | ✅ Complete | Past bookings |
| Favorite technicians | ✅ Complete | Save/remove |
| Compare technicians | ✅ Complete | Side-by-side |
| Loyalty points | ✅ Complete | Earn on bookings/reviews |
| Profile management | ✅ Complete | Edit all fields |
| Cancel booking | ✅ Complete | Before in-progress |
| Reschedule booking | ✅ Complete | Change date/time |

### 6.2 Technician Features

| Feature | Status | Notes |
|---------|--------|-------|
| Register as technician | ✅ Complete | |
| Complete profile | ✅ Complete | Skills, bio, district |
| View marketplace | ✅ Complete | Open jobs list |
| Submit bids | ✅ Complete | Price + ETA |
| Manage active jobs | ✅ Complete | Status updates |
| Update job status | ✅ Complete | Progress tracking |
| Chat with customer | ✅ Complete | Real-time |
| Create gigs | ✅ Complete | Service listings |
| View earnings | ✅ Complete | Charts and stats |
| Generate invoices | ✅ Complete | PDF generation |
| View notifications | ✅ Complete | Real-time bell |

### 6.3 Admin Features

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard overview | ✅ Complete | Stats cards |
| Manage users | ✅ Complete | View, delete |
| Verify technicians | ✅ Complete | Approve/reject |
| Manage bookings | ✅ Complete | View all |
| Moderate reviews | ✅ Complete | Delete inappropriate |
| Approve gigs | ✅ Complete | Quality control |
| View audit logs | ✅ Complete | All admin actions |
| Revenue monitoring | ✅ Complete | Platform earnings |

---

## 7. KNOWN ISSUES RESOLVED (This Session)

| Issue ID | Description | File | Fix Applied |
|----------|-------------|------|-------------|
| SUP-001 | Send Message button not working | `Support.jsx` | Added useToast import, form state |
| SUP-002 | Search not showing answers | `Support.jsx` | Added quick answers display |
| SVC-001 | Find Technicians button not clickable | `ServiceAreas.jsx` | Added onClick navigation |
| SVC-002 | Mismatched center counts | `ServiceAreas.jsx` | Use actual filtered count |
| SVC-003 | Missing phone display | `ServiceAreas.jsx` | Graceful fallback |
| TCH-001 | District not auto-selected | `Technicians.jsx` | Added useLocation state |
| PRO-001 | Address not syncing | `customers.js` | Added address to syncUpdates |

---

*Document Version: 2.0*
*Last Updated: January 15, 2026*
*Total Pages: 35 | Total Components: 51 | Total API Endpoints: 85+*

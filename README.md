<div align="center">

# 🛠️ TechCare - Professional Device Repair Platform

### _Connecting Customers with Expert Technicians_

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://github.com)
[![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-24.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.io)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)

[🚀 Quick Start](#-quick-start) • [📐 Architecture](#-system-architecture) • [✨ Features](#-features) • [🔄 User Flows](#-user-flow-diagrams) • [📚 API Reference](#-api-endpoints) • [🤝 Contributing](#-contributing)

---

### 🌐 Live Demo

| Component | URL | Status |
|-----------|-----|--------|
| **🖥️ Frontend** | [techcareofficial.netlify.app](https://techcare-official-new.netlify.app/) | ![Netlify](https://img.shields.io/badge/Netlify-Online-00C7B7?logo=netlify) |
| **⚙️ Backend API** | [techcare-flax.vercel.app](https://techcare-flax.vercel.app) | ![Vercel](https://img.shields.io/badge/Vercel-Online-000?logo=vercel) |

---

</div>

## 📖 Overview

**TechCare** is a modern, enterprise-grade full-stack web application that revolutionizes the device repair industry in Sri Lanka. It connects customers with verified technicians through an intelligent matching system, featuring:

- 🤖 **AI-Powered Diagnostics** - Smart issue detection and cost estimation
- 🗺️ **Location-Based Services** - Find nearby technicians with Google Maps integration
- 💳 **Secure Payments** - Stripe-powered transaction processing
- ⚡ **Real-time Updates** - Live booking status and notifications
- 🏆 **Loyalty Program** - Reward points and tier-based benefits

---

## 📐 System Architecture

### High-Level Architecture Overview

```mermaid
flowchart TB
    subgraph Client["🖥️ CLIENT LAYER"]
        direction TB
        LP["🏠 Landing Page<br/>(Static HTML/CSS)"]
        RA["⚛️ React Application<br/>(Vite + React 18)"]
    end

    subgraph Frontend["🎨 FRONTEND (React + Vite)"]
        direction TB
        subgraph Pages["📄 Pages"]
            PUB["Public Pages<br/>• Home • Services<br/>• Technicians • AI Diagnostics"]
            CUST["Customer Dashboard<br/>• Bookings • Profile<br/>• History • Loyalty"]
            TECH["Technician Dashboard<br/>• Jobs • Earnings<br/>• Schedule • Reviews"]
            ADM["Admin Dashboard<br/>• Users • Analytics<br/>• Settings • Payments"]
        end
        subgraph Components["🧩 Components"]
            UI["UI Components<br/>• Header • Footer<br/>• Cards • Modals"]
            FEAT["Feature Components<br/>• AI Diagnostics • Maps<br/>• Charts • Invoices"]
        end
        subgraph State["🔄 State Management"]
            CTX["Context Providers<br/>• AuthContext<br/>• ThemeContext<br/>• NotificationContext"]
        end
    end

    subgraph Backend["⚙️ BACKEND (Node.js + Express)"]
        direction TB
        subgraph API["🔌 API Layer"]
            REST["REST Endpoints<br/>/api/auth, /api/bookings<br/>/api/technicians, etc."]
        end
        subgraph MW["🛡️ Middleware"]
            SEC["Security<br/>• Helmet • CORS<br/>• Rate Limiting"]
            AUTH["Authentication<br/>• JWT Verification<br/>• Supabase Auth"]
        end
        subgraph Services["📦 Services"]
            BIZ["Business Logic<br/>• Booking Management<br/>• Payment Processing<br/>• Notification Service"]
        end
    end

    subgraph Database["🗄️ DATABASE (Supabase)"]
        direction TB
        TABLES["📊 Tables<br/>• profiles • technicians<br/>• customers • bookings<br/>• reviews • notifications"]
        RLS["🔐 Row Level Security"]
        REALTIME["⚡ Realtime Subscriptions"]
        STORAGE["📁 File Storage"]
    end

    subgraph External["🌐 EXTERNAL SERVICES"]
        direction TB
        STRIPE["💳 Stripe<br/>Payment Processing"]
        RESEND["📧 Resend<br/>Email Service"]
        GMAPS["🗺️ Google Maps<br/>Location Services"]
        CLOUD["☁️ Cloudinary<br/>Image Hosting"]
    end

    Client --> Frontend
    Frontend <--> Backend
    Backend <--> Database
    Backend <--> External

    style Client fill:#1a1a2e,stroke:#16213e,color:#fff
    style Frontend fill:#0f3460,stroke:#16213e,color:#fff
    style Backend fill:#533483,stroke:#16213e,color:#fff
    style Database fill:#3c6e71,stroke:#16213e,color:#fff
    style External fill:#e94560,stroke:#16213e,color:#fff
```

### Component Architecture

```mermaid
graph LR
    subgraph Frontend
        A[App.jsx] --> B[AuthProvider]
        B --> C[ThemeProvider]
        C --> D[NotificationProvider]
        D --> E[Router]
        
        E --> F[Layout]
        F --> G[Header]
        F --> H[Footer]
        F --> I[Page Content]
        
        I --> J[Public Routes]
        I --> K[Protected Routes]
        
        J --> J1[Home]
        J --> J2[Services]
        J --> J3[Technicians]
        J --> J4[AI Diagnostics]
        
        K --> K1[Customer Dashboard]
        K --> K2[Technician Dashboard]
        K --> K3[Admin Dashboard]
    end
    
    style A fill:#61dafb,stroke:#282c34,color:#000
    style B fill:#22c55e,stroke:#282c34,color:#fff
    style C fill:#8b5cf6,stroke:#282c34,color:#fff
    style D fill:#f59e0b,stroke:#282c34,color:#fff
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    PROFILES ||--o{ CUSTOMERS : "extends"
    PROFILES ||--o{ TECHNICIANS : "extends"
    PROFILES {
        uuid id PK
        string email
        string name
        enum role "user|technician|admin"
        string avatar_url
        timestamp created_at
    }
    
    CUSTOMERS ||--o{ BOOKINGS : "creates"
    CUSTOMERS ||--o{ REVIEWS : "writes"
    CUSTOMERS ||--|| LOYALTY_ACCOUNTS : "has"
    CUSTOMERS {
        uuid id PK
        uuid profile_id FK
        string phone
        string address
        jsonb preferences
    }
    
    TECHNICIANS ||--o{ BOOKINGS : "receives"
    TECHNICIANS ||--o{ REVIEWS : "gets"
    TECHNICIANS {
        uuid id PK
        uuid profile_id FK
        string business_name
        string[] services
        string[] districts
        float rating
        int total_reviews
        boolean verified
        jsonb location
    }
    
    BOOKINGS ||--o{ PAYMENTS : "has"
    BOOKINGS {
        uuid id PK
        uuid customer_id FK
        uuid technician_id FK
        string device_type
        string issue_description
        enum status "pending|confirmed|in_progress|completed|cancelled"
        datetime scheduled_date
        decimal amount
    }
    
    REVIEWS {
        uuid id PK
        uuid customer_id FK
        uuid technician_id FK
        uuid booking_id FK
        int rating
        string comment
        timestamp created_at
    }
    
    LOYALTY_ACCOUNTS ||--o{ LOYALTY_TRANSACTIONS : "records"
    LOYALTY_ACCOUNTS {
        uuid id PK
        uuid customer_id FK
        int points
        enum tier "bronze|silver|gold|platinum"
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string title
        string message
        boolean read
        timestamp created_at
    }
```

---

## 🔄 User Flow Diagrams

### 🔐 Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant F as 🖥️ Frontend
    participant A as 🔑 Auth API
    participant S as 🗄️ Supabase
    participant E as 📧 Email Service

    rect rgb(40, 40, 60)
        Note over U,E: Registration Flow
        U->>F: Fill registration form
        F->>A: POST /api/auth/register
        A->>S: Create user account
        S->>E: Send verification email
        E-->>U: Verification link
        U->>F: Click verification link
        F->>S: Verify email token
        S-->>F: Email confirmed
        F->>U: Redirect to login
    end

    rect rgb(60, 40, 40)
        Note over U,E: Login Flow
        U->>F: Enter credentials
        F->>A: POST /api/auth/login
        A->>S: Authenticate user
        S-->>A: User session + JWT
        A-->>F: Auth token + user data
        F->>F: Store in AuthContext
        F->>U: Redirect to dashboard
    end

    rect rgb(40, 60, 40)
        Note over U,E: Password Reset Flow
        U->>F: Click "Forgot Password"
        F->>A: POST /api/auth/forgot-password
        A->>S: Generate reset token
        S->>E: Send reset email
        E-->>U: Reset link
        U->>F: Enter new password
        F->>A: POST /api/auth/reset-password
        A->>S: Update password
        S-->>F: Password updated
        F->>U: Redirect to login
    end
```

### 📅 Booking Flow

```mermaid
stateDiagram-v2
    [*] --> BrowseServices: User visits services page
    
    BrowseServices --> SelectService: Choose repair type
    SelectService --> EnterDetails: Add device info
    EnterDetails --> ChooseTechnician: Optional selection
    ChooseTechnician --> SelectDateTime: Pick appointment slot
    SelectDateTime --> ReviewBooking: Confirm details
    
    ReviewBooking --> Payment: Proceed to pay
    Payment --> PaymentSuccess: Payment successful
    Payment --> PaymentFailed: Payment failed
    PaymentFailed --> Payment: Retry
    
    PaymentSuccess --> BookingConfirmed: Create booking
    BookingConfirmed --> NotifyTechnician: Send notification
    NotifyTechnician --> TechnicianAccepts: Wait for response
    
    TechnicianAccepts --> InProgress: Start repair
    InProgress --> Completed: Finish repair
    Completed --> LeaveReview: Optional
    LeaveReview --> AwardPoints: Loyalty points
    AwardPoints --> [*]
    
    TechnicianAccepts --> Rejected: Technician unavailable
    Rejected --> ChooseTechnician: Select different technician
```

### 🤖 AI Diagnostics Flow

```mermaid
flowchart TD
    START([🚀 Start Diagnostics]) --> SELECT_DEVICE
    
    subgraph Input["📱 Device Selection"]
        SELECT_DEVICE[Select Device Type] --> DEVICE_MOBILE{Mobile?}
        DEVICE_MOBILE -->|Yes| MOBILE_BRAND[Select Brand]
        DEVICE_MOBILE -->|No| DEVICE_PC{PC/Laptop?}
        DEVICE_PC -->|Yes| PC_TYPE[Select Type]
        DEVICE_PC -->|No| OTHER[Other Device]
    end
    
    MOBILE_BRAND --> SYMPTOMS
    PC_TYPE --> SYMPTOMS
    OTHER --> SYMPTOMS
    
    subgraph Analysis["🔍 Symptom Analysis"]
        SYMPTOMS[Select Symptoms] --> MULTI_SELECT{Multiple Issues?}
        MULTI_SELECT -->|Yes| ADD_MORE[Add More Symptoms]
        ADD_MORE --> MULTI_SELECT
        MULTI_SELECT -->|No| ADDITIONAL[Additional Details]
        ADDITIONAL --> AI_PROCESS
    end
    
    subgraph AI["🤖 AI Processing"]
        AI_PROCESS[Process with AI] --> MATCH[Match Patterns]
        MATCH --> CALCULATE[Calculate Estimates]
        CALCULATE --> GENERATE[Generate Report]
    end
    
    GENERATE --> RESULT
    
    subgraph Output["📊 Results"]
        RESULT[Display Diagnosis] --> SHOW_ISSUE[Issue Identified]
        RESULT --> SHOW_COST[Cost Estimate]
        RESULT --> SHOW_TIME[Repair Time]
        RESULT --> SHOW_TIPS[Care Tips]
    end
    
    SHOW_ISSUE --> ACTION
    SHOW_COST --> ACTION
    SHOW_TIME --> ACTION
    SHOW_TIPS --> ACTION
    
    ACTION{User Action} -->|Book Now| BOOKING([📅 Go to Booking])
    ACTION -->|Start Over| START
    ACTION -->|Close| END([✅ End])

    style START fill:#22c55e,stroke:#16a34a,color:#fff
    style END fill:#22c55e,stroke:#16a34a,color:#fff
    style BOOKING fill:#3b82f6,stroke:#2563eb,color:#fff
    style AI_PROCESS fill:#8b5cf6,stroke:#7c3aed,color:#fff
```

---

## 👥 User Roles & Permissions

### Role-Based Access Control

```mermaid
flowchart TB
    subgraph Roles["🎭 TechCare User Roles"]
        direction TB
        
        subgraph GuestRole["👤 GUEST"]
            G1["View Services"]
            G2["Browse Technicians"]
            G3["Use AI Diagnostics"]
            G4["View Reviews"]
            G5["Register/Login"]
        end
        
        subgraph CustomerRole["🛒 CUSTOMER"]
            C1["All Guest Features"]
            C2["Book Repairs"]
            C3["Track Bookings"]
            C4["Chat with Technicians"]
            C5["Write Reviews"]
            C6["Earn Loyalty Points"]
            C7["Manage Profile"]
            C8["View History"]
        end
        
        subgraph TechnicianRole["🔧 TECHNICIAN"]
            T1["View Job Requests"]
            T2["Accept/Reject Jobs"]
            T3["Update Job Status"]
            T4["View Earnings"]
            T5["Manage Schedule"]
            T6["Generate Invoices"]
            T7["Receive Reviews"]
            T8["Chat with Customers"]
        end
        
        subgraph AdminRole["👑 ADMIN"]
            A1["All Features"]
            A2["Manage Users"]
            A3["Verify Technicians"]
            A4["Moderate Reviews"]
            A5["View Analytics"]
            A6["Configure System"]
            A7["Process Refunds"]
            A8["Send Notifications"]
        end
    end
    
    style Roles fill:#1e1e2e,stroke:#313244,color:#fff
    style GuestRole fill:#45475a,stroke:#585b70,color:#fff
    style CustomerRole fill:#89b4fa,stroke:#74c7ec,color:#1e1e2e
    style TechnicianRole fill:#a6e3a1,stroke:#94e2d5,color:#1e1e2e
    style AdminRole fill:#f9e2af,stroke:#fab387,color:#1e1e2e
    style G1 fill:#585b70,stroke:#6c7086,color:#fff
    style G2 fill:#585b70,stroke:#6c7086,color:#fff
    style G3 fill:#585b70,stroke:#6c7086,color:#fff
    style G4 fill:#585b70,stroke:#6c7086,color:#fff
    style G5 fill:#585b70,stroke:#6c7086,color:#fff
```

### Permission Matrix

| Feature | 👤 Guest | 🛒 Customer | 🔧 Technician | 👑 Admin |
|---------|:--------:|:-----------:|:-------------:|:--------:|
| **View Services** | ✅ | ✅ | ✅ | ✅ |
| **Browse Technicians** | ✅ | ✅ | ✅ | ✅ |
| **AI Diagnostics** | ✅ | ✅ | ✅ | ✅ |
| **Book Repairs** | ❌ | ✅ | ❌ | ✅ |
| **Customer Dashboard** | ❌ | ✅ | ❌ | ✅ |
| **Track Bookings** | ❌ | ✅ | ❌ | ✅ |
| **Write Reviews** | ❌ | ✅ | ❌ | ✅ |
| **Loyalty Points** | ❌ | ✅ | ❌ | ✅ |
| **Technician Dashboard** | ❌ | ❌ | ✅ | ✅ |
| **Accept Jobs** | ❌ | ❌ | ✅ | ❌ |
| **View Earnings** | ❌ | ❌ | ✅ | ✅ |
| **Generate Invoices** | ❌ | ❌ | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ✅ |
| **System Settings** | ❌ | ❌ | ❌ | ✅ |

---

## 🔌 API Endpoints

### API Architecture

```mermaid
flowchart LR
    subgraph Client["Client"]
        WEB[Web App]
    end
    
    subgraph Gateway["API Gateway"]
        CORS[CORS]
        RATE[Rate Limiter]
        AUTH[Auth Middleware]
    end
    
    subgraph Routes["API Routes"]
        direction TB
        R1["/api/auth"]
        R2["/api/technicians"]
        R3["/api/bookings"]
        R4["/api/customers"]
        R5["/api/reviews"]
        R6["/api/loyalty"]
        R7["/api/payment"]
        R8["/api/notifications"]
        R9["/api/admin"]
        R10["/api/search"]
    end
    
    WEB --> CORS --> RATE --> AUTH --> Routes
    
    style Client fill:#61dafb,stroke:#282c34
    style Gateway fill:#f59e0b,stroke:#282c34
    style Routes fill:#22c55e,stroke:#282c34
```

### Endpoint Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| **Authentication** |
| `/api/auth/login` | POST | ❌ | User login |
| `/api/auth/register` | POST | ❌ | User registration |
| `/api/auth/logout` | POST | ✅ | User logout |
| `/api/auth/forgot-password` | POST | ❌ | Request password reset |
| `/api/auth/reset-password` | POST | ❌ | Reset password with token |
| **Technicians** |
| `/api/technicians` | GET | ❌ | List all technicians |
| `/api/technicians/:id` | GET | ❌ | Get technician details |
| `/api/technicians/nearby` | GET | ❌ | Find nearby technicians |
| `/api/technicians/search` | GET | ❌ | Search technicians |
| **Bookings** |
| `/api/bookings` | GET | ✅ | Get user's bookings |
| `/api/bookings` | POST | ✅ | Create new booking |
| `/api/bookings/:id` | GET | ✅ | Get booking details |
| `/api/bookings/:id` | PATCH | ✅ | Update booking status |
| `/api/bookings/:id/cancel` | POST | ✅ | Cancel booking |
| **Reviews** |
| `/api/reviews` | GET | ❌ | List reviews |
| `/api/reviews` | POST | ✅ | Create review |
| `/api/reviews/:id` | DELETE | ✅ | Delete review |
| **Loyalty** |
| `/api/loyalty/account` | GET | ✅ | Get loyalty account |
| `/api/loyalty/redeem` | POST | ✅ | Redeem reward |
| `/api/loyalty/history` | GET | ✅ | Get points history |
| **Payments** |
| `/api/payment/create-intent` | POST | ✅ | Create payment intent |
| `/api/payment/confirm` | POST | ✅ | Confirm payment |
| `/api/payment/refund` | POST | ✅ | Process refund |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **Git** for version control

### ⚡ One-Click Start (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Wenura17125/Tech-Care_official.git
cd Tech-Care_official

# 2. Verify your environment & install dependencies
.\scripts\verify-setup.bat

# 3. Launch the full stack application
.\scripts\start-techcare.bat
```

**That's it!** 🎉 The application will open automatically at `http://localhost:5173`

---

## 📦 Manual Installation

### Step-by-Step Setup

```bash
# 1. Clone Repository
git clone https://github.com/Wenura17125/Tech-Care_official.git
cd Tech-Care_official

# 2. Install Frontend Dependencies
npm install

# 3. Install Backend Dependencies
cd server
npm install
cd ..

# 4. Configure Environment Variables
# Create .env in root directory
# Create .env in server directory
```

### Environment Variables

**Root `.env`**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Server `.env`**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_api_key
```

### Start Development Servers

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 📂 Project Structure

```
Tech-Care_official/
├── 📁 docs/                      # Documentation
│   ├── PRD_ARCHITECTURE.md       # Technical specifications
│   └── ROLE_ACCESS_AND_VISIBILITY.md
├── 📁 scripts/                   # Automation scripts
│   ├── start-techcare.bat        # Full stack launcher
│   ├── verify-setup.bat          # Environment checker
│   └── verify-all.bat            # Deep verification
├── 📁 src/                       # Frontend source
│   ├── 📁 components/            # React components
│   │   ├── 📁 ui/                # Base UI components
│   │   ├── Header.jsx            # Navigation header
│   │   ├── Footer.jsx            # Site footer
│   │   ├── AIDiagnostics.jsx     # AI chat interface
│   │   ├── EarningsChart.jsx     # Earnings visualization
│   │   ├── InvoiceGenerator.jsx  # PDF invoice creation
│   │   └── LoyaltyPoints.jsx     # Rewards system
│   ├── 📁 pages/                 # Page components
│   │   ├── Home.jsx              # Landing page
│   │   ├── Services.jsx          # Service catalog
│   │   ├── Technicians.jsx       # Technician listing
│   │   ├── CustomerDashboard.jsx # Customer portal
│   │   ├── TechnicianDashboard.jsx # Tech portal
│   │   └── Admin.jsx             # Admin panel
│   ├── 📁 context/               # State management
│   │   ├── AuthContext.jsx       # Authentication
│   │   ├── ThemeContext.jsx      # Dark/light mode
│   │   └── NotificationContext.jsx
│   ├── 📁 lib/                   # Utilities
│   │   └── supabase.js           # Supabase client
│   ├── 📁 hooks/                 # Custom hooks
│   └── App.jsx                   # Root component
├── 📁 server/                    # Backend source
│   ├── 📁 routes/                # API endpoints
│   │   ├── auth.js               # Authentication
│   │   ├── technicians.js        # Technician APIs
│   │   ├── bookings.js           # Booking APIs
│   │   ├── payment.js            # Stripe integration
│   │   └── loyalty.js            # Loyalty system
│   ├── 📁 middleware/            # Express middleware
│   │   ├── security.js           # Security headers
│   │   └── supabaseAuth.js       # Auth middleware
│   ├── 📁 models/                # Data models
│   └── index.js                  # Server entry
├── 📁 public/                    # Static assets
│   └── 📁 landing/               # Marketing page
├── 📁 supabase/                  # Database migrations
├── package.json                  # Frontend deps
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

### Technology Architecture

```mermaid
pie title Technology Distribution
    "React Frontend" : 40
    "Node.js Backend" : 25
    "Supabase Database" : 15
    "External Services" : 12
    "DevOps & Tools" : 8
```

### Stack Details

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| | Tailwind CSS | Utility-first styling |
| | Radix UI | Accessible components |
| | React Router | Client-side routing |
| | Lucide React | Icon library |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web framework |
| | JWT | Token authentication |
| | Helmet | Security headers |
| **Database** | Supabase (PostgreSQL) | Primary database |
| | Row Level Security | Data protection |
| | Realtime | Live updates |
| **Services** | Stripe | Payment processing |
| | Resend | Email delivery |
| | Google Maps | Location services |
| | Cloudinary | Image hosting |
| **DevOps** | Netlify | Frontend hosting |
| | Vercel | Backend hosting |
| | GitHub | Version control |

---

## ✨ Features

### For Customers 🛒

| Feature | Description |
|---------|-------------|
| **🔍 Smart Search** | Find technicians by service, location, rating |
| **🗺️ Interactive Map** | Visualize nearby repair shops |
| **📅 Easy Booking** | Calendar-based appointment scheduling |
| **📱 Real-time Tracking** | Live status updates on repairs |
| **💬 In-app Chat** | Direct communication with technicians |
| **🤖 AI Diagnostics** | Get instant repair estimates |
| **🏆 Loyalty Rewards** | Earn points on every booking |
| **📜 Booking History** | Complete service records |

### For Technicians 🔧

| Feature | Description |
|---------|-------------|
| **📋 Job Board** | View and manage repair requests |
| **💰 Earnings Dashboard** | Track income and analytics |
| **📆 Schedule Manager** | Calendar with availability settings |
| **🧾 Invoice Generator** | Create professional invoices |
| **⭐ Review Management** | View and respond to reviews |
| **💬 Customer Chat** | Communicate with customers |
| **📊 Performance Stats** | Analytics and insights |

### For Admins 👑

| Feature | Description |
|---------|-------------|
| **👥 User Management** | Manage all platform users |
| **✅ Verification Queue** | Approve technician applications |
| **📊 Analytics Dashboard** | Platform-wide statistics |
| **🔔 Bulk Notifications** | Send announcements |
| **💳 Payment Oversight** | Monitor transactions |
| **⚙️ System Settings** | Configure platform options |

---

## 🎨 Design System

### Color Palette

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
    subgraph Colors["TechCare Color Palette"]
        P["Primary: #000000"]
        S["Secondary: #FFFFFF"]
        A["Accent: #22C55E"]
        BG["Background: #18181B"]
        C["Card: #27272A"]
        B["Border: #3F3F46"]
        M["Muted: #A1A1AA"]
        D["Destructive: #EF4444"]
        W["Warning: #F59E0B"]
    end
    
    style P fill:#000000,color:#fff
    style S fill:#FFFFFF,color:#000
    style A fill:#22C55E,color:#fff
    style BG fill:#18181B,color:#fff
    style C fill:#27272A,color:#fff
    style B fill:#3F3F46,color:#fff
    style M fill:#A1A1AA,color:#000
    style D fill:#EF4444,color:#fff
    style W fill:#F59E0B,color:#000
```

### Typography

- **Headings**: `font-bold tracking-tighter`
- **Body**: `font-medium`
- **Small**: `text-sm text-zinc-400`
- **Labels**: `uppercase tracking-widest`

---

## 📊 Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Page Load (LCP)** | < 2.5s | ~1.8s | ✅ |
| **Login Time** | < 2s | ~1s | ✅ |
| **API Response (P95)** | < 500ms | ~200ms | ✅ |
| **First Input Delay** | < 100ms | ~50ms | ✅ |
| **Cumulative Layout Shift** | < 0.1 | ~0.05 | ✅ |
| **Bundle Size (gzipped)** | < 200KB | ~180KB | ✅ |

---

## 🧪 Testing

### Run Tests

```bash
# Verify environment setup
.\scripts\verify-setup.bat

# Run all verification checks
.\scripts\verify-all.bat

# Run API tests
node test-all-roles.js

# Run payment tests
node test-payment-api.js
```

---

## 📅 Development Roadmap

```mermaid
gantt
    title TechCare Development Roadmap
    dateFormat  YYYY-MM
    section Phase 1 ✅
    Core Auth & Registration    :done, 2025-10, 2025-11
    Basic Booking System        :done, 2025-11, 2025-12
    Technician Listing          :done, 2025-11, 2025-12
    Payment Integration         :done, 2025-12, 2025-12
    
    section Phase 2 ✅
    AI Diagnostics              :done, 2025-12, 2025-12
    Service Areas Map           :done, 2025-12, 2025-12
    Earnings Dashboard          :done, 2025-12, 2025-12
    Loyalty System              :done, 2025-12, 2025-12
    Email Integration           :done, 2025-12, 2025-12
    
    section Phase 3 ✅
    Performance Optimization    :done, 2025-12, 2026-01
    Role-based Features         :done, 2025-12, 2026-01
    Mobile Responsive           :done, 2026-01, 2026-01
    
    section Phase 4 📋
    Advanced Search             :active, 2026-01, 2026-02
    Export (PDF/CSV)            :2026-01, 2026-02
    Mobile App (React Native)   :2026-02, 2026-04
    Two-Factor Auth             :2026-02, 2026-03
    Push Notifications          :2026-03, 2026-04
```

---

## 🔧 Sri Lanka Repair Shops Database

TechCare includes a curated database of **100+ top-rated repair shops** across Sri Lanka:

- **Data Source**: Google Maps verified listings
- **Coverage**: All major districts
- **Features**: Filter by district, service type, rating
- **Updates**: Regularly verified and updated

---

## 🤝 Contributing

> ⚠️ **IMPORTANT: Read Before Contributing**

This project is **solely owned by Wenura** ([@Wenura17125](https://github.com/Wenura17125)). All code, documentation, and features were developed exclusively by Wenura.

### 🔒 Protected Files (DO NOT MODIFY)

The following files are **strictly protected** and cannot be modified by contributors:

| File | Status | Reason |
|------|--------|--------|
| `README.md` | 🔒 **LOCKED** | Project identity and documentation |
| `LICENSE` | 🔒 **LOCKED** | Legal terms and ownership |
| `CONTRIBUTORS.md` | 🔒 **LOCKED** | Verified contributor list |
| `CODEOWNERS` | 🔒 **LOCKED** | Access control configuration |
| `/docs/*` | 🔒 **LOCKED** | Official documentation |
| `package.json` (name, author, license) | 🔒 **LOCKED** | Project identity fields |

**Any pull requests modifying these files will be automatically rejected.**

### ✅ Allowed Contributions

You may contribute to:
- Bug fixes in source code (`/src/`, `/server/`)
- New features (with prior discussion)
- Performance improvements
- Test coverage

### 📋 Contribution Terms

By submitting a contribution, you agree that:

1. ✅ All contributions become the **exclusive property of Wenura**
2. ✅ You waive all ownership claims to your contributions
3. ✅ Your contributions are original and don't infringe third-party rights
4. ✅ Contributions do NOT grant you project ownership
5. ❌ You may NOT modify protected files
6. ❌ You may NOT claim authorship of the project

### 🔄 How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make changes (to allowed files only)
4. Commit changes (`git commit -m 'Add feature'`)
5. Push to branch (`git push origin feature/your-feature`)
6. Open a Pull Request for review by @Wenura17125

---

## 📄 License

> ⚠️ **This is NOT an open-source project under MIT/GPL/Apache license.**

This project is licensed under the **TechCare Proprietary License**.

### Key Points:

| Permission | Status |
|------------|--------|
| ✅ View source code | Allowed |
| ✅ Fork for learning | Allowed |
| ✅ Personal use | Allowed |
| ❌ Commercial use | **Prohibited** without permission |
| ❌ Redistribution | **Prohibited** without permission |
| ❌ Claiming ownership | **Prohibited** |
| ❌ Modifying protected files | **Prohibited** |

See the [LICENSE](LICENSE) file for full terms and conditions.

**Copyright (c) 2025-2026 Wenura. All Rights Reserved.**

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Wenura17125/Tech-Care_official/issues)
- **Email**: support@techcare.com

---

<div align="center">

## ⭐ Show Your Support!

If you find TechCare helpful or interesting, please consider:

[![Star this repo](https://img.shields.io/badge/⭐_Star_This_Repo-FFD700?style=for-the-badge&logo=github&logoColor=black)](https://github.com/Wenura17125/Tech-Care_official)
[![Follow on GitHub](https://img.shields.io/badge/👤_Follow_@Wenura17125-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Wenura17125)
[![Contribute](https://img.shields.io/badge/🤝_Contribute-22C55E?style=for-the-badge&logo=git&logoColor=white)](https://github.com/Wenura17125/Tech-Care_official/pulls)

> 🌟 **Your star motivates me to keep improving this project!**
>
> 👥 **Follow for updates on new features and projects!**
>
> 🔧 **Contributions are always welcome - let's build together!**

---

### 🚀 Built with ❤️ by [Wenura](https://github.com/Wenura17125)

*A passionate full-stack developer from Sri Lanka, dedicated to building innovative solutions that make a difference.*

[![GitHub](https://img.shields.io/badge/GitHub-@Wenura17125-181717?style=flat-square&logo=github)](https://github.com/Wenura17125)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-22C55E?style=flat-square&logo=google-chrome&logoColor=white)](https://github.com/Wenura17125)

---

**Last Updated**: January 3, 2026 | **Version**: 2.0 | **Status**: ✅ Production Ready

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.io)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

---

*If you use this project or find it helpful, please give it a ⭐ - it helps others discover it too!*

</div>

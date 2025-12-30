<div align="center">

# 🛠️ TechCare - Professional Device Repair Platform

### _Connecting Customers with Expert Technicians_

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://github.com)
[![Version](https://img.shields.io/badge/Version-1.1-blue?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-24.11.1-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

[🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📦 Installation](#-installation) • [🤝 Contributing](#-contributing)

---

### 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **🖥️ Frontend** | [https://techcareofficial.netlify.app](https://techcareofficial.netlify.app) |
| **⚙️ Backend API** | [https://techcare-flax.vercel.app](https://techcare-flax.vercel.app) |

---

</div>

## 📖 Overview

**TechCare** is a modern, full-stack web application that revolutionizes the device repair industry by connecting customers with verified technicians. It features a dual-interface system (Customer & Technician portals), real-time booking management, and a high-performance landing page.

### 🎯 Key Highlights

- ✅ **Production Ready** - Enterprise-grade security and performance
- ⚡ **High Performance** - Optimized bundles, lazy loading, and fast TTI
- 🎨 **Premium UI/UX** - Fully responsive, modern design with glassmorphism effects
- 🔒 **Secure Architecture** - JWT authentication, rate limiting, and input sanitization
- 🗺️ **Location Services** - Google Maps integration for finding nearby technicians
- 📱 **PWA Ready** - Installable on mobile and desktop
- 💳 **Payments** - Integrated Stripe payment processing
- 🛠️ **Developer Friendly** - Automated scripts for verifying, starting, and testing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v24.11.1 or higher
- **npm** 11.6.2 or higher
- **MongoDB** (optional - app works without it in mock/dev mode)

### ⚡ One-Click Start (Recommended)

We have streamlined the startup process with automated scripts located in the `scripts/` directory.

```bash
# 1. Verify your environment & install dependencies (First run only)
.\scripts\verify-setup.bat

# 2. Launch the full stack application (Frontend + Backend + Monitors)
.\scripts\start-techcare.bat
```

**That's it!** 🎉 The application will open automatically in your browser at `http://localhost:5173`.

---

## 📦 Installation & Manual Setup

If you prefer to set things up manually or are deploying to a server:

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Tech-Care_official.git
cd Tech-Care_official
```

### 2. Install Dependencies

You need to install dependencies for both the root (frontend) and the server (backend).

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the **root** directory:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Create a `.env` file in the **server** directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/techcare
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
GOOGLE_MAPS_API_KEY=your_key_here
```

### 4. Start Development Servers

You will need two terminal windows:

**Terminal 1: Backend**
```bash
cd server
npm run dev
```

**Terminal 2: Frontend**
```bash
npm run dev
```

---

## ✨ Features

### 👤 For Customers
- **Smart Search:** Find technicians by service type (Mobile, PC), rating, or location.
- **Interactive Map:** Visualize technician locations in real-time.
- **Booking System:** Easy appointment scheduling with calendar view.
- **Dashboard:** Track repair status, view history, and manage payments.

### 🔧 For Technicians
- **Job Board:** View available repair requests in your area.
- **Bidding System:** Submit competitive bids for repair jobs.
- **Profile Management:** Manage service areas, availability, and portfolio.
- **Earnings Tracker:** Monitor income and completed jobs.

### 🌐 Landing Page
- A high-performance, standalone landing page is integrated at `/landing/www.techcare.com/index.html`.
- It serves as the main entry point for marketing and user acquisition.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (for custom animations)
- **UI Components:** Radix UI, Lucide React Icons
- **State Management:** React Context API
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, Express Rate Limit, CORS

---

## 📂 Project Structure

Verified structure as of December 2025:

```bash
Tech-Care_official/
├── 📂 Documentation/        # Project documentation & .md files
├── 📂 scripts/              # Automation batch scripts (.bat)
│   ├── start-techcare.bat   # Main launcher
│   ├── verify-setup.bat     # Dependency checker
│   └── ...
├── 📂 src/                  # Frontend Source
│   ├── 📂 components/       # Reusable React components
│   ├── 📂 pages/            # Page views (Home, Dashboard, etc.)
│   ├── 📂 context/          # Global state (Auth, Theme)
│   └── main.jsx             # Entry point
├── 📂 server/               # Backend Source
│   ├── 📂 models/           # Mongoose schemas
│   ├── 📂 routes/           # API endpoints
│   └── index.js             # Server entry
├── 📂 public/               # Static assets
│   ├── 📂 landing/          # Standalone Marketing Landing Page
│   └── favicon.svg          # TechCare Branding
└── package.json             # Root dependencies
```

---

## 🧪 Testing & Verification

We provide scripts to ensure your environment is healthy.

- **Check Setup:** `.\scripts\verify-setup.bat` (Checks Node, NPM, dependencies)
- **Verify All:** `.\scripts\verify-all.bat` (Deep check of file existence and integrity)

---

## 🔧 Sri Lanka Repair Shops Database

Includes a curated database of **100 top-rated repair shops** in Sri Lanka.
- **Data Source:** Google Maps Scraping
- **Access:** Available via the `/technicians` page
- **Features:** Filter by District, Service Type, or Rating.

---

<div align="center">

**Last Updated:** December 30, 2025
**Version:** 1.1 - Renaming Compete & Production Ready
**Status:** ✅ Fully Functional

</div>
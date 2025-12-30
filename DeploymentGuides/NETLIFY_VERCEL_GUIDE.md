# 🚀 Deployment Guide: Netlify (Frontend) & Vercel (Backend)

This guide walks you through deploying the **TechCare** application using **Netlify** for the React frontend and **Vercel** for the Node.js/Express backend. This is a highly robust, scalable, and free-tier friendly architecture.

---

## 🏗️ Architecture Overview

- **Frontend:** Hosted on **Netlify** (Static Site Hosting + CDN).
- **Backend:** Hosted on **Vercel** (Serverless Functions).
- **Database:** Hosted on **MongoDB Atlas** (Cloud Database).

---

## 1️⃣ Backend Deployment (Vercel)

We deploy the backend first to get the API URL needed for the frontend.

### Prerequisites
1.  A [Vercel Account](https://vercel.com).
2.  `vercel.json` is already configured in `server/vercel.json`.

### Steps:

1.  **Push to GitHub:** Ensure your `server/` code is pushed to your GitHub repository.
2.  **Import Project in Vercel:**
    *   Go to Vercel Dashboard -> "Add New Project".
    *   Select your `Tech-Care_official` repository.
3.  **Configure Project:**
    *   **Root Directory:** Custom -> Select `server` folder. (Important!)
    *   **Framework Preset:** Other
    *   **Build Command:** `npm install` (Vercel installs deps automatically usually, leave blank if unsure).
    *   **Install Command:** `npm install`
4.  **Environment Variables:**
    *   Add the following variables from your `server/.env`:
        *   `MONGO_URI` (Your MongoDB Atlas Connection String)
        *   `JWT_SECRET`
        *   `STRIPE_SECRET_KEY`
        *   `STRIPE_PUBLISHABLE_KEY`
        *   `GOOGLE_MAPS_API_KEY`
        *   `ALLOWED_ORIGINS` (Add your pending Netlify URL here later, e.g., `https://your-app.netlify.app`)
5.  **Deploy:** Click "Deploy".
6.  **Get API URL:** Once deployed, copy the domain (e.g., `https://techcare-backend.vercel.app`).

---

## 2️⃣ Frontend Deployment (Netlify)

Now we deploy the React frontend and point it to the Vercel backend.

### Prerequisites
1.  A [Netlify Account](https://netlify.com).
2.  `netlify.toml` is already configured in the root directory.

### Steps:

1.  **Import Site in Netlify:**
    *   Go to Netlify Dashboard -> "Add new site" -> "Import an existing project".
    *   Connect to GitHub and select your `Tech-Care_official` repository.
2.  **Configure Build Settings:**
    *   **Base directory:** (Leave empty / root)
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
    *   *(Note: The `netlify.toml` file in the repo should auto-fill these).*
3.  **Environment Variables:**
    *   Go to "Site settings" -> "Environment variables".
    *   Add:
        *   `VITE_API_URL`: Paste your Vercel Backend URL (e.g., `https://techcare-backend.vercel.app`).
        *   `VITE_GOOGLE_MAPS_API_KEY`: Your Maps API Key.
4.  **Deploy:** Click "Deploy site".

---

## 3️⃣ Final Configuration

### CORS Configuration (Crucial!)

Once your frontend is live (e.g., `https://techcare-frontend.netlify.app`):

1.  Go back to your **Vercel Backend Project**.
2.  Update the `ALLOWED_ORIGINS` environment variable.
3.  Set it to: `https://techcare-frontend.netlify.app`.
4.  **Redeploy** the backend (Deployment -> Redeploy) for changes to take effect.

---

## ✅ Verification Checklist

- [ ] **Frontend loads:** Visit the Netlify URL.
- [ ] **API Connection:** Try to Log in or Register. (Check Network tab for 200 OK from Vercel).
- [ ] **Routing:** Refresh the page on a sub-route (e.g., `/login`). (Should work thanks to `netlify.toml`).
- [ ] **Database:** Data created on the live site appears in MongoDB Atlas.

**🎉 Your TechCare platform is now live!**

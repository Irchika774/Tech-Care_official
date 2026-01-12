# Deployment & Environment Setup Guide

## 1. Fixes Applied
We have updated the Registration flow (`src/context/AuthContext.jsx`) to connect directly to Supabase. 
**Why?**
- Previously, registration tried to call your local backend (`localhost:5000`), which causes "Network Error" if the server isn't running or deployed correctly.
- Now, it uses the Supabase Client SDK directly, which is faster, more reliable, and works independently of the backend server status for initial signup.

## 2. Netlify Environment Variables (Frontend)
When deploying to Netlify, you must set these environment variables in **Site settings > Build & deploy > Environment variables**.

| Key | Value (Description) |
|-----|---------------------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL (e.g., `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key (Public) |
| `VITE_API_URL` | URL of your Backend API (e.g., `https://your-backend.vercel.app`) or `http://localhost:5000` for dev |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
| `VITE_SITE_URL` | Your Netlify URL (e.g. `https://your-app.netlify.app`) |

**Note:** You do NOT need strictly private keys (like `STRIPE_SECRET_KEY`) in Netlify, as it is a frontend-only deployment (unless you are using Netlify Functions).

## 3. Backend Environment Variables (Vercel/Heroku/Render)
If you deploy the `server/` directory, ensure these are set:

| Key | Value |
|-----|-------|
| `PORT` | `80` or `5000` (Platform usually sets this) |
| `NODE_ENV` | `production` |
| `VITE_SUPABASE_URL` | Same as frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | **Crucial:** The Service Role Key (starts with `ey...`) for Admin actions |
| `DATABASE_URL` | PostgreSQL Connection String (from Supabase Connection Pooling) |
| `MONGO_URI` | MongoDB Connection String (if still using Mongo) |
| `JWT_SECRET` | A long random string |
| `STRIPE_SECRET_KEY` | Stripe Secret Key |

## 4. Local Development
- Ensure your `.env` file in the root directory contains ALL of the above (both VITE_ and server keys).
- The server automatically looks at the root `.env` file, so you don't need to duplicate it into `server/.env`.

## 5. Troubleshooting "Network Error"
If you still see "Network Error" on other actions (like Booking):
1. Ensure your Backend Server is running (`npm run server`).
2. Ensure `VITE_API_URL` in `.env` points to the correct URL (`http://localhost:5000`).

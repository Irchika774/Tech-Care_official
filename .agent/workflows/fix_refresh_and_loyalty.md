---
description: Fix Auth Refresh Loop and Implement Loyalty Points
---

# Objective
Fix the "automatically refresh" dashboard issue and the "Auth Initialization hanging" error, and implement the missing Loyalty Points feature.

# Diagnosis
1.  **Auth Loop**: The `AuthContext` triggers `loadUserProfile` and `refreshAllConnections` on `TOKEN_REFRESHED` and `INITIAL_SESSION`. If the specific `loadUserProfile` call fails or times out (as seen in logs), or if `setUser` triggers a re-render that somehow causes `useAuth` to fire events again (unlikely but possible via parent re-mounts), we get a loop. The main suspect is the `AuthContext` `setUser` causing `TechnicianDashboard` to re-render, which calls `fetchDashboardData`. If `fetchDashboardData` hits a race condition or error, it might trigger state changes that cycle.
    *   **Fix**: Be extremely conservative in `AuthContext`. Only update state if values *actually* differ.
    *   **Fix**: In `TechnicianDashboard` and `CustomerDashboard`, ensure `useEffect` dependencies are stable.
    *   **Fix**: In `realtimeService`, debounce or throttle connection refreshes.

2.  **Loyalty Points**: Feature is missing from UI (hardcoded "Pro Member").
    *   **Fix**: Integrate `LoyaltyPoints.jsx` into `CustomerDashboard.jsx`.
    *   **Fix**: Ensure `customers` table has necessary columns (graceful fallback if not).

# Implementation Plan

## 1. Auth & Stability Fixes
-   **Modify `src/context/AuthContext.jsx`**:
    -   Refine `loadUserProfile` to strictly dedup calls.
    -   Review `initializeAuth` to ensure it doesn't leave `loading` true forever (already fixed, but triple check timeouts).
    -   Suppress `refreshAllConnections` on `INITIAL_SESSION` if it's the very first load (wasteful).
-   **Modify `src/pages/TechnicianDashboard.jsx`**:
    -   Review `useEffect` dependencies. Remove `user` from dependencies if possible or ensure `user` identity stability in `AuthContext`.
    -   Add defensive checks for `user` being null in render.

## 2. Loyalty Points Implementation
-   **Modify `src/pages/CustomerDashboard.jsx`**:
    -   Import `LoyaltyPoints` component.
    -   Add a new Tab "loyalty" (or integrate into Overview).
    -   Replace the hardcoded "Pro Member" badge with a dynamic badge based on points from `customerRecord`.
    -   Pass `loyalty_points` from `customerRecord` to the UI.

## 3. Extension Error
-   The "Unchecked runtime.lastError" is likely external (browser extension). We will add a global error handler to suppress this specific noise in the console if possible, or just ignore it as it doesn't affect app logic (it's a Chrome extension communication issue).

## 4. Verification
-   Check logs for "Loop" patterns.
-   Verify "Pro Member" is gone and replaced by "Bronze/Silver/etc".

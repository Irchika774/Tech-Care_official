# Home Page Replacement

The main Home page (`/`) has been replaced with the new static landing page.

## Implementation Details

1. **Iframe Integration**:
   - `src/pages/Home.jsx` now renders a full-screen iframe pointing to `/landing/www.lithosquare.com/index.html`.
   - This ensures the complex GSAP animations and design of the landing page are preserved perfectly without needing a full React port.

2. **Layout Adjustments**:
   - `src/components/Layout.jsx` was modified to conditionally hide the main React `Header` and `Footer` only on the home route (`/`).
   - This prevents double headers/footers, as the landing page has its own.

3. **Navigation Fixes**:
   - Added `<base target="_parent">` to `public/landing/www.lithosquare.com/index.html`.
   - This ensures that clicking links like "Book Now" or "Login" on the landing page navigates the top-level window to the correct React route (e.g., `/mobile-repair`), rather than trying to load inside the iframe.

## Verification

- Visit `http://localhost:5173/`. You should see the new landing page.
- Click "Book Now". It should navigate to `/mobile-repair` in the main app.
- Click "Login". It should navigate to `/login`.
- The React Header/Footer should NOT be visible on the home page, but SHOULD be visible on other pages.

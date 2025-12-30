# Landing Page Integration Guide

## Quick Integration to TechCare React App

### Method 1: Link from Main Homepage (Fastest)

Add a button/link in your current `Home.jsx`:

```jsx
<a 
  href="/landingpage/www.lithosquare.com/www.lithosquare.com/index.html" 
  target="_blank"
  className="landing-page-link"
>
  View Our Premium Landing Page
</a>
```

### Method 2: Serve as Static File (Recommended)

1. **Copy the landing page folder** to your `public` directory:
```bash
xcopy "landingpage\www.lithosquare.com" "public\landing" /E /I
```

2. **Access it at**: `http://localhost:5173/landing/www.lithosquare.com/index.html`

3. **Update internal links** in the landing page to point to your React routes:
   - `/mobile-repair` → Keep as is (React route)
   - `/pc-repair` → Keep as is (React route)
   - `/signup?role=technician` → Keep as is (React route)

### Method 3: Create React Route (Most Integrated)

1. **Install react-helmet** for meta tags:
```bash
npm install react-helmet
```

2. **Create a new component** `src/pages/LandingPage.jsx`:

```jsx
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export default function LandingPage() {
  useEffect(() => {
    // Redirect to static HTML version
    window.location.href = '/landing/www.lithosquare.com/index.html';
  }, []);

  return (
    <Helmet>
      <title>TechCare - Professional Device Repair Platform</title>
    </Helmet>
  );
}
```

3. **Add route** in your router:
```jsx
import LandingPage from './pages/LandingPage';

<Route path="/landing" element={<LandingPage />} />
```

### Method 4: iframe Embed (Quick & Easy)

Embed in existing page:

```jsx
<iframe 
  src="/landingpage/www.lithosquare.com/www.lithosquare.com/index.html"
  style={{width: '100%', height: '100vh', border: 'none'}}
  title="TechCare Landing Page"
/>
```

## Link Connections to Make

Ensure these pages exist in your React app:

### 1. Mobile Repair Page
- **Route**: `/mobile-repair`
- **Status**: ✅ Already exists

### 2. PC Repair Page  
- **Route**: `/pc-repair`
- **Status**: ❓ May need to create
- **Action**: Duplicate mobile-repair page and modify for PC repairs

```jsx
// src/pages/PCRepair.jsx
import MobileRepair from './MobileRepair';

export default function PCRepair() {
  return <MobileRepair deviceType="PC" />;
}
```

### 3. Pricing Section
- **Route**: Create section in homepage or new `/pricing` page
- **Action**: Add pricing cards/tables

### 4. Services Section
- **Route**: Add ID `section-services` to your homepage
- **Action**: 
```jsx
<section id="section-services">
  <h2>Our Services</h2>
  {/* Service cards */}
</section>
```

### 5. Support Section
- **Route**: Add ID `section-support` to homepage or create `/support` page
- **Action**: Contact form, FAQ, or support options

## Update Landing Page Links

If you move the landing page, update these hrefs in `index.html`:

```html
<!-- Update these links: -->
<a href="http://localhost:5173/mobile-repair">Book Mobile Repair</a>
<a href="http://localhost:5173/pc-repair">Book PC Repair</a>
<a href="http://localhost:5173/signup?role=technician">Join as Technician</a>
```

Replace with:
```html
<a href="/mobile-repair">Book Mobile Repair</a>
<a href="/pc-repair">Book PC Repair</a>
<a href="/signup?role=technician">Join as Technician</a>
```

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] All navigation links work
- [ ] Mobile/PC repair booking buttons link correctly
- [ ] Join as Technician button works
- [ ] Footer links navigate properly
- [ ] Responsive design works on mobile
- [ ] Animations and interactions function
- [ ] Video background loads (if configured)

## Production Deployment

For production, ensure:

1. **Optimize images** in the landing page
2. **Minify CSS/JS** if not already done
3. **Configure video CDN** for hero background
4. **Update social media links** (LinkedIn, etc.)
5. **Add Google Analytics** tracking code
6. **Set up proper redirects** for all routes
7. **Test on multiple devices** and browsers

## Quick Command Reference

```bash
# Copy landing to public (Windows)
xcopy "landingpage\www.lithosquare.com" "public\landing" /E /I

# View landing page locally
# Navigate to: http://localhost:5173/landing/www.lithosquare.com/index.html

# Or serve directly if in public folder:
# http://localhost:5173/landingpage/www.lithosquare.com/www.lithosquare.com/index.html
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all file paths are correct
3. Ensure static files are served properly by Vite
4. Check that all React routes are configured

---

**Last Updated**: 2025-12-01
**Version**: 1.0

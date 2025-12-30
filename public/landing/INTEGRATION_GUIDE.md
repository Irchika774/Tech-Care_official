# TechCare Landing Page Integration Guide

## Overview
The landing page has been fully transformed from a mineral exploration company (Lithosquare) to align with TechCare's tech repair services business.

## Changes Made

### 1. **Branding Updates**
- **Page Title**: Changed from "LITHOSQUARE" to "TechCare"
- **Logo**: Replaced complex SVG logo with simple "TechCare" text in footer
- **Copyright**: Updated to "©2025 TechCare"

### 2. **Navigation Links**
All navigation has been updated to point to TechCare routes:
- **About** → `/company`
- **Services** → `/services` (added to footer)
- **Join us** → `/register`
- **Support** → `/support`
- **Contact Us** button → `/support`

### 3. **Hero Section**
- **Subheading**: "Expert Tech Repair" (was "next-gen Exploration")
- **Main Headline**: "TechCare revolutionizes device repair services by connecting customers with certified technicians instantly."
- **Tagline**: "Fast repairs, transparent pricing, expert service, guaranteed quality."

### 4. **Feature Cards**
Transformed all three feature cards:

#### Card 1: "Reliable Tech Solutions"
*Your devices are essential to modern life, but finding trustworthy repair service shouldn't be difficult. TechCare connects you with certified technicians who provide transparent pricing and quality service you can trust.*

#### Card 2: "Smart Repair Matching"
*TechCare uses intelligent matching to connect you with the best technician for your device. Our platform ensures transparent pricing, real-time tracking, and verified expertise — making quality repairs accessible and affordable for everyone.*

#### Card 3: "Certified Expert Network"
*Our network consists of thoroughly vetted, certified technicians specializing in all major device brands. Every repair is backed by our quality guarantee, ensuring your devices receive professional care from trusted experts.*

### 5. **Call-to-Action Section**
- **Message**: "Join thousands of satisfied customers who trust TechCare for reliable, professional device repairs. Experience the future of tech service today."
- **Button**: Changed from "Join us" to "Get Started" → links to `/register`

### 6. **Footer**
- Simplified logo to "TechCare" text
- Updated links: About Us, Services, Join us
- Removed irrelevant "Partners" and "News" sections
- Hidden the News section functionality

## Integration Instructions

### Option 1: Use as Main Landing Page
To use this as your main landing page:

1. Update `src/App.jsx` to serve this page at the root route:
   ```jsx
   <Route path="/" element={<LandingPage />} />
   ```

2. Create a component wrapper that loads the HTML:
   ```jsx
   function LandingPage() {
     useEffect(() => {
       window.location.href = '/landing/www.lithosquare.com/index.html';
     }, []);
     return null;
   }
   ```

### Option 2: Keep Separate
Keep the current React homepage and use this as an alternate landing:
- Access via: `http://localhost:5173/landing/www.lithosquare.com/index.html`
- Link to it from marketing campaigns or specific entry points

### Option 3: Iframe Integration
Embed specific sections within React components:
```jsx
<iframe 
  src="/landing/www.lithosquare.com/index.html" 
  style={{width: '100%', height: '100vh', border: 'none'}}
/>
```

## File Locations
- **Main Landing Page**: `public/landing/www.lithosquare.com/index.html`
- **Assets**: All CSS, JS, and images are properly linked via CDN
- **Styles**: Embedded within the HTML file

## Navigation Flow
```
Landing Page (index.html)
├── About Us → /company (TechCare company info)
├── Services → /services (Service listings)
├── Join us → /register (Sign up as technician/customer)
├── Support → /support (Help & contact)
└── Get Started → /register (CTA button)
```

## Styling & Theme
- **Color Scheme**: Dark theme with accent colors (maintained from original)
- **Animations**: GSAP-powered scroll animations
- **Responsive**: Fully responsive design
- **Design Style**: Modern, clean, with sophisticated animations

## Testing Checklist
- [ ] All navigation links work correctly
- [ ] Forms submit to correct endpoints
- [ ] Responsive design works on mobile/tablet
- [ ] Animations perform smoothly
- [ ] All buttons lead to appropriate pages
- [ ] Footer links are functional
- [ ] Contact buttons work

## Next Steps
1. **Review Content**: Ensure all text aligns with TechCare's messaging
2. **Test Navigation**: Verify all links work in your React app
3. **SEO Optimization**: Update meta tags if using as main landing
4. **Analytics**: Add tracking codes (Google Analytics, etc.)
5. **A/B Testing**: Consider testing different hero messages

## Notes
- The page maintains its sophisticated animation system
- All external dependencies (GSAP, Splide, etc.) load from CDN
- The design is production-ready and optimized
- Hidden sections (Partners, News) can be re-enabled if needed in future

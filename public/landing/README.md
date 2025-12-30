# TechCare Landing Page

## 📍 Location
`landingpage/www.lithosquare.com/www.lithosquare.com/index.html`

## ✅ Status: UPDATED & READY TO USE

This is a premium, modern landing page that has been fully customized for TechCare's device repair platform.

## 🎯 Quick Start

### View the Landing Page

**Option 1: Direct Access**
```
http://localhost:5173/landingpage/www.lithosquare.com/www.lithosquare.com/index.html
```

**Option 2: Copy to Public Folder**
```bash
# Windows
xcopy "landingpage\www.lithosquare.com" "public\landing" /E /I

# Then access at:
http://localhost:5173/landing/www.lithosquare.com/index.html
```

## 📝 What's Been Updated

✅ **All text content** - Changed from mining/geology to device repair services
✅ **All buttons** - Updated to link to TechCare booking pages
✅ **Footer** - Updated copyright, links, and branding
✅ **Navigation** - Connected to TechCare sections
✅ **Meta tags** - SEO-optimized for device repair services
✅ **CTAs** - Book Mobile Repair, Book PC Repair, Join as Technician

## 📚 Documentation

Read these files in the root directory for full details:

1. **LANDING_PAGE_UPDATE_SUMMARY.md** - Complete list of all changes
2. **LANDING_PAGE_INTEGRATION.md** - How to integrate into your React app
3. **LANDING_PAGE_CONTENT_MAP.md** - Visual overview of all content updates
4. **LANDING_PAGE_ENHANCEMENTS.md** - Suggested improvements and next steps

## 🎨 Features

- ✨ Modern, professional design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎬 Background video in hero section
- ⚡ Smooth animations and transitions
- 🎯 Clear call-to-action buttons
- 🎨 Professional color scheme (black/white with accents)
- ♿ Semantic HTML structure
- 🔍 SEO-optimized

## 🔗 Important Links in Landing Page

The landing page includes these links to your main site:

- `/mobile-repair` - Mobile device repair booking
- `/pc-repair` - Computer repair booking
- `/signup?role=technician` - Technician registration
- `/#section-services` - Services section
- `/#section-pricing` - Pricing section
- `/#section-support` - Support section

**Make sure these pages/sections exist in your main website!**

## ⚠️ Before Production

1. **Replace placeholder images** in the news section
2. **Update news article dates** to real dates
3. **Configure background video** with TechCare-specific video
4. **Test all navigation links** 
5. **Add analytics tracking** code
6. **Optimize images** for web
7. **Set up proper CDN** for video assets

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript
- GSAP for animations
- Splide.js for carousels
- Webflow-based design system
- Lenis for smooth scrolling

## 📏 File Structure

```
landingpage/
└── www.lithosquare.com/
    └── www.lithosquare.com/
        ├── index.html          (Main landing page - UPDATED)
        ├── css/                (Styles)
        ├── js/                 (Scripts)
        └── images/             (Assets)
```

## 🎬 Background Video

Current video is a placeholder. For production:

1. Create/obtain TechCare-branded video (15-30 seconds)
2. Optimize for web:
   - Resolution: 1920x1080
   - Format: MP4 (H.264) + WebM
   - Max size: 5MB
3. Upload to CDN
4. Update video sources in HTML (lines ~640-642)

## 🎨 Customization

### Change Colors
Edit the CSS variables in the `<style>` section:
```css
--color-scheme-1--text: #ffffff;
--color-scheme-1--background: #000000;
--color-scheme-1--accent: #your-color;
```

### Update Logo
Replace the SVG logo around line 546-555 in `index.html`

### Modify Content
Text content is located in clear sections:
- Hero: Lines ~622-631
- Feature Cards: Lines ~866-960
- Join Section: Lines ~1420-1426
- News: Lines ~1817-1973
- Footer: Lines ~1980-2212

## 🚀 Deployment

### For Production:

1. **Minify CSS/JS**
   ```bash
   # Use build tools to minify assets
   ```

2. **Optimize Images**
   ```bash
   # Convert to WebP, compress
   ```

3. **Configure CDN**
   - Upload video to video CDN (Cloudflare, Vimeo)
   - Update image paths to CDN URLs

4. **Set Headers**
   ```nginx
   # Nginx example
   location /landing {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

## 📞 Need Help?

Refer to the integration docs:
- Read `LANDING_PAGE_INTEGRATION.md` for step-by-step integration
- Check `LANDING_PAGE_ENHANCEMENTS.md` for upgrade ideas
- Review `LANDING_PAGE_CONTENT_MAP.md` to see all changes

## ✨ Credits

Original design adapted from: Lithosquare (Webflow template)
Customized for: TechCare Device Repair Platform
Updated: December 1, 2025

---

**Ready to use! Just integrate into your React app and deploy.** 🚀

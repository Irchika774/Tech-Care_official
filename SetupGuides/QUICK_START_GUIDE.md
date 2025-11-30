# 🚀 TechCare - Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:5173`

---

## 📱 Explore the Features

### Try These Interactions:

1. **Search** 
   - Click the "Search" button in header
   - Type "screen repair" or "pc"
   - Click on results to navigate

2. **Notifications**
   - Click the "Notifications" button (red badge)
   - View different notification types
   - Scroll through the list

3. **Account**
   - Click the "Account" button
   - Explore menu options
   - Navigate to Profile, Settings, History, or Favorites

4. **Dark Mode**
   - Click the moon/sun icon in header
   - Watch the smooth theme transition

5. **Find Technicians**
   - Click "Find Technicians Now" button
   - Smooth scroll to technicians section

6. **Favorite a Technician**
   - Hover over technician cards
   - Click the heart icon
   - See the zoom effect on hover

7. **Book Appointment**
   - Click "Book" on any technician card
   - Navigate to Schedule page
   - Fill out the booking form

8. **Profile Management**
   - Go to Profile page
   - Click "Edit Profile"
   - Update your information
   - Save changes

9. **Settings**
   - Visit Settings page
   - Toggle various preferences
   - Try dark mode toggle
   - Change language/currency

10. **Service History**
    - Go to History page
    - Filter appointments by status
    - View appointment details

---

## 🗺️ Page Navigation

| Route | Description |
|-------|-------------|
| `/` | Home - Mobile Repairing |
| `/pc-repair` | PC Repair Services |
| `/schedule` | Schedule Appointment |
| `/reviews` | Customer Reviews |
| `/payment` | Payment Processing |
| `/admin` | Admin Dashboard |
| `/profile` | User Profile |
| `/history` | Service History |
| `/favorites` | Saved Technicians |
| `/settings` | User Settings |

---

## 🎨 Test Dark Mode

1. Click the moon icon in header
2. All pages adapt automatically
3. Custom scrollbar changes color
4. All components remain readable
5. Click sun icon to return to light mode

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready for deployment.

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Cache
```bash
npm run build -- --force
```

---

## 🎯 Key Features to Showcase

### For Users
- Browse technicians with filters
- Schedule appointments easily
- Track service history
- Save favorite technicians
- Customize settings
- Switch to dark mode

### For Developers
- Modern React 19
- Vite for fast builds
- Tailwind CSS styling
- Component modularity
- Custom animations
- Theme context
- Reusable hooks

---

## 📚 Documentation

For complete details, see:
- `FEATURES_DOCUMENTATION.md` - All features explained
- `PROJECT_SUMMARY.md` - Project overview
- `INTERACTIVE_FEATURES.md` - Interactive elements guide

---

## ✨ Pro Tips

1. **Smooth Scrolling:** Click "Find Technicians Now" to see smooth scroll
2. **Modal Close:** Click outside modals or press ESC to close
3. **Hover Effects:** Hover over cards to see animations
4. **Favorites:** Heart icons turn red when clicked
5. **Filters:** All filter buttons work on PC Repair page
6. **Status Badges:** Color-coded in History page
7. **Empty States:** Check Favorites with no items
8. **Animations:** All modals have smooth entry/exit

---

## 🚀 Ready to Deploy?

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

### Static Hosting
Upload the `dist/` folder after build

---

**Enjoy exploring TechCare! 🎉**

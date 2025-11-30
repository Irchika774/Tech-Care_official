# TechCare - Quick Start Guide

**Get up and running in 30 seconds! ⚡**

---

## 🎯 Fastest Way to Start

### Option 1: Automated Start (Recommended)
```bash
# Just double-click this file:
start-techcare.bat
```

✅ This starts:
- Backend (http://localhost:5000)
- Frontend (http://localhost:5173)
- Auto-restart monitor
- Opens browser automatically

---

### Option 2: Simple Start
```bash
# Double-click:
start-simple.bat
```

✅ Starts backend + frontend only (no monitoring)

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `start-techcare.bat` | Full launcher with auto-restart |
| `start-simple.bat` | Quick start without monitoring |
| `health-monitor.js` | Backend health checker |
| `DEPLOYMENT_GUIDE.md` | How to deploy to production |
| `AUTOMATION_SCRIPTS.md` | Script documentation |

---

## 🔧 Manual Start (if needed)

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

---

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## 🛑 How to Stop

- Close the terminal windows
- Or press `Ctrl+C` in each terminal

---

## 📋 Features Ready to Test

1. ✅ Home page with video background
2. ✅ Mobile & PC repair pages with Google Maps
3. ✅ Services, Support, Company pages
4. ✅ Login/Register system
5. ✅ SEO on all pages
6. ✅ Currency conversion
7. ✅ Dark mode support

---

## 💡 Pro Tips

- Use `start-techcare.bat` for development (auto-restart on crash)
- Use `start-simple.bat` for quick testing
- Check health monitor terminal to see backend status
- All pages have unique SEO titles
- No duplicate headers/footers anywhere!

---

## 🚀 Deploy to Production

When ready to go live, read: `DEPLOYMENT_GUIDE.md`

---

## 🐛 Problems?

1. Port 5000 or 5173 in use? Close other apps or change ports
2. MongoDB not found? Install MongoDB or use MongoDB Atlas
3. Scripts won't run? Run terminals as Administrator

---

**That's it! You're ready to go! 🎉**

For detailed info, see the full documentation files.

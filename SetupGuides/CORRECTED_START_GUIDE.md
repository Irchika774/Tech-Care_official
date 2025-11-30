# ✅ CORRECTED - How to Start TechCare

**Updated:** November 30, 2025  
**Issue Fixed:** Backend now starts in correct `server/` folder

---

## 🎯 Quick Start (3 Steps)

### Step 1: Verify Setup (First Time Only)
```bash
# Double-click this file:
verify-setup.bat
```

This checks:
- ✅ Node.js installed
- ✅ Dependencies installed
- ✅ Project structure correct

### Step 2: Start the Application
```bash
# Double-click this file:
start-techcare.bat
```

This opens **3 separate terminal windows**:
1. **Backend** - Runs in`server/` folder on port 5000
2. **Frontend** - Runs in root folder on port 5173  
3. **Health Monitor** - Monitors backend health

### Step 3: Use the App
- Browser opens automatically to http://localhost:5173
- Backend API runs at http://localhost:5000

---

## 📂 Directory Structure (IMPORTANT!)

```
Tech-Care_official/
├── server/                    ← Backend runs HERE
│   ├── package.json
│   ├── index.js
│   └── node_modules/
│
├── src/                       ← Frontend code
├── public/
├── package.json               ← Frontend package.json
├── node_modules/             ← Frontend dependencies
│
├── start-techcare.bat        ← Main launcher
├── start-simple.bat          ← Simple launcher
├── verify-setup.bat          ← Setup checker
└── health-monitor.js         ← Auto-restart script
```

---

## 🔧 What Each Script Does

### `verify-setup.bat` ⭐ RUN THIS FIRST
Checks that:
- Node.js & npm are installed
- Frontend dependencies exist (root `node_modules/`)
- Backend dependencies exist (`server/node_modules/`)
- Environment files exist

### `start-techcare.bat` (Full Version)
Opens 3 terminals:
1. **"TechCare Backend"** 
   - Directory: `server/`
   - Command: `npm run dev`
   - Port: 5000

2. **"TechCare Frontend"**
   - Directory: root
   - Command: `npm run dev`
   - Port: 5173

3. **"TechCare Health Monitor"**
   - Watches backend every 30s
   - Auto-restarts if backend crashes

### `start-simple.bat` (Simple Version)
Opens 2 terminals only:
- Backend (in `server/`)
- Frontend (in root)
- No health monitoring

---

## ✅ Verification Steps

After running `start-techcare.bat`, you should see:

### Terminal 1: Backend
```
══════════════════════════════════
  TechCare Backend Server
  Directory: C:\...\server
  Port: 5000
══════════════════════════════════

🚀 TechCare Server running on port 5000
📍 API: http://localhost:5000
🏥 Health: http://localhost:5000/api/health
✅ MongoDB Connected Successfully
```

### Terminal 2: Frontend
```
══════════════════════════════════
  TechCare Frontend Server
  Directory: C:\...\Tech-Care_official
  Port: 5173
══════════════════════════════════

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Terminal 3: Health Monitor
```
══════════════════════════════════
  TechCare Health Monitor
  Monitoring: http://localhost:5000
  Interval: 30 seconds
══════════════════════════════════

╔════════════════════════════════════════════╗
║   TechCare Backend Health Monitor v1.0    ║
╚════════════════════════════════════════════╝

[timestamp] Starting backend server...
[timestamp] Backend start command executed
[timestamp] ✓ Backend is healthy
```

---

## 🐛 Troubleshooting

### Problem: Backend starts in wrong folder
**Symptom:** Error "Cannot find module..." or "package.json not found"

**Solution:** 
- The fixed batch files now use `cd /d "%PROJECT_DIR%server"` for backend
- Make sure you're running the updated `start-techcare.bat`

### Problem: Port already in use
**Symptom:** "Port 5000 already in use" or "Port 5173 already in use"

**Solution:**
1. Stop existing processes:
   ```bash
   # PowerShell:
   Get-Process -Name node | Stop-Process -Force
   ```

2. Or change ports in:
   - Backend: `server/.env` → `PORT=5001`
   - Frontend: `vite.config.js` → `port: 5174`

### Problem: Dependencies missing
**Symptom:** "Cannot find module 'express'" etc.

**Solution:**
```bash
# Install frontend dependencies:
npm install

# Install backend dependencies:
cd server
npm install
```

### Problem: MongoDB connection failed
**Symptom:** "⚠️  MongoDB Connection Failed"

**Solution:**
- The app will still run, just without database
- Install MongoDB or use MongoDB Atlas
- Update `server/.env` with `MONGO_URI`

---

## 🎯 Testing the Fix

### Test 1: Verify Separate Terminals
1. Run `start-techcare.bat`
2. Count terminal windows → Should be **3**
3. Check each window title:
   - "TechCare Backend"
   - "TechCare Frontend"
   - "TechCare Health Monitor"

### Test 2: Verify Backend Directory
1. Look at Backend terminal
2. Check the "Directory:" line
3. Should end with `\server`

### Test 3: Verify Health Monitor Works
1. Go to Backend terminal
2. Press Ctrl+C to stop backend
3. Watch Health Monitor terminal
4. Should detect failure and restart backend

### Test 4: Verify App Works
1. Browser should open to http://localhost:5173
2. Navigate to different pages
3. Check browser console (F12) for errors
4. Should see "Loading..." spinner when navigating

---

## 📊 All Scripts Summary

| Script | Terminals | Monitoring | Use When |
|--------|-----------|------------|----------|
| `verify-setup.bat` | 0 | No | First time setup |
| `start-techcare.bat` | 3 | Yes | Development (recommended) |
| `start-simple.bat` | 2 | No | Quick testing |

---

## ✨ What Was Fixed

### Before (Incorrect):
- ❌ Backend tried to run from root folder
- ❌ Frontend opened multiple times
- ❌ Health monitor couldn't find server folder

### After (Correct):
- ✅ Backend runs from `server/` folder
- ✅ Frontend runs from root folder once
- ✅ Health monitor starts backend in correct folder
- ✅ All3 terminal windows open correctly

---

**Everything is now fixed and ready to use!** 🎉

Run `start-techcare.bat` and you should see 3 separate terminal windows with backend in the `server/` folder.

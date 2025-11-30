# TechCare Automation Scripts

```

---

### 2. `start-simple.bat`
**Quick start without health monitoring**

This script starts only:
- Backend server
- Frontend server

**Usage:**
```bash
# Double-click the file, or run from terminal:
start-simple.bat
```

Use this when you don't need automatic restart functionality.

---

### 3. `health-monitor.js`
**Standalone backend health monitor**

This Node.js script:
- Checks backend health every 30 seconds
- Automatically restarts backend if it goes offline
- Provides detailed console logging

**Features:**
- Health check endpoint: `GET /api/health`
- Automatic process management
- Graceful shutdown handling
- Color-coded status messages

**Usage:**
```bash
# Run standalone:
node health-monitor.js

# Or it runs automatically with start-techcare.bat
```

**How it works:**
1. Sends HTTP request to `http://localhost:5000/api/health`
2. If response is successful (200), backend is healthy ✓
3. If request fails or times out, restarts backend
4. Waits 30 seconds and repeats

---

## 🎯 Recommended Workflow

### For Development:
Use `start-techcare.bat` for the most robust development experience.

### For Quick Testing:
Use `start-simple.bat` when you just need to run the servers quickly.

### For Production:
Do not use these scripts in production. Use proper process managers like PM2 or systemd.

---

## 🔧 Configuration

### Health Monitor Settings

Edit `health-monitor.js` to customize:

```javascript
const BACKEND_URL = 'http://localhost:5000';  // Backend URL
const CHECK_INTERVAL = 30000;                  // Check every 30s
```

### Batch File Settings

Edit `.bat` files to customize terminal behavior or add delays.

---

## 🛑 Stopping Services

### Option 1: Close Terminal Windows
Simply close the individual terminal windows:
- "TechCare Backend"
- "TechCare Frontend"  
- "TechCare Health Monitor"

### Option 2: Use Ctrl+C
Press `Ctrl+C` in any terminal window to stop that service.

### Option 3: Task Manager
Kill Node.js processes from Windows Task Manager if needed.

---

## 📊 Health Check Endpoint

The health monitor requires a `/api/health` endpoint on the backend.

**Implementation in `server/index.js`:**

```javascript
// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

This endpoint is already implemented in the TechCare backend.

---

## 🎨 Console Output

The health monitor provides color-coded output:

- 🟢 **Green**: Backend is healthy
- 🔴 **Red**: Backend is offline
- 🟡 **Yellow**: Warning messages
- 🔵 **Blue**: Info messages
- 🔷 **Cyan**: System messages

---

## 🐛 Troubleshooting

### Backend won't start:
1. Check if port 5000 is already in use
2. Verify MongoDB is running
3. Check `.env` file configuration

### Frontend won't start:
1. Check if port 5173 is already in use
2. Run `npm install` if dependencies are missing

### Health monitor keeps restarting backend:
1. Check backend logs for errors
2. Verify `/api/health` endpoint exists
3. Increase `CHECK_INTERVAL` if network is slow

### Batch files don't work:
1. Run as Administrator
2. Ensure Node.js and npm are in system PATH
3. Check file paths in batch script

---

## 📝 Notes

- The health monitor uses Node.js `child_process` to manage the backend
- All scripts are designed for Windows (PowerShell/CMD)
- For Linux/Mac, create shell script equivalents
- Health monitor logs are timestamped for debugging

---

## 🔄 Auto-restart Logic

```
┌─────────────────────────────────────┐
│  Health Monitor (Every 30 seconds)  │
└───────────────┬─────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Backend alive?│
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
     ✓ Yes            ✗ No
        │               │
        ▼               ▼
  ┌─────────┐    ┌──────────────┐
  │Continue │    │Kill & Restart│
  │Monitoring    │Backend Process│
  └─────────┘    └──────────────┘
```

---

## 📚 Related Files

- `server/index.js` - Backend entry point (has /api/health)
- `package.json` - Contains dev scripts
- `.env` - Environment configuration

---

**Created:** 2025-11-30
**Version:** 1.0
**Tested On:** Windows 10/11

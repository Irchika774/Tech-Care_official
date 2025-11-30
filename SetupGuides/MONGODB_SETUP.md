# Quick MongoDB Setup Guide

## Option 1: Install MongoDB Community Edition

### Download & Install:
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Choose "Windows" and "msi" installer
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB as a Service (check the box during installation)

### After Installation:
MongoDB will start automatically as a Windows service.

To verify:
```powershell
mongod --version
```

## Option 2: Use MongoDB Atlas (Cloud - Easier!)

### Setup (5 minutes):
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a FREE cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Configure Your App:
Create or update `.env` file in the server directory:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techcare?retryWrites=true&w=majority
PORT=5000
```

Replace `username:password` and cluster URL with your actual values.

### Restart Backend:
```powershell
# Stop current server (Ctrl+C in the terminal)
# Start again
cd server
node index.js
```

## Option 3: Quick Test with Sample Local MongoDB

If you have Docker installed:
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then seed the database:
```powershell
cd server
node seedTechnicians.js
```

## After MongoDB is Running:

### 1. Seed the Database:
```powershell
cd server
node seedTechnicians.js
```

This will add 6 sample technicians to your database.

### 2. Verify Data:
The seed script will show you all added technicians.

### 3. Refresh Browser:
Go to http://localhost:5173/mobile-repair and you should see the technicians!

## Troubleshooting:

### If you see "MongoDB Connection Failed":
- Check if MongoDB service is running (Windows Services)
- Or use MongoDB Atlas cloud option instead

### If port 5000 is busy:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000  

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F

# Restart server
cd server
node index.js
```

## Recommended: MongoDB Atlas (No Installation Needed!)

This is the easiest option:
1. No local installation required
2. Free forever (512MB storage)
3. Automatic backups
4. Accessible from anywhere
5. Better for development and production

Just update the `.env` file with your Atlas connection string!

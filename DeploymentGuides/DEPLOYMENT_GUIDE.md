# TechCare - Complete Production Deployment Guide

**Version:** 1.0  
**Last Updated:** 2025-11-30  
**Platform:** Full-Stack MERN Application

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Development Scripts](#development-scripts)
4. [Building for Production](#building-for-production)
5. [Deployment Options](#deployment-options)
6. [Environment Variables](#environment-variables)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: v6.x or higher (or MongoDB Atlas account)
- **Git**: For version control

### Recommended Tools:
- **VS Code**: With ESLint and Prettier extensions
- **Postman**: For API testing
- **MongoDB Compass**: For database management

---

## 🚀 Development Scripts

### Quick Start (Automated):

```bash
# Option 1: With health monitoring (Recommended)
start-techcare.bat

# Option 2: Simple start without monitoring
start-simple.bat
```

### Manual Start:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Health Monitor (Optional)
node health-monitor.js
```

---

## 🏗️ Building for Production

### 1. Frontend Build:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Output: dist/ folder
```

### 2. Backend Preparation:

```bash
cd server

# Install production dependencies only
npm install --production

# Remove dev dependencies
npm prune --production
```

### 3. Test Production Build Locally:

```bash
# Serve frontend build locally
npm install -g serve
serve -s dist -p 3000

# Backend should run on port 5000
cd server
npm start
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### **Frontend to Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

#### **Environment Variables on Vercel:**
```env
VITE_API_URL=https://your-backend.railway.app
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

#### **Backend to Railway:**

1. Create account at railway.app
2. New Project → Deploy from GitHub
3. Select `/server` as root directory
4. Add environment variables (see below)
5. Deploy!

---

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### **Frontend to Netlify:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Build settings:
# - Build command: npm run build
# - Publish directory: dist
```

#### **Backend to Heroku:**

```bash
# Install Heroku CLI
# Create Procfile in server/:
echo "web: node index.js" > server/Procfile

# Deploy
cd server
heroku create techcare-backend
git push heroku main
```

---

### Option 3: DigitalOcean (Full Stack)

#### **Droplet Setup:**

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
# Follow MongoDB installation guide

# Clone repository
git clone https://github.com/yourusername/techcare.git
cd techcare

# Install dependencies
npm install
cd server && npm install

# Setup PM2 for process management
npm install -g pm2

# Start backend
cd server
pm2 start index.js --name techcare-backend

# Build and serve frontend
cd ..
npm run build
pm2 serve dist 3000 --name techcare-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### **Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Environment Variables

### Frontend (.env):

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Backend (server/.env):

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/techcare

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXX

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Google Maps (Backend)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

---

## 📊 Monitoring & Logs

### Health Monitoring:

```bash
# Automated (Development)
node health-monitor.js

# Manual Health Check
curl http://localhost:5000/api/health

# Expected Response:
{
  "status": "running",
  "timestamp": "2025-11-30T02:25:40.000Z",
  "database": "connected",
  "port": 5000,
  "uptime": 123.456
}
```

### PM2 Monitoring (Production):

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart service
pm2 restart techcare-backend

# View specific service logs
pm2 logs techcare-backend --lines 100
```

### Log Files:

```bash
# Create log directories
mkdir -p server/logs

# PM2 logs location
~/.pm2/logs/
```

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

#### 2. Frontend Build Fails
```bash
# Clear cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### 3. Database Connection Timeout
```env
# In server/.env, increase timeout
MONGO_CONNECTION_TIMEOUT=30000

# Or use MongoDB Atlas (recommended for production)
MONGO_URI=mongodb+srv://...
```

#### 4. CORS Errors
```javascript
// In server/index.js, update CORS config:
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
```

#### 5. Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la | grep .env

# Check file is in correct directory
# Frontend: .env (root)
# Backend: server/.env

# Restart server after changes
```

---

## 📚 Additional Resources

### Documentation:
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Security Checklist:
- [ ] Change all default passwords
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Set up CORS properly
- [ ] Use strong JWT secret
- [ ] Regular security updates (`npm audit fix`)

---

## 🎯 Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups set up
- [ ] SSL certificate installed
- [ ] Monitoring tools configured
- [ ] Error tracking (Sentry, etc.) set up
- [ ] CDN configured for static assets
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] User documentation complete

---

**Happy Deploying! 🚀**

For support, please open an issue on GitHub or contact the development team.

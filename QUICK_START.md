# Quick Start Guide

## Run the Application (Windows)

### Option 1: Using the Batch File
Double-click `start.bat` to launch the development server.

### Option 2: Using Command Line
```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## Navigation

Once running, you can navigate to:

- **Home**: http://localhost:5173/
- **Schedule**: http://localhost:5173/schedule
- **Reviews**: http://localhost:5173/reviews
- **Payment**: http://localhost:5173/payment
- **Admin Dashboard**: http://localhost:5173/admin

## Key Features to Test

### 1. Dark Mode Toggle
- Click the moon/sun icon in the top-right header
- Theme preference is saved to localStorage

### 2. Homepage
- Browse featured technicians
- Use search and filter inputs
- Click "Schedule Appointment" on any card to go to booking page

### 3. Schedule Page
- Select device type (Smartphone/Laptop/PC)
- Choose repair service from dropdown
- Select technician
- Pick a date from calendar
- Choose time slot
- Click "Confirm Appointment" to proceed to payment

### 4. Reviews Page
- Rate with interactive star system (hover and click)
- Write and submit reviews
- View existing customer reviews

### 5. Payment Page
- Select payment method (Credit Card/PayPal/Google Pay/Apple Pay)
- Fill in card details
- Click "Complete Payment"

### 6. Admin Dashboard
- View statistics (Total Users, Active Technicians, etc.)
- Check pie chart for service distribution
- See bar chart for monthly registrations
- Review recent platform activity table
- Navigate sidebar menu items

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Installation Issues
Run:
```bash
npm install --force
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
Any changes to `.jsx` files will automatically reload the page.

### Console Errors
Open browser DevTools (F12) to see any errors or warnings.

### Component Location
- Pages: `src/pages/`
- Components: `src/components/`
- Context: `src/context/`

Enjoy using TechCare! 🚀

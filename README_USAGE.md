# TechCare React Application

A fully functional React website for device repair services, converted from HTML templates.

## Features

- **Multi-page Application**: Home, Schedule, Reviews, Payment, and Admin Dashboard pages
- **React Router**: Seamless navigation between pages
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Interactive Components**:
  - Technician cards with booking functionality
  - Search and filter system for technicians
  - Appointment scheduling with date and time picker
  - Star rating system for reviews
  - Payment method selection
  - Admin dashboard with statistics and charts

## Pages

1. **Home** (`/`): Landing page with featured technicians and search filters
2. **Schedule** (`/schedule`): Book appointments with device selection and calendar
3. **Reviews** (`/reviews`): Customer reviews with rating system
4. **Payment** (`/payment`): Secure payment form with multiple payment methods
5. **Admin** (`/admin`): Dashboard with statistics, charts, and activity logs

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd techcare-react-app
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
techcare-react-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with theme toggle
│   │   ├── Footer.jsx          # Site footer
│   │   └── TechnicianCard.jsx  # Reusable technician card component
│   ├── context/
│   │   └── ThemeContext.jsx    # Dark mode context provider
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Schedule.jsx        # Appointment booking
│   │   ├── Reviews.jsx         # Customer reviews
│   │   ├── Payment.jsx         # Payment information
│   │   └── Admin.jsx           # Admin dashboard
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
└── package.json
```

## Technologies Used

- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Material Icons**: Icon library
- **Vite**: Build tool and dev server

## Features Details

### Dark Mode
- Toggle button in the header
- Persists preference in localStorage
- Smooth transitions between themes

### Routing
All pages are accessible through:
- `/` - Home
- `/schedule` - Schedule Appointment
- `/reviews` - Customer Reviews
- `/payment` - Payment Page
- `/admin` - Admin Dashboard

### Interactive Elements
- Clickable technician cards
- Functional search and filter inputs
- Interactive calendar date picker
- Star rating hover effects
- Payment method selection
- Admin sidebar navigation

## Customization

### Colors
Edit the Tailwind config in `index.html` to change the color scheme:
```javascript
colors: {
  primary: "#4F46E5", // Change primary color
  // ... other colors
}
```

### Data
Replace static data in components with API calls:
- Technician data in `Home.jsx`
- Reviews in `Reviews.jsx`
- Admin statistics in `Admin.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project was created from HTML templates and converted to a React application.

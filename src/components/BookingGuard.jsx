
import { Navigate, useLocation } from 'react-router-dom';

const BookingGuard = ({ children, requiredContext = 'service' }) => {
    const location = useLocation();
    const state = location.state || {};

    // For Schedule page: Needs service intent or technician selection
    if (requiredContext === 'service') {
        const hasLocalStorageContext = localStorage.getItem('techcare_booking_deviceType') ||
            localStorage.getItem('techcare_booking_description');
        if (!state.service && !state.technician && !state.fromServicePage && !hasLocalStorageContext) {
            console.warn('[BookingGuard] Access denied to /schedule: Missing service context');
            return <Navigate to="/services" />;
        }
    }

    // For Payment page: Needs a booking object
    if (requiredContext === 'payment') {
        const hasSessionBooking = sessionStorage.getItem('current_booking_payment');
        if (!state.booking && !hasSessionBooking) {
            console.warn('[BookingGuard] Access denied to /payment: Missing booking data');
            return <Navigate to="/customer-dashboard" />;
        }
    }

    return children;
};

export default BookingGuard;

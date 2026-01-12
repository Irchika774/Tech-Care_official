
import { Navigate, useLocation } from 'react-router-dom';

const BookingGuard = ({ children, requiredContext = 'service' }) => {
    const location = useLocation();
    const state = location.state || {};

    // For Schedule page: Needs service intent or technician selection
    if (requiredContext === 'service') {
        if (!state.service && !state.technician && !state.fromServicePage) {
            console.warn('[BookingGuard] Access denied to /schedule: Missing service context');
            return <Navigate to="/services" replace />;
        }
    }

    // For Payment page: Needs a booking object
    if (requiredContext === 'payment') {
        if (!state.booking) {
            console.warn('[BookingGuard] Access denied to /payment: Missing booking data');
            return <Navigate to="/customer-dashboard" replace />;
        }
    }

    return children;
};

export default BookingGuard;

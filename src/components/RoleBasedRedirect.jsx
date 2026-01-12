
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" replace />;
        case 'technician':
            return <Navigate to="/technician-dashboard" replace />;
        case 'user':
        default:
            return <Navigate to="/customer-dashboard?tab=settings" replace />;
    }
};

export default RoleBasedRedirect;

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (user.role === 'technician') {
            return <Navigate to="/technician-dashboard" replace />;
        } else {
            return <Navigate to="/customer-dashboard" replace />;
        }
    }

    return children;
}

export function AdminRoute({ children }) {
    return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>;
}

export function TechnicianRoute({ children }) {
    return <ProtectedRoute allowedRoles={['technician', 'admin']}>{children}</ProtectedRoute>;
}

export function CustomerRoute({ children }) {
    return <ProtectedRoute allowedRoles={['user', 'customer', 'admin']}>{children}</ProtectedRoute>;
}

export function AuthenticatedRoute({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default ProtectedRoute;
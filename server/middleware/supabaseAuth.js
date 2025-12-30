import { verifySupabaseToken, getProfileByUserId, getCustomerByUserId, getTechnicianByUserId } from '../lib/supabase.js';

export const supabaseAuth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const user = await verifySupabaseToken(token);
        const profile = await getProfileByUserId(user.id);
        
        req.user = {
            _id: user.id,
            id: user.id,
            email: user.email,
            role: profile.role,
            name: profile.name
        };

        if (profile.role === 'technician') {
            const tech = await getTechnicianByUserId(user.id);
            if (tech) req.user.technicianId = tech.id;
        } else if (profile.role === 'user' || profile.role === 'customer') {
            const cust = await getCustomerByUserId(user.id);
            if (cust) req.user.customerId = cust.id;
        }

        next();
    } catch (error) {
        console.error('Supabase auth error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied. Insufficient permissions.',
                required: roles,
                current: req.user.role
            });
        }

        next();
    };
};

export const requireAdmin = requireRole('admin');
export const requireTechnician = requireRole('technician', 'admin');
export const requireCustomer = requireRole('user', 'customer', 'admin');

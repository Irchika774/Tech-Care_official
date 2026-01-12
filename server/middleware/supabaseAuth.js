import { verifySupabaseToken, getProfileByUserId, getCustomerByUserId, getTechnicianByUserId } from '../lib/supabase.js';

export const supabaseAuth = async (req, res, next) => {
    console.log('[DEBUG] supabaseAuth started');
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        console.log('[DEBUG] supabaseAuth: No token');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        console.log('[DEBUG] supabaseAuth: Verifying token...');
        const user = await verifySupabaseToken(token);
        console.log('[DEBUG] supabaseAuth: Token verified for user:', user.id);
        
        // Optimize: Fetch profile first to know the role, then fetch specific data
        let profile = await getProfileByUserId(user.id).catch(() => null);

        if (!profile) {
            console.log('[DEBUG] supabaseAuth: No profile found for user, creating one:', user.id);
            // Auto-create profile if missing (robustness)
            const { data: newProfile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .insert([{
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0],
                    role: user.user_metadata?.role || 'user'
                }])
                .select()
                .single();
            
            if (profileError) {
                console.error('Failed to auto-create profile:', profileError);
                return res.status(401).json({ error: 'User profile not found and could not be created.' });
            }
            profile = newProfile;
        }

        let customer = null;
        let technician = null;

        // Only fetch role-specific data if needed
        if (profile.role === 'technician') {
            technician = await getTechnicianByUserId(user.id).catch(() => null);
            if (!technician) {
                console.log('[DEBUG] supabaseAuth: Creating missing technician record for:', user.id);
                const { data: newTechnician } = await supabaseAdmin
                    .from('technicians')
                    .insert([{
                        user_id: user.id,
                        name: profile.name,
                        email: profile.email
                    }])
                    .select()
                    .single();
                technician = newTechnician;
            }
        } else if (profile.role === 'user' || profile.role === 'customer') {
            customer = await getCustomerByUserId(user.id).catch(() => null);
            if (!customer) {
                console.log('[DEBUG] supabaseAuth: Creating missing customer record for:', user.id);
                const { data: newCustomer } = await supabaseAdmin
                    .from('customers')
                    .insert([{
                        user_id: user.id,
                        name: profile.name,
                        email: profile.email
                    }])
                    .select()
                    .single();
                customer = newCustomer;
            }
        }

        console.log('[DEBUG] supabaseAuth: Profile found with role:', profile.role);
        
        req.user = {
            _id: user.id,
            id: user.id,
            email: user.email,
            role: profile.role,
            name: profile.name
        };

        if (profile.role === 'technician' && technician) {
            req.user.technicianId = technician.id;
        } else if ((profile.role === 'user' || profile.role === 'customer') && customer) {
            req.user.customerId = customer.id;
        }

        console.log('[DEBUG] supabaseAuth finished');
        next();
    } catch (error) {
        console.error('[DEBUG] supabaseAuth error:', error.message);
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

import { supabaseAdmin, verifySupabaseToken, getProfileByUserId, getCustomerByUserId, getTechnicianByUserId } from '../lib/supabase.js';

export const supabaseAuth = async (req, res, next) => {
    // console.log('[DEBUG] supabaseAuth started');
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        console.warn('[AUTH] Missing token');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const user = await verifySupabaseToken(token);

        // Fetch or create profile
        let profile = await getProfileByUserId(user.id).catch(() => null);

        if (!profile) {
            console.log('[AUTH] Auto-creating missing profile for user:', user.id);
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
                console.error('[AUTH] Failed to auto-create profile:', profileError);
                return res.status(401).json({ error: 'User profile initialization failed.' });
            }
            profile = newProfile;
        }

        let customer = null;
        let technician = null;

        // Ensure role-specific records exist
        if (profile.role === 'technician') {
            technician = await getTechnicianByUserId(user.id).catch(() => null);
            if (!technician) {
                console.log('[AUTH] Creating missing technician record for:', user.id);
                const { data: newTech, error: techError } = await supabaseAdmin
                    .from('technicians')
                    .insert([{
                        user_id: user.id,
                        name: profile.name,
                        email: profile.email
                    }])
                    .select()
                    .single();

                if (techError) console.error('[AUTH] Technician Record Creation Failed:', techError);
                technician = newTech;
            }
        } else if (profile.role === 'user' || profile.role === 'customer') {
            customer = await getCustomerByUserId(user.id).catch(() => null);
            if (!customer) {
                console.log('[AUTH] Creating missing customer record for:', user.id);
                const { data: newCust, error: custError } = await supabaseAdmin
                    .from('customers')
                    .insert([{
                        user_id: user.id,
                        name: profile.name,
                        email: profile.email
                    }])
                    .select()
                    .single();

                if (custError) console.error('[AUTH] Customer Record Creation Failed:', custError);
                customer = newCust;
            }
        }

        req.user = {
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

        // Final check: if user is logged in as user role but no customer record exists, 
        // we might want to know why.
        if ((profile.role === 'user' || profile.role === 'customer') && !req.user.customerId) {
            console.error(`[AUTH] Critical: User ${user.id} has profile role '${profile.role}' but no customer record found/created.`);
        }

        next();
    } catch (error) {
        console.error('[AUTH] Token verification error:', error.message);
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

import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Get user's loyalty account
router.get('/account', supabaseAuth, async (req, res) => {
    try {
        const customerId = req.user.customerId || req.user.id;

        // Try to get existing account
        let { data: account, error } = await supabaseAdmin
            .from('loyalty_accounts')
            .select(`
                *,
                loyalty_tiers:current_tier (*)
            `)
            .eq('customer_id', customerId)
            .single();

        // If no account exists, create one
        if (!account && error?.code === 'PGRST116') {
            const { data: newAccount, error: createError } = await supabaseAdmin
                .from('loyalty_accounts')
                .insert({ customer_id: customerId })
                .select(`
                    *,
                    loyalty_tiers:current_tier (*)
                `)
                .single();

            if (createError) throw createError;
            account = newAccount;
        } else if (error) {
            throw error;
        }

        // Calculate points to next tier
        const tiers = ['bronze', 'silver', 'gold', 'platinum'];
        const currentTierIndex = tiers.indexOf(account.current_tier);
        const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

        let pointsToNextTier = null;
        if (nextTier) {
            const { data: nextTierData } = await supabaseAdmin
                .from('loyalty_tiers')
                .select('min_points')
                .eq('name', nextTier)
                .single();

            if (nextTierData) {
                pointsToNextTier = nextTierData.min_points - account.current_points;
            }
        }

        res.json({
            ...account,
            pointsToNextTier,
            nextTierName: nextTier
        });
    } catch (error) {
        console.error('Get loyalty account error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch loyalty account' });
    }
});

// Get loyalty tiers
router.get('/tiers', async (req, res) => {
    try {
        const { data: tiers, error } = await supabaseAdmin
            .from('loyalty_tiers')
            .select('*')
            .order('min_points', { ascending: true });

        if (error) throw error;

        res.json(tiers || []);
    } catch (error) {
        console.error('Get tiers error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch tiers' });
    }
});

// Get available rewards
router.get('/rewards', async (req, res) => {
    try {
        const { min_tier } = req.query;

        let query = supabaseAdmin
            .from('rewards')
            .select('*')
            .eq('is_active', true)
            .order('points_required', { ascending: true });

        const { data: rewards, error } = await query;

        if (error) throw error;

        res.json(rewards || []);
    } catch (error) {
        console.error('Get rewards error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch rewards' });
    }
});

// Redeem a reward
router.post('/redeem', supabaseAuth, async (req, res) => {
    try {
        const { reward_id } = req.body;
        const customerId = req.user.customerId || req.user.id;

        if (!reward_id) {
            return res.status(400).json({ error: 'reward_id is required' });
        }

        // Get user's account
        const { data: account, error: accountError } = await supabaseAdmin
            .from('loyalty_accounts')
            .select('*')
            .eq('customer_id', customerId)
            .single();

        if (accountError || !account) {
            return res.status(404).json({ error: 'Loyalty account not found' });
        }

        // Get reward details
        const { data: reward, error: rewardError } = await supabaseAdmin
            .from('rewards')
            .select('*')
            .eq('id', reward_id)
            .eq('is_active', true)
            .single();

        if (rewardError || !reward) {
            return res.status(404).json({ error: 'Reward not found or not available' });
        }

        // Check if user has enough points
        if (account.current_points < reward.points_required) {
            return res.status(400).json({
                error: 'Insufficient points',
                required: reward.points_required,
                available: account.current_points
            });
        }

        // Check stock
        if (reward.stock !== null && reward.stock <= 0) {
            return res.status(400).json({ error: 'Reward out of stock' });
        }

        // Generate unique redemption code
        const rewardCode = `TC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (reward.valid_days || 30));

        // Start transaction
        const newPoints = account.current_points - reward.points_required;

        // Update account points
        const { error: updateError } = await supabaseAdmin
            .from('loyalty_accounts')
            .update({ current_points: newPoints })
            .eq('id', account.id);

        if (updateError) throw updateError;

        // Create redeemed reward record
        const { data: redemption, error: redemptionError } = await supabaseAdmin
            .from('redeemed_rewards')
            .insert({
                account_id: account.id,
                customer_id: customerId,
                reward_id: reward.id,
                points_spent: reward.points_required,
                reward_code: rewardCode,
                status: 'active',
                expires_at: expiresAt.toISOString()
            })
            .select()
            .single();

        if (redemptionError) throw redemptionError;

        // Record transaction
        await supabaseAdmin
            .from('loyalty_transactions')
            .insert({
                account_id: account.id,
                customer_id: customerId,
                transaction_type: 'redeem_reward',
                points: -reward.points_required,
                balance_after: newPoints,
                reference_type: 'reward',
                reference_id: reward.id,
                description: `Redeemed: ${reward.name}`
            });

        // Update stock if applicable
        if (reward.stock !== null) {
            await supabaseAdmin
                .from('rewards')
                .update({ stock: reward.stock - 1 })
                .eq('id', reward.id);
        }

        res.json({
            success: true,
            redemption: {
                ...redemption,
                reward_name: reward.name,
                reward_type: reward.reward_type,
                value: reward.value,
                discount_percent: reward.discount_percent
            },
            newBalance: newPoints
        });
    } catch (error) {
        console.error('Redeem reward error:', error);
        res.status(500).json({ error: error.message || 'Failed to redeem reward' });
    }
});

// Get user's redeemed rewards
router.get('/redeemed', supabaseAuth, async (req, res) => {
    try {
        const customerId = req.user.customerId || req.user.id;
        const { status = 'active' } = req.query;

        let query = supabaseAdmin
            .from('redeemed_rewards')
            .select(`
                *,
                reward:reward_id (name, reward_type, value, discount_percent, description)
            `)
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: redeemed, error } = await query;

        if (error) throw error;

        res.json(redeemed || []);
    } catch (error) {
        console.error('Get redeemed rewards error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch redeemed rewards' });
    }
});

// Get transaction history
router.get('/transactions', supabaseAuth, async (req, res) => {
    try {
        const customerId = req.user.customerId || req.user.id;
        const { limit = 20, offset = 0, type } = req.query;

        let query = supabaseAdmin
            .from('loyalty_transactions')
            .select('*', { count: 'exact' })
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (type) {
            query = query.eq('transaction_type', type);
        }

        const { data: transactions, count, error } = await query;

        if (error) throw error;

        res.json({
            transactions: transactions || [],
            total: count || 0,
            hasMore: (count || 0) > parseInt(offset) + parseInt(limit)
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
    }
});

// Use a redemption code/reward
router.post('/use-reward', supabaseAuth, async (req, res) => {
    try {
        const { code, booking_id } = req.body;
        const customerId = req.user.customerId || req.user.id;

        if (!code) {
            return res.status(400).json({ error: 'Redemption code is required' });
        }

        // Find the redemption
        const { data: redemption, error: findError } = await supabaseAdmin
            .from('redeemed_rewards')
            .select(`
                *,
                reward:reward_id (*)
            `)
            .eq('reward_code', code)
            .eq('customer_id', customerId)
            .eq('status', 'active')
            .single();

        if (findError || !redemption) {
            return res.status(404).json({ error: 'Invalid or expired redemption code' });
        }

        // Check if expired
        if (new Date(redemption.expires_at) < new Date()) {
            await supabaseAdmin
                .from('redeemed_rewards')
                .update({ status: 'expired' })
                .eq('id', redemption.id);

            return res.status(400).json({ error: 'Redemption code has expired' });
        }

        // Mark as used
        const { error: useError } = await supabaseAdmin
            .from('redeemed_rewards')
            .update({
                status: 'used',
                used_at: new Date().toISOString(),
                used_on_booking: booking_id || null
            })
            .eq('id', redemption.id);

        if (useError) throw useError;

        res.json({
            success: true,
            reward: redemption.reward,
            message: 'Reward applied successfully'
        });
    } catch (error) {
        console.error('Use reward error:', error);
        res.status(500).json({ error: error.message || 'Failed to use reward' });
    }
});

// Add points (admin only)
router.post('/add-points', supabaseAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { customer_id, points, reason, reference_type, reference_id } = req.body;

        if (!customer_id || !points) {
            return res.status(400).json({ error: 'customer_id and points are required' });
        }

        // Get or create account
        let { data: account } = await supabaseAdmin
            .from('loyalty_accounts')
            .select('*')
            .eq('customer_id', customer_id)
            .single();

        if (!account) {
            const { data: newAccount, error: createError } = await supabaseAdmin
                .from('loyalty_accounts')
                .insert({ customer_id })
                .select()
                .single();

            if (createError) throw createError;
            account = newAccount;
        }

        const newPoints = account.current_points + parseInt(points);
        const newLifetime = account.lifetime_points + (points > 0 ? parseInt(points) : 0);

        await supabaseAdmin
            .from('loyalty_accounts')
            .update({
                current_points: newPoints,
                lifetime_points: newLifetime
            })
            .eq('id', account.id);

        // Record transaction
        await supabaseAdmin
            .from('loyalty_transactions')
            .insert({
                account_id: account.id,
                customer_id,
                transaction_type: points > 0 ? 'earn_bonus' : 'adjust',
                points: parseInt(points),
                balance_after: newPoints,
                reference_type,
                reference_id,
                description: reason || (points > 0 ? 'Bonus points added' : 'Points adjustment')
            });

        res.json({
            success: true,
            newBalance: newPoints,
            lifetimePoints: newLifetime
        });
    } catch (error) {
        console.error('Add points error:', error);
        res.status(500).json({ error: error.message || 'Failed to add points' });
    }
});

export default router;

import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { successResponse, errorResponse } from '../lib/response.js';

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

        return successResponse(res, {
            ...account,
            pointsToNextTier,
            nextTierName: nextTier
        });
    } catch (error) {
        console.error('Get loyalty account error:', error);
        return errorResponse(res, 'Failed to fetch loyalty account');
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

        return successResponse(res, tiers || []);
    } catch (error) {
        console.error('Get tiers error:', error);
        return errorResponse(res, 'Failed to fetch tiers');
    }
});

// Get available rewards
router.get('/rewards', async (req, res) => {
    try {
        const { data: rewards, error } = await supabaseAdmin
            .from('rewards')
            .select('*')
            .eq('is_active', true)
            .order('points_required', { ascending: true });

        if (error) throw error;

        return successResponse(res, rewards || []);
    } catch (error) {
        console.error('Get rewards error:', error);
        return errorResponse(res, 'Failed to fetch rewards');
    }
});

// Redeem a reward
router.post('/redeem', supabaseAuth, async (req, res) => {
    try {
        const { reward_id } = req.body;
        const customerId = req.user.customerId || req.user.id;

        if (!reward_id) {
            return errorResponse(res, 'reward_id is required', 400);
        }

        // Get user's account
        const { data: account, error: accountError } = await supabaseAdmin
            .from('loyalty_accounts')
            .select('*')
            .eq('customer_id', customerId)
            .single();

        if (accountError || !account) {
            return errorResponse(res, 'Loyalty account not found', 404);
        }

        // Get reward details
        const { data: reward, error: rewardError } = await supabaseAdmin
            .from('rewards')
            .select('*')
            .eq('id', reward_id)
            .eq('is_active', true)
            .single();

        if (rewardError || !reward) {
            return errorResponse(res, 'Reward not found or not available', 404);
        }

        // Check if user has enough points
        if (account.current_points < reward.points_required) {
            return errorResponse(res, `Insufficient points. Required: ${reward.points_required}, Available: ${account.current_points}`, 400);
        }

        // Check stock
        if (reward.stock !== null && reward.stock <= 0) {
            return errorResponse(res, 'Reward out of stock', 400);
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

        return successResponse(res, {
            redemption: {
                ...redemption,
                reward_name: reward.name,
                reward_type: reward.reward_type,
                value: reward.value,
                discount_percent: reward.discount_percent
            },
            newBalance: newPoints
        }, 'Reward redeemed successfully');
    } catch (error) {
        console.error('Redeem reward error:', error);
        return errorResponse(res, 'Failed to redeem reward');
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

        return successResponse(res, redeemed || []);
    } catch (error) {
        console.error('Get redeemed rewards error:', error);
        return errorResponse(res, 'Failed to fetch redeemed rewards');
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

        return successResponse(res, {
            transactions: transactions || [],
            total: count || 0,
            hasMore: (count || 0) > parseInt(offset) + parseInt(limit)
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        return errorResponse(res, 'Failed to fetch transactions');
    }
});

// Use a redemption code/reward
router.post('/use-reward', supabaseAuth, async (req, res) => {
    try {
        const { code, booking_id } = req.body;
        const customerId = req.user.customerId || req.user.id;

        if (!code) {
            return errorResponse(res, 'Redemption code is required', 400);
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
            return errorResponse(res, 'Invalid or expired redemption code', 404);
        }

        // Check if expired
        if (new Date(redemption.expires_at) < new Date()) {
            await supabaseAdmin
                .from('redeemed_rewards')
                .update({ status: 'expired' })
                .eq('id', redemption.id);

            return errorResponse(res, 'Redemption code has expired', 400);
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

        return successResponse(res, redemption.reward, 'Reward applied successfully');
    } catch (error) {
        console.error('Use reward error:', error);
        return errorResponse(res, 'Failed to use reward');
    }
});

// Add points (admin only)
router.post('/add-points', supabaseAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return errorResponse(res, 'Admin access required', 403);
        }

        const { customer_id, points, reason, reference_type, reference_id } = req.body;

        if (!customer_id || !points) {
            return errorResponse(res, 'customer_id and points are required', 400);
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

        return successResponse(res, {
            newBalance: newPoints,
            lifetimePoints: newLifetime
        }, 'Points added successfully');
    } catch (error) {
        console.error('Add points error:', error);
        return errorResponse(res, 'Failed to add points');
    }
});

export default router;

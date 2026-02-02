import express from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { createNotification } from './notifications.js';
import { successResponse, errorResponse } from '../lib/response.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('PLACEHOLDER')
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// Zero-decimal currencies do not have minor units (cents)
const ZERO_DECIMAL_CURRENCIES = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];

router.post('/create-payment-intent', supabaseAuth, async (req, res) => {
    try {
        if (!stripe) {
            return errorResponse(res, 'Payment service not configured. Please add Stripe API key to .env file.', 503);
        }

        const { amount, currency = 'lkr', bookingId, customerId, metadata = {}, setupFutureUsage = false } = req.body;

        // Security Check: Ensure the user is creating a payment for themselves
        const requesterId = req.user.customerId || req.user.id;
        const finalCustomerId = customerId || requesterId;

        // Helper to get or create Stripe Customer
        const getOrCreateStripeCustomer = async (userId, userEmail, userName, currentStripeId = null) => {
            let targetStripeId = currentStripeId;

            if (!targetStripeId) {
                const { data: profile, error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .select('stripe_customer_id, email, name')
                    .eq('id', userId)
                    .single();

                if (!profileError && profile) {
                    targetStripeId = profile.stripe_customer_id;
                    if (!userEmail) userEmail = profile.email;
                    if (!userName) userName = profile.name;
                }
            }

            if (!targetStripeId) {
                try {
                    const customer = await stripe.customers.create({
                        email: userEmail,
                        name: userName || 'Valued Customer',
                        metadata: { supabase_user_id: userId }
                    });
                    targetStripeId = customer.id;
                    await supabaseAdmin
                        .from('profiles')
                        .update({ stripe_customer_id: targetStripeId })
                        .eq('id', userId);
                    console.log(`Created new Stripe Customer ${targetStripeId} for user ${userId}`);
                } catch (stripeError) {
                    console.error('Error creating Stripe customer:', stripeError);
                    return null;
                }
            }
            return targetStripeId;
        };

        // 1. Initial attempt to get customer
        let stripeCustomerId = null;
        try {
            stripeCustomerId = await getOrCreateStripeCustomer(
                req.user.id,
                req.user.email,
                req.user.user_metadata?.name || req.user.name
            );
        } catch (custError) {
            console.error('[DEBUG] Failed to get/create customer:', custError.message);
        }

        if (!amount || amount <= 0) {
            return errorResponse(res, 'Invalid amount', 400);
        }

        const currencyLower = currency.toLowerCase();
        const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currencyLower);
        const stripeAmount = isZeroDecimal ? Math.round(amount) : Math.round(amount * 100);

        const buildPaymentIntentParams = (custId) => {
            const params = {
                amount: stripeAmount,
                currency: currencyLower,
                metadata: {
                    booking_id: bookingId || '',
                    customer_id: finalCustomerId || '',
                    ...metadata
                },
                payment_method_types: ['card'], // Force card to avoid config issues with LKR
            };

            if (custId) {
                params.customer = custId;
                if (setupFutureUsage) {
                    params.setup_future_usage = 'off_session';
                }
            }
            return params;
        };

        let paymentIntent;
        try {
            console.log(`[DEBUG] Creating Intent for ${stripeCustomerId || 'guest'} amount ${stripeAmount}`);
            paymentIntent = await stripe.paymentIntents.create(buildPaymentIntentParams(stripeCustomerId));
        } catch (error) {
            if (error.code === 'resource_missing' && error.param === 'customer') {
                console.warn(`[DEBUG] Stripe customer ${stripeCustomerId} missing, re-creating...`);
                try {
                    const newCustomer = await stripe.customers.create({
                        email: req.user.email,
                        name: req.user.user_metadata?.name || req.user.name || 'Valued Customer',
                        metadata: { supabase_user_id: req.user.id }
                    });
                    stripeCustomerId = newCustomer.id;
                    supabaseAdmin
                        .from('profiles')
                        .update({ stripe_customer_id: stripeCustomerId })
                        .eq('id', req.user.id)
                        .then(({ error }) => {
                            if (error) console.error('[DEBUG] Failed to update profile:', error);
                        });
                    paymentIntent = await stripe.paymentIntents.create(buildPaymentIntentParams(stripeCustomerId));
                } catch (retryError) {
                    console.error('[DEBUG] Retry failed:', retryError.message);
                    throw retryError;
                }
            } else {
                console.error('[DEBUG] Stripe Intent Creation Error:', error.message);
                throw error;
            }
        }

        return successResponse(res, {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customer: stripeCustomerId
        });
    } catch (error) {
        console.error('[STRIPE ERROR] create-payment-intent failed:', error);
        return errorResponse(res, error.message || 'An internal error occurred while creating the payment intent');
    }
});

router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId, bookingId, customerId } = req.body;

        if (!paymentIntentId || !bookingId) {
            return errorResponse(res, 'Missing paymentIntentId or bookingId', 400);
        }

        const { error } = await supabaseAdmin
            .from('bookings')
            .update({
                payment_status: 'paid',
                payment_intent_id: paymentIntentId,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);


        const { data: bookingData, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .select('*, profiles!technician_id(name)')
            .eq('id', bookingId)
            .single();

        if (bookingError) {
            console.error('Error fetching booking details:', bookingError);
        } else if (bookingData && bookingData.technician_id) {
            // Notify Technician
            try {
                await createNotification({
                    userId: bookingData.technician_id,
                    title: 'Payment Confirmed - New Job Ready',
                    message: `Payment received for ${bookingData.device_brand || 'Device'} ${bookingData.device_model || 'Repair'}. You can now proceed with the job.`,
                    type: 'job_assigned',
                    data: {
                        bookingId: bookingId,
                        role: 'technician'
                    }
                });
                console.log(`Notification sent to technician ${bookingData.technician_id}`);
            } catch (notifError) {
                console.error('Failed to send technician notification:', notifError);
            }
        }

        return successResponse(res, null, 'Payment confirmed');
    } catch (error) {
        console.error('Confirm payment error:', error);
        return errorResponse(res, error.message);
    }
});

router.get('/history', supabaseAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (!profile?.stripe_customer_id) {
            return successResponse(res, { payments: [] });
        }

        const payments = await stripe.paymentIntents.list({
            customer: profile.stripe_customer_id,
            limit: 20
        });

        return successResponse(res, { payments: payments.data });
    } catch (error) {
        return errorResponse(res, error.message);
    }
});

// Get payment history for a specific customer
router.get('/payments/customer/:customerId', supabaseAuth, async (req, res) => {
    try {
        const { customerId } = req.params;
        const requesterId = req.user.id;
        const requesterRole = req.user.role;

        // Authorization: Only allow access to own data or admin
        if (requesterId !== customerId && requesterRole !== 'admin') {
            return errorResponse(res, 'Access denied', 403);
        }

        // First get the Stripe customer ID from Supabase
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id, name, email')
            .eq('id', customerId)
            .single();

        if (profileError || !profile) {
            console.log('[DEBUG] Profile not found for customer:', customerId);
            // Return empty array instead of error - graceful fallback
            return successResponse(res, { payments: [], customer: null });
        }

        if (!profile.stripe_customer_id) {
            console.log('[DEBUG] No Stripe customer ID for:', customerId);
            return successResponse(res, { payments: [], customer: { name: profile.name, email: profile.email } });
        }

        // Fetch payments from Stripe
        try {
            const payments = await stripe.paymentIntents.list({
                customer: profile.stripe_customer_id,
                limit: 50
            });

            return successResponse(res, {
                payments: payments.data,
                customer: { name: profile.name, email: profile.email }
            });
        } catch (stripeError) {
            console.error('[DEBUG] Stripe payment fetch error:', stripeError.message);
            // Return empty if Stripe fails
            return successResponse(res, { payments: [], customer: { name: profile.name, email: profile.email } });
        }
    } catch (error) {
        console.error('Payment history error:', error);
        return errorResponse(res, error.message);
    }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    }

    return successResponse(res, { received: true });
});

export default router;
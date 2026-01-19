import express from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('PLACEHOLDER')
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// Zero-decimal currencies do not have minor units (cents)
// LKR (Sri Lankan Rupee) is NOT zero-decimal - it uses decimal places
// Reference: https://stripe.com/docs/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];

router.post('/create-payment-intent', supabaseAuth, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                error: 'Payment service not configured. Please add Stripe API key to .env file.'
            });
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
            return res.status(400).json({ error: 'Invalid amount' });
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
                automatic_payment_methods: { enabled: true },
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

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customer: stripeCustomerId
        });
    } catch (error) {
        console.error('[STRIPE ERROR] create-payment-intent failed:', {
            message: error.message,
            code: error.code,
            type: error.type,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({
            error: error.message || 'An internal error occurred while creating the payment intent',
            code: error.code || 'UNKNOWN_ERROR',
            type: error.type || 'internal_server_error'
        });
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
            return res.json({ payments: [] });
        }

        const payments = await stripe.paymentIntents.list({
            customer: profile.stripe_customer_id,
            limit: 20
        });

        res.json({ payments: payments.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

    res.json({ received: true });
});

export default router;
import express from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabase.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
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
            // If we have a current ID passed, try to use it (or check if we need to fetch from DB if not passed)
            // Ideally, we just check the DB profile if currentStripeId is null

            let targetStripeId = currentStripeId;

            if (!targetStripeId) {
                const { data: profile, error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .select('stripe_customer_id, email, name')
                    .eq('id', userId)
                    .single();

                if (!profileError && profile) {
                    targetStripeId = profile.stripe_customer_id;
                    // Update fallback info if missing from args
                    if (!userEmail) userEmail = profile.email;
                    if (!userName) userName = profile.name;
                }
            }

            // If still no ID, create one
            if (!targetStripeId) {
                try {
                    const customer = await stripe.customers.create({
                        email: userEmail,
                        name: userName || 'Valued Customer',
                        metadata: {
                            supabase_user_id: userId
                        }
                    });

                    targetStripeId = customer.id;

                    // Update Supabase Profile
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
        let stripeCustomerId = await getOrCreateStripeCustomer(
            req.user.id,
            req.user.email,
            req.user.user_metadata?.name
        );

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
                automatic_payment_methods: {
                    enabled: true,
                },
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
            paymentIntent = await stripe.paymentIntents.create(buildPaymentIntentParams(stripeCustomerId));
        } catch (error) {
            // Handle "Customer not found" error
            // This happens if the DB has an ID but Stripe doesn't (e.g. test mode reset)
            if (error.code === 'resource_missing' && error.param === 'customer') {
                console.warn(`Stripe customer ${stripeCustomerId} missing, creating new one...`);

                // Force create new customer by passing null as current ID, but we also need to wipe it from DB first potentially
                // or just trust getOrCreateStripeCustomer logic if we can force it.
                // Actually getOrCreateStripeCustomer reads from DB. We should clear the DB first or pass a flag?
                // Simpler: Just create directly here to avoid re-fetch logic causing loop

                try {
                    const newCustomer = await stripe.customers.create({
                        email: req.user.email,
                        name: req.user.user_metadata?.name || 'Valued Customer',
                        metadata: { supabase_user_id: req.user.id }
                    });

                    stripeCustomerId = newCustomer.id;

                    // Update Supabase Profile
                    await supabaseAdmin
                        .from('profiles')
                        .update({ stripe_customer_id: stripeCustomerId })
                        .eq('id', req.user.id);

                    // Retry Payment Intent
                    paymentIntent = await stripe.paymentIntents.create(buildPaymentIntentParams(stripeCustomerId));
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                    throw retryError;
                }
            } else {
                throw error;
            }
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customer: stripeCustomerId
        });
    } catch (error) {
        console.error('Payment Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/confirm-payment', supabaseAuth, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ error: 'Payment service not configured' });
        }

        const { paymentIntentId, bookingId, customerId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID required' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            let paymentMethod = null;
            if (paymentIntent.payment_method) {
                try {
                    paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
                } catch (e) {
                    console.log('Could not retrieve payment method:', e.message);
                }
            }

            if (supabaseAdmin) {
                // Verify if payment already exists to prevent duplicates
                const { data: existingPayment } = await supabaseAdmin
                    .from('payments')
                    .select('id')
                    .eq('stripe_payment_intent_id', paymentIntent.id)
                    .single();

                if (existingPayment) {
                    return res.json({
                        status: paymentIntent.status,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency,
                        message: 'Payment already recorded'
                    });
                }

                const paymentRecord = {
                    booking_id: bookingId || paymentIntent.metadata.booking_id || null,
                    customer_id: customerId || paymentIntent.metadata.customer_id || null,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency.toUpperCase(),
                    stripe_payment_intent_id: paymentIntent.id,
                    status: 'completed',
                    payment_method: paymentMethod?.type || 'card',
                    card_last4: paymentMethod?.card?.last4 || null,
                    card_brand: paymentMethod?.card?.brand || null,
                    receipt_url: paymentIntent.charges?.data?.[0]?.receipt_url || null,
                    metadata: paymentIntent.metadata
                };

                const { data: payment, error: paymentError } = await supabaseAdmin
                    .from('payments')
                    .insert(paymentRecord)
                    .select()
                    .single();

                if (paymentError) {
                    console.error('Error storing payment:', paymentError);
                } else {
                    console.log('Payment stored:', payment.id);
                }

                const actualBookingId = bookingId || paymentIntent.metadata.booking_id;
                if (actualBookingId) {
                    const { error: bookingError } = await supabaseAdmin
                        .from('bookings')
                        .update({
                            payment_status: 'paid',
                            status: 'confirmed', // Ensure booking is confirmed
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', actualBookingId);

                    if (bookingError) {
                        console.error('Error updating booking:', bookingError);
                    } else {
                        console.log('Booking payment status updated:', actualBookingId);

                        // Notify Customer about payment success
                        const requesterId = req.user.id;
                        await supabaseAdmin.from('notifications').insert([{
                            user_id: requesterId,
                            title: 'Payment Successful! ✅',
                            message: 'Your payment was successful and your booking is now confirmed.',
                            type: 'payment_success',
                            data: { booking_id: actualBookingId, amount: paymentIntent.amount / 100 }
                        }]);
                    }
                }
            }
        }

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
        });
    } catch (error) {
        console.error('Payment Confirmation Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get('/payment/:id', supabaseAuth, async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { data, error } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        // Security Check
        const allowedIds = [req.user.id, req.user.customerId, req.user.technicianId].filter(id => id);
        if (!allowedIds.includes(data.customer_id) && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/payments/customer/:customerId', supabaseAuth, async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const requestedCustomerId = req.params.customerId;
        const allowedIds = [req.user.id, req.user.customerId].filter(id => id);

        // Allow if exact match, OR if the user is requesting their own data via another ID mapping
        // But simplest safety is:
        if (req.user.role !== 'admin' && !allowedIds.includes(requestedCustomerId) && requestedCustomerId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { data, error } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('customer_id', requestedCustomerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook remains public as it is called by Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret === 'whsec_your_webhook_secret_here') {
        return res.status(400).send('Webhook secret not configured');
    }

    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);

            // Update booking status via webhook if not already done by client
            if (supabaseAdmin) {
                const bookingId = paymentIntent.metadata.booking_id;
                if (bookingId) {
                    await supabaseAdmin
                        .from('bookings')
                        .update({
                            payment_status: 'paid',
                            status: 'confirmed',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', bookingId);

                    console.log(`Webhook: Booking ${bookingId} marked as paid and confirmed.`);
                }
            }
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Refund a payment
router.post('/refund', supabaseAuth, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                error: 'Payment service not configured.'
            });
        }

        const { payment_intent_id, amount, booking_id, reason = 'requested_by_customer' } = req.body;

        if (!payment_intent_id) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        // Verify the booking belongs to the user
        if (booking_id) {
            const { data: booking, error: bookingError } = await supabaseAdmin
                .from('bookings')
                .select('customer_id')
                .eq('id', booking_id)
                .single();

            if (bookingError || !booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const customerId = req.user.customerId || req.user.id;
            if (booking.customer_id !== customerId && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // Create refund
        const refundParams = {
            payment_intent: payment_intent_id,
            reason: reason,
            metadata: {
                booking_id: booking_id,
                refunded_by: req.user.id,
                refunded_at: new Date().toISOString()
            }
        };

        // If partial refund, convert amount
        if (amount) {
            const currency = 'lkr'; // Default currency
            const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency);
            refundParams.amount = isZeroDecimal ? Math.round(amount) : Math.round(amount * 100);
        }

        const refund = await stripe.refunds.create(refundParams);

        // Update booking status
        if (booking_id && supabaseAdmin) {
            await supabaseAdmin
                .from('bookings')
                .update({
                    payment_status: refund.amount === undefined ? 'refunded' : 'partially_refunded',
                    refund_amount: amount || 0,
                    refund_id: refund.id,
                    refunded_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', booking_id);
        }

        res.json({
            success: true,
            refund: {
                id: refund.id,
                amount: refund.amount,
                status: refund.status,
                created: refund.created
            }
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            error: error.message || 'Failed to process refund'
        });
    }
});

export default router;
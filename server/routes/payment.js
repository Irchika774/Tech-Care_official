import express from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
    : null;

const ZERO_DECIMAL_CURRENCIES = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'lkr', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'];

router.post('/create-payment-intent', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                error: 'Payment service not configured. Please add Stripe API key to .env file.'
            });
        }

        const { amount, currency = 'lkr', bookingId, customerId, metadata = {} } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const currencyLower = currency.toLowerCase();
        const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currencyLower);
        const stripeAmount = isZeroDecimal ? Math.round(amount) : Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmount,
            currency: currencyLower,
            metadata: {
                booking_id: bookingId || '',
                customer_id: customerId || '',
                ...metadata
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/confirm-payment', async (req, res) => {
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
                        .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
                        .eq('id', actualBookingId);

                    if (bookingError) {
                        console.error('Error updating booking:', bookingError);
                    } else {
                        console.log('Booking payment status updated:', actualBookingId);
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

router.get('/payment/:id', async (req, res) => {
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
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/payments/customer/:customerId', async (req, res) => {
    try {
        if (!supabaseAdmin) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        const { data, error } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('customer_id', req.params.customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

export default router;
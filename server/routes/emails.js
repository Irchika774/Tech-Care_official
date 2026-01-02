import express from 'express';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { emailService } from '../lib/emailService.js';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

/**
 * Send booking confirmation email
 * POST /api/emails/booking-confirmation
 */
router.post('/booking-confirmation', supabaseAuth, async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ error: 'bookingId is required' });
        }

        // Fetch booking details
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customer_id (email, full_name),
                technician:technician_id (full_name)
            `)
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Send email
        await emailService.sendBookingConfirmation(booking.customer.email, {
            customerName: booking.customer.full_name,
            bookingId: booking.id,
            deviceType: booking.device_type,
            deviceBrand: booking.device_brand,
            deviceModel: booking.device_model,
            serviceType: booking.issue_type || booking.service_type,
            scheduledDate: new Date(booking.scheduled_date).toLocaleDateString(),
            technicianName: booking.technician?.full_name,
            estimatedCost: booking.estimated_cost
        });

        res.json({ success: true, message: 'Booking confirmation email sent' });
    } catch (error) {
        console.error('Send booking confirmation error:', error);
        res.status(500).json({ error: error.message || 'Failed to send email' });
    }
});

/**
 * Send status update email
 * POST /api/emails/status-update
 */
router.post('/status-update', supabaseAuth, async (req, res) => {
    try {
        const { bookingId, newStatus, statusMessage } = req.body;

        if (!bookingId || !newStatus) {
            return res.status(400).json({ error: 'bookingId and newStatus are required' });
        }

        // Fetch booking details
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customer_id (email, full_name)
            `)
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Send email
        await emailService.sendStatusUpdate(booking.customer.email, {
            customerName: booking.customer.full_name,
            bookingId: booking.id,
            newStatus,
            statusMessage
        });

        res.json({ success: true, message: 'Status update email sent' });
    } catch (error) {
        console.error('Send status update error:', error);
        res.status(500).json({ error: error.message || 'Failed to send email' });
    }
});

/**
 * Send payment receipt email
 * POST /api/emails/payment-receipt
 */
router.post('/payment-receipt', supabaseAuth, async (req, res) => {
    try {
        const { bookingId, amount, transactionId, paymentMethod } = req.body;

        if (!bookingId) {
            return res.status(400).json({ error: 'bookingId is required' });
        }

        // Fetch booking details
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                *,
                customer:customer_id (email, full_name)
            `)
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Send email
        await emailService.sendPaymentReceipt(booking.customer.email, {
            customerName: booking.customer.full_name,
            bookingId: booking.id,
            amount: amount || booking.final_cost || booking.estimated_cost,
            transactionId: transactionId || booking.payment_intent_id,
            paymentMethod,
            paidAt: new Date().toLocaleString()
        });

        res.json({ success: true, message: 'Payment receipt email sent' });
    } catch (error) {
        console.error('Send payment receipt error:', error);
        res.status(500).json({ error: error.message || 'Failed to send email' });
    }
});

/**
 * Send welcome email
 * POST /api/emails/welcome
 */
router.post('/welcome', supabaseAuth, async (req, res) => {
    try {
        const { email, userName, userRole } = req.body;

        if (!email || !userName) {
            return res.status(400).json({ error: 'email and userName are required' });
        }

        // Send email
        await emailService.sendWelcome(email, {
            userName,
            userRole: userRole || 'user'
        });

        res.json({ success: true, message: 'Welcome email sent' });
    } catch (error) {
        console.error('Send welcome error:', error);
        res.status(500).json({ error: error.message || 'Failed to send email' });
    }
});

/**
 * Preview email template (development only)
 * GET /api/emails/preview/:template
 */
router.get('/preview/:template', async (req, res) => {
    try {
        // Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ error: 'Not available in production' });
        }

        const { template } = req.params;
        const templates = await import('../lib/emailService.js');

        const templateConfig = templates.EMAIL_TEMPLATES[template];
        if (!templateConfig) {
            return res.status(404).json({ error: `Template '${template}' not found` });
        }

        // Sample data for preview
        const sampleData = {
            bookingConfirmation: {
                customerName: 'John Doe',
                bookingId: 'abc123',
                deviceType: 'Smartphone',
                deviceBrand: 'Apple',
                deviceModel: 'iPhone 14 Pro',
                serviceType: 'Screen Replacement',
                scheduledDate: new Date().toLocaleDateString(),
                technicianName: 'Nimal Perera',
                estimatedCost: 15000
            },
            passwordReset: {
                resetLink: 'https://techcare.lk/reset-password?token=example',
                userName: 'John'
            },
            welcome: {
                userName: 'John Doe',
                userRole: 'user'
            },
            statusUpdate: {
                customerName: 'John Doe',
                bookingId: 'abc123',
                newStatus: 'In Progress',
                statusMessage: 'Your repair is now in progress. Estimated completion: 2 hours.'
            },
            paymentReceipt: {
                customerName: 'John Doe',
                bookingId: 'abc123',
                amount: 12500,
                transactionId: 'pi_abc123xyz',
                paymentMethod: 'Visa ****4242',
                paidAt: new Date().toLocaleString()
            }
        };

        const html = templateConfig.generateHtml(sampleData[template] || {});
        res.type('html').send(html);
    } catch (error) {
        console.error('Preview template error:', error);
        res.status(500).json({ error: error.message || 'Failed to preview template' });
    }
});

/**
 * List available email templates
 * GET /api/emails/templates
 */
router.get('/templates', async (req, res) => {
    const templates = [
        { name: 'bookingConfirmation', description: 'Sent when a booking is confirmed' },
        { name: 'passwordReset', description: 'Sent when user requests password reset' },
        { name: 'welcome', description: 'Sent when new user registers' },
        { name: 'statusUpdate', description: 'Sent when booking status changes' },
        { name: 'paymentReceipt', description: 'Sent after successful payment' }
    ];

    res.json(templates);
});

export default router;

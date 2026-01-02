/**
 * Email Templates and Service for TechCare
 * 
 * This module provides email templates and a service layer for sending emails.
 * In production, integrate with Resend, SendGrid, or similar email provider.
 */

// Email template configurations
const EMAIL_TEMPLATES = {
    // Booking confirmation
    bookingConfirmation: {
        subject: 'Booking Confirmed - TechCare',
        generateHtml: ({ customerName, bookingId, deviceType, deviceBrand, deviceModel, serviceType, scheduledDate, technicianName, estimatedCost }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #000; padding: 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: white; }
        .logo span { color: #22c55e; }
        .content { padding: 40px; }
        h1 { color: #1a1a1a; margin-bottom: 20px; font-size: 24px; }
        p { color: #666; line-height: 1.6; margin-bottom: 16px; }
        .booking-details { background: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #999; font-size: 14px; }
        .detail-value { color: #1a1a1a; font-weight: 600; }
        .cta-button { display: inline-block; background: #000; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #999; }
        .check-icon { width: 64px; height: 64px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
        </div>
        <div class="content">
            <div class="check-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h1 style="text-align: center;">Booking Confirmed!</h1>
            <p style="text-align: center;">Hi ${customerName || 'there'},<br>Your repair booking has been confirmed. Here are the details:</p>
            
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">#${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Device</span>
                    <span class="detail-value">${deviceBrand} ${deviceModel} (${deviceType})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service</span>
                    <span class="detail-value">${serviceType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Scheduled</span>
                    <span class="detail-value">${scheduledDate}</span>
                </div>
                ${technicianName ? `
                <div class="detail-row">
                    <span class="detail-label">Technician</span>
                    <span class="detail-value">${technicianName}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Estimated Cost</span>
                    <span class="detail-value">LKR ${estimatedCost?.toLocaleString() || 'TBD'}</span>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tracker/${bookingId}" class="cta-button">
                    Track Your Booking
                </a>
            </div>

            <p style="text-align: center; font-size: 14px; color: #999;">
                Need to make changes? <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/support" style="color: #22c55e;">Contact Support</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 TechCare. All rights reserved.</p>
            <p>123 Tech Street, Colombo, Sri Lanka</p>
        </div>
    </div>
</body>
</html>
        `
    },

    // Password reset
    passwordReset: {
        subject: 'Reset Your Password - TechCare',
        generateHtml: ({ resetLink, userName }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #000; padding: 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: white; }
        .logo span { color: #22c55e; }
        .content { padding: 40px; text-align: center; }
        h1 { color: #1a1a1a; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
        .cta-button { display: inline-block; background: #000; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #999; }
        .warning { background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; color: #92400e; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
        </div>
        <div class="content">
            <h1>Reset Your Password</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <a href="${resetLink}" class="cta-button">Reset Password</a>
            
            <div class="warning">
                ⚠️ This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </div>
            
            <p style="font-size: 14px; color: #999;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${resetLink}" style="color: #22c55e; word-break: break-all;">${resetLink}</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2026 TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    },

    // Welcome email
    welcome: {
        subject: 'Welcome to TechCare! 🎉',
        generateHtml: ({ userName, userRole }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); padding: 60px 40px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 20px; }
        .logo span { color: #22c55e; }
        .welcome-text { color: white; font-size: 24px; }
        .content { padding: 40px; }
        h2 { color: #1a1a1a; margin-bottom: 16px; }
        p { color: #666; line-height: 1.6; }
        .features { margin: 32px 0; }
        .feature { display: flex; align-items: flex-start; margin-bottom: 20px; }
        .feature-icon { width: 40px; height: 40px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; }
        .feature-text h3 { margin: 0 0 4px 0; color: #1a1a1a; font-size: 16px; }
        .feature-text p { margin: 0; font-size: 14px; }
        .cta-button { display: inline-block; background: #22c55e; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
            <div class="welcome-text">Welcome, ${userName}! 🎉</div>
        </div>
        <div class="content">
            <p>Thank you for joining TechCare, Sri Lanka's premier device repair platform.</p>
            
            <div class="features">
                ${userRole === 'technician' ? `
                <div class="feature">
                    <div class="feature-icon">💼</div>
                    <div class="feature-text">
                        <h3>Grow Your Business</h3>
                        <p>Connect with customers looking for quality repairs</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div class="feature-text">
                        <h3>Track Your Earnings</h3>
                        <p>Monitor your performance and income in real-time</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">⭐</div>
                    <div class="feature-text">
                        <h3>Build Your Reputation</h3>
                        <p>Collect reviews and grow your customer base</p>
                    </div>
                </div>
                ` : `
                <div class="feature">
                    <div class="feature-icon">🔧</div>
                    <div class="feature-text">
                        <h3>Expert Repairs</h3>
                        <p>Access certified technicians for all your devices</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📍</div>
                    <div class="feature-text">
                        <h3>Track in Real-Time</h3>
                        <p>Monitor your repair status from anywhere</p>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎁</div>
                    <div class="feature-text">
                        <h3>Earn Rewards</h3>
                        <p>Get loyalty points on every booking</p>
                    </div>
                </div>
                `}
            </div>

            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/${userRole === 'technician' ? 'technician-dashboard' : 'services'}" class="cta-button">
                    Get Started
                </a>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    },

    // Booking status update
    statusUpdate: {
        subject: 'Booking Update - TechCare',
        generateHtml: ({ customerName, bookingId, newStatus, statusMessage }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #000; padding: 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: white; }
        .logo span { color: #22c55e; }
        .content { padding: 40px; text-align: center; }
        .status-badge { display: inline-block; padding: 8px 24px; border-radius: 999px; font-weight: 600; font-size: 14px; margin: 16px 0; }
        .status-in_progress { background: #fef3c7; color: #92400e; }
        .status-completed { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .cta-button { display: inline-block; background: #000; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
        </div>
        <div class="content">
            <h1>Booking Status Update</h1>
            <p>Hi ${customerName},</p>
            <p>Your booking <strong>#${bookingId}</strong> has been updated.</p>
            
            <div class="status-badge status-${newStatus?.toLowerCase().replace(' ', '_')}">${newStatus}</div>
            
            <p>${statusMessage || 'Check your dashboard for more details.'}</p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tracker/${bookingId}" class="cta-button">
                View Booking
            </a>
        </div>
        <div class="footer">
            <p>© 2026 TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    },

    // Payment receipt
    paymentReceipt: {
        subject: 'Payment Receipt - TechCare',
        generateHtml: ({ customerName, bookingId, amount, paymentMethod, transactionId, paidAt }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #000; padding: 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: white; }
        .logo span { color: #22c55e; }
        .content { padding: 40px; }
        .amount-display { text-align: center; margin: 40px 0; }
        .amount { font-size: 48px; font-weight: bold; color: #22c55e; }
        .receipt-details { background: #f8f8f8; border-radius: 12px; padding: 24px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .footer { background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
        </div>
        <div class="content">
            <h1 style="text-align: center;">Payment Received ✓</h1>
            <p style="text-align: center;">Hi ${customerName}, thank you for your payment!</p>
            
            <div class="amount-display">
                <div class="amount">LKR ${amount?.toLocaleString()}</div>
                <p style="color: #999;">Payment Successful</p>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span>Booking ID</span>
                    <span>#${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span>Transaction ID</span>
                    <span>${transactionId}</span>
                </div>
                <div class="detail-row">
                    <span>Payment Method</span>
                    <span>${paymentMethod || 'Card'}</span>
                </div>
                <div class="detail-row">
                    <span>Date</span>
                    <span>${paidAt}</span>
                </div>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #999; margin-top: 24px;">
                This is your official payment receipt. Please keep it for your records.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    }
};

/**
 * Email Service
 * 
 * In production, replace the sendEmail function with actual email provider integration.
 * Example providers: Resend, SendGrid, AWS SES, Mailgun
 */
import { Resend } from 'resend';

class EmailService {
    constructor() {
        this.templates = EMAIL_TEMPLATES;
        this.resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY not found. Emails will be logged to console instead of sent.');
        }
    }

    /**
     * Send an email using a template
     * @param {string} template - Template name
     * @param {string} to - Recipient email
     * @param {object} data - Template data
     */
    async sendEmail(template, to, data) {
        try {
            const templateConfig = this.templates[template];
            if (!templateConfig) {
                throw new Error(`Email template '${template}' not found`);
            }

            const html = templateConfig.generateHtml(data);
            const subject = templateConfig.subject;

            // Send via Resend if configured
            if (this.resend) {
                try {
                    const { data: emailData, error } = await this.resend.emails.send({
                        from: 'TechCare <noreply@techcare.lk>', // Verify this domain in Resend
                        to: [to],
                        subject: subject,
                        html: html
                    });

                    if (error) {
                        console.error('Resend API Error:', error);
                        // Fallback to logging if API fails
                        throw error;
                    }

                    return { success: true, id: emailData.id, template, to };
                } catch (apiError) {
                    console.error('Failed to send email via Resend:', apiError.message);
                    // If strictly production, might want to re-throw. 
                    // For now, fall back to console log so dev flow isn't blocked.
                    if (process.env.NODE_ENV === 'production') {
                        throw apiError;
                    }
                }
            }

            // For development or if no API key, log the email
            console.log('📧 Email would be sent (simulated):');
            console.log('  To:', to);
            console.log('  Subject:', subject);
            console.log('  Template:', template);
            // console.log('  Content Preview:', html.substring(0, 100) + '...');

            return { success: true, simulated: true, template, to };
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }

    // Convenience methods for common emails
    async sendBookingConfirmation(to, data) {
        return this.sendEmail('bookingConfirmation', to, data);
    }

    async sendPasswordReset(to, data) {
        return this.sendEmail('passwordReset', to, data);
    }

    async sendWelcome(to, data) {
        return this.sendEmail('welcome', to, data);
    }

    async sendStatusUpdate(to, data) {
        return this.sendEmail('statusUpdate', to, data);
    }

    async sendPaymentReceipt(to, data) {
        return this.sendEmail('paymentReceipt', to, data);
    }
}

// Export singleton instance
export const emailService = new EmailService();
export { EMAIL_TEMPLATES };
export default EmailService;

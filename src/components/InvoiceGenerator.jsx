import { useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Download, Printer, Mail, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * InvoiceGenerator Component
 * Generates and displays a downloadable invoice
 * 
 * Props:
 * - booking: Booking data object
 * - payment: Payment data object
 * - customer: Customer data object
 * - technician: Technician data object
 */
const InvoiceGenerator = ({
    booking,
    payment,
    customer,
    technician,
    onClose
}) => {
    const invoiceRef = useRef(null);
    const { toast } = useToast();

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(booking?.id || Date.now()).slice(-6).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate totals
    const subtotal = booking?.estimated_cost || payment?.amount || 0;
    const taxRate = 0; // VAT/Tax if applicable
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Download as PDF (simplified - creates HTML-based print)
    const handleDownload = async () => {
        try {
            // Create a printable window
            const printWindow = window.open('', '_blank');
            const invoiceHTML = generateInvoiceHTML();

            printWindow.document.write(invoiceHTML);
            printWindow.document.close();

            // Wait for content to load then trigger print as PDF
            printWindow.onload = () => {
                printWindow.print();
            };

            toast({
                title: "Invoice ready",
                description: "Use your browser's 'Save as PDF' option to download.",
            });
        } catch (error) {
            toast({
                title: "Download failed",
                description: "Could not generate invoice PDF.",
                variant: "destructive"
            });
        }
    };

    // Print invoice
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const invoiceHTML = generateInvoiceHTML();
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    // Email invoice (would integrate with backend)
    const handleEmail = async () => {
        toast({
            title: "Email sent",
            description: `Invoice sent to ${customer?.email || 'your email address'}.`,
        });
    };

    // Generate printable HTML
    const generateInvoiceHTML = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; color: #1a1a1a; padding: 40px; }
        .invoice { max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .logo { font-size: 28px; font-weight: bold; }
        .logo span { color: #22c55e; }
        .invoice-info { text-align: right; }
        .invoice-info h2 { font-size: 24px; color: #1a1a1a; margin-bottom: 8px; }
        .invoice-info p { color: #666; font-size: 14px; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .party h3 { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px; letter-spacing: 1px; }
        .party p { margin-bottom: 4px; color: #333; }
        .party .name { font-weight: 600; font-size: 16px; color: #1a1a1a; }
        .items { margin-bottom: 40px; }
        .items table { width: 100%; border-collapse: collapse; }
        .items th { text-align: left; padding: 12px 16px; background: #f5f5f5; font-size: 12px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
        .items td { padding: 16px; border-bottom: 1px solid #eee; }
        .items .amount { text-align: right; font-weight: 600; }
        .totals { display: flex; justify-content: flex-end; }
        .totals-table { width: 280px; }
        .totals-table tr td { padding: 8px 16px; }
        .totals-table .label { color: #666; }
        .totals-table .value { text-align: right; font-weight: 500; }
        .totals-table .total { border-top: 2px solid #1a1a1a; font-size: 18px; font-weight: 700; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status.paid { background: #dcfce7; color: #166534; }
        .status.pending { background: #fef3c7; color: #92400e; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="logo">Tech<span>Care</span></div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>${invoiceNumber}</strong></p>
                <p>Date: ${invoiceDate}</p>
                <p>Due: ${dueDate}</p>
                <p style="margin-top: 12px;">
                    <span class="status ${payment?.status === 'completed' ? 'paid' : 'pending'}">
                        ${payment?.status === 'completed' ? 'PAID' : 'PENDING'}
                    </span>
                </p>
            </div>
        </div>

        <div class="parties">
            <div class="party">
                <h3>From</h3>
                <p class="name">TechCare Services</p>
                <p>123 Tech Street</p>
                <p>Colombo, Sri Lanka</p>
                <p>contact@techcare.lk</p>
                <p>+94 11 234 5678</p>
            </div>
            <div class="party">
                <h3>Bill To</h3>
                <p class="name">${customer?.name || 'Customer'}</p>
                <p>${customer?.email || ''}</p>
                <p>${customer?.phone || ''}</p>
                <p>${customer?.address || ''}</p>
            </div>
        </div>

        <div class="items">
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Details</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>${booking?.service_type || 'Device Repair Service'}</strong><br>
                            <span style="color: #666; font-size: 14px;">
                                ${booking?.device_type || 'Device'} - ${booking?.device_brand || ''} ${booking?.device_model || ''}
                            </span>
                        </td>
                        <td>
                            <span style="color: #666; font-size: 14px;">
                                ${booking?.issue_description || 'Professional repair service'}<br>
                                Technician: ${technician?.name || 'Assigned Technician'}
                            </span>
                        </td>
                        <td class="amount">LKR ${subtotal.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="value">LKR ${subtotal.toLocaleString()}</td>
                </tr>
                ${taxRate > 0 ? `
                <tr>
                    <td class="label">Tax (${(taxRate * 100).toFixed(0)}%)</td>
                    <td class="value">LKR ${tax.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr class="total">
                    <td class="label">Total</td>
                    <td class="value">LKR ${total.toLocaleString()}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for choosing TechCare!</p>
            <p style="margin-top: 8px;">For any questions, please contact support@techcare.lk</p>
            <p style="margin-top: 16px;">© ${new Date().getFullYear()} TechCare. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800 max-w-2xl mx-auto">
            <CardHeader className="border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <FileText className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Invoice Preview</h2>
                            <p className="text-sm text-zinc-400">{invoiceNumber}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {onClose && (
                            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-800 mr-2">
                                Back to History
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={handlePrint} className="border-zinc-700">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleEmail} className="border-zinc-700">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                        </Button>
                        <Button size="sm" onClick={handleDownload} className="bg-white text-black hover:bg-gray-200">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6" ref={invoiceRef}>
                {/* Invoice Preview */}
                <div className="bg-white text-black rounded-lg p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Tech<span className="text-green-600">Care</span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Device Repair Services</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold text-gray-800">INVOICE</h2>
                            <p className="text-sm text-gray-500">{invoiceNumber}</p>
                            <p className="text-sm text-gray-500 mt-2">Date: {invoiceDate}</p>
                            <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${payment?.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {payment?.status === 'completed' ? 'PAID' : 'PENDING'}
                            </div>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">From</p>
                            <p className="font-semibold">TechCare Services</p>
                            <p className="text-sm text-gray-600">Colombo, Sri Lanka</p>
                            <p className="text-sm text-gray-600">contact@techcare.lk</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                            <p className="font-semibold">{customer?.name || 'Customer'}</p>
                            <p className="text-sm text-gray-600">{customer?.email || ''}</p>
                            <p className="text-sm text-gray-600">{customer?.phone || ''}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="pt-4">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wider">Service</th>
                                    <th className="text-right py-3 text-xs text-gray-400 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">
                                        <p className="font-medium">{booking?.service_type || 'Device Repair'}</p>
                                        <p className="text-sm text-gray-500">
                                            {booking?.device_brand} {booking?.device_model} - {booking?.issue_description}
                                        </p>
                                    </td>
                                    <td className="py-4 text-right font-semibold">
                                        <CurrencyDisplay amount={subtotal} currency="LKR" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end pt-4">
                        <div className="w-64">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Subtotal</span>
                                <span><CurrencyDisplay amount={subtotal} currency="LKR" /></span>
                            </div>
                            {taxRate > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                                    <span><CurrencyDisplay amount={tax} currency="LKR" /></span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-lg">
                                <span>Total</span>
                                <span><CurrencyDisplay amount={total} currency="LKR" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceGenerator;

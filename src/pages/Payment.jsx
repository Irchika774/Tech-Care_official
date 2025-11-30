import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import SEO from '../components/SEO';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('pay'); // 'pay' or 'history'

    // Form states
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    useEffect(() => {
        if (!user) {
            // Wait for auth or redirect
            // navigate('/login'); // Optional: redirect if strictly required
            return;
        }

        // Get booking details from navigation state or load from API
        if (location.state?.booking) {
            setBookingDetails(location.state.booking);
        } else {
            // Load mock booking for demonstration
            setBookingDetails({
                _id: 'BK001',
                serviceType: 'Mobile Repair',
                device: { brand: 'iPhone', model: '13 Pro' },
                technician: { name: 'John Smith', rating: 4.8 },
                amount: 15000,
                serviceFee: 1500,
                total: 16500
            });
        }

        fetchSavedCards();
        fetchPaymentHistory();
    }, [location, user, navigate]);

    const fetchSavedCards = async () => {
        try {
            // TODO: Replace with actual API call
            setSavedCards([
                {
                    id: 'card_1',
                    last4: '4242',
                    brand: 'Visa',
                    expiryMonth: 12,
                    expiryYear: 2025,
                    isDefault: true
                }
            ]);
        } catch (error) {
            console.error('Error fetching saved cards:', error);
        }
    };

    const fetchPaymentHistory = async () => {
        try {
            // TODO: Replace with actual API call
            setPaymentHistory([
                {
                    id: 'pay_1',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    amount: 12000,
                    status: 'completed',
                    booking: { id: 'BK890', service: 'Screen Replacement' },
                    method: 'Visa •••• 4242'
                },
                {
                    id: 'pay_2',
                    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    amount: 8500,
                    status: 'completed',
                    booking: { id: 'BK775', service: 'Battery Replacement' },
                    method: 'Mastercard •••• 1234'
                }
            ]);
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Integrate with Stripe API
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // TODO: Call actual payment API
            // const response = await fetch('/api/payment/process', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         bookingId: bookingDetails._id,
            //         amount: bookingDetails.total,
            //         paymentMethod,
            //         cardDetails: { cardNumber, cardName, expiryDate, cvv }
            //     })
            // });

            alert('Payment processed successfully!');
            navigate('/customer-dashboard');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (!bookingDetails) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-gray-600 dark:text-gray-300">Loading payment details...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <SEO
                title="Secure Payment - TechCare"
                description="Complete your payment securely for TechCare services. We support credit cards, bank transfers, and mobile wallets."
            />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                    Payment Center
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Secure payment processing for your services
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('pay')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'pay'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                        }`}
                >
                    Make Payment
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'history'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                        }`}
                >
                    Payment History
                </button>
            </div>

            {/* Make Payment Tab */}
            {activeTab === 'pay' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        #{bookingDetails._id}
                                    </p>
                                </div>

                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        {bookingDetails.serviceType}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {bookingDetails.device.brand} {bookingDetails.device.model}
                                    </p>
                                </div>

                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Technician</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        {bookingDetails.technician.name}
                                    </p>
                                    <p className="text-sm text-yellow-600">
                                        ⭐ {bookingDetails.technician.rating}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
                                    <span className="font-semibold text-text-light dark:text-text-dark">
                                        <CurrencyDisplay amount={bookingDetails.amount} decimals={0} />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                                    <span className="font-semibold text-text-light dark:text-text-dark">
                                        <CurrencyDisplay amount={bookingDetails.serviceFee} decimals={0} />
                                    </span>
                                </div>
                                <div className="pt-2 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between">
                                    <span className="text-lg font-bold text-text-light dark:text-text-dark">Total</span>
                                    <span className="text-lg font-bold text-primary">
                                        <CurrencyDisplay amount={bookingDetails.total} decimals={0} />
                                    </span>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900 rounded p-3 text-sm">
                                <p className="text-blue-800 dark:text-blue-200">
                                    🔒 Secure payment powered by Stripe
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                                Payment Method
                            </h2>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card'
                                        ? 'border-primary bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">💳</div>
                                        <p className="text-sm font-medium">Card</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'bank'
                                        ? 'border-primary bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🏦</div>
                                        <p className="text-sm font-medium">Bank</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('wallet')}
                                    className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'wallet'
                                        ? 'border-primary bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">📱</div>
                                        <p className="text-sm font-medium">Wallet</p>
                                    </div>
                                </button>
                            </div>

                            {/* Saved Cards */}
                            {paymentMethod === 'card' && savedCards.length > 0 && !showAddCard && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-text-light dark:text-text-dark mb-3">
                                        Saved Cards
                                    </h3>
                                    <div className="space-y-3">
                                        {savedCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl">💳</div>
                                                    <div>
                                                        <p className="font-medium text-text-light dark:text-text-dark">
                                                            {card.brand} •••• {card.last4}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Expires {card.expiryMonth}/{card.expiryYear}
                                                        </p>
                                                    </div>
                                                </div>
                                                {card.isDefault && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCard(true)}
                                        className="mt-3 text-primary hover:text-primary-dark font-medium"
                                    >
                                        + Add New Card
                                    </button>
                                </div>
                            )}

                            {/* Card Payment Form */}
                            {paymentMethod === 'card' && (showAddCard || savedCards.length === 0) && (
                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            maxLength="19"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                            Cardholder Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                                placeholder="123"
                                                maxLength="4"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="saveCard"
                                            checked={saveCard}
                                            onChange={(e) => setSaveCard(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="saveCard" className="text-sm text-gray-700 dark:text-gray-300">
                                            Save this card for future payments
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : (
                                            <span className="flex items-center justify-center gap-1">
                                                Pay <CurrencyDisplay amount={bookingDetails.total} decimals={0} />
                                            </span>
                                        )}
                                    </button>

                                    {showAddCard && savedCards.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddCard(false)}
                                            className="w-full text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </form>
                            )}

                            {/* Bank Transfer Info */}
                            {paymentMethod === 'bank' && (
                                <div className="space-y-4">
                                    <div className="bg-yellow-50 dark:bg-yellow-900 rounded p-4">
                                        <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                                            Please transfer the amount to the following bank account:
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Bank:</strong> Commercial Bank of Ceylon</p>
                                            <p><strong>Account Name:</strong> TechCare Services Pvt Ltd</p>
                                            <p><strong>Account Number:</strong> 1234567890</p>
                                            <p><strong>Branch:</strong> Colombo Fort</p>
                                            <p><strong>Amount:</strong> <CurrencyDisplay amount={bookingDetails.total} decimals={2} /></p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        After making the transfer, please send the receipt to support@techcare.com with your booking ID.
                                    </p>
                                </div>
                            )}

                            {/* Mobile Wallet */}
                            {paymentMethod === 'wallet' && (
                                <div className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Select your mobile wallet:
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <p className="font-medium">eZ Cash</p>
                                            </div>
                                        </button>
                                        <button className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <p className="font-medium">mCash</p>
                                            </div>
                                        </button>
                                        <button className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <p className="font-medium">FriMi</p>
                                            </div>
                                        </button>
                                        <button className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <p className="font-medium">Genie</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                        Transaction History
                    </h2>

                    {paymentHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                                No Payment History
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Your payment transactions will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paymentHistory.map((payment) => (
                                <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-text-light dark:text-text-dark">
                                                {payment.booking.service}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Booking ID: #{payment.booking.id}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {payment.date.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">
                                                <CurrencyDisplay amount={payment.amount} decimals={0} />
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Paid via {payment.method}
                                        </p>
                                        <button className="text-sm text-primary hover:text-primary-dark">
                                            Download Receipt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Payment;



import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';
import SEO from '../components/SEO';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingDetails, clientSecret, paymentIntentId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !isReady) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message);
                setLoading(false);
                return;
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
                redirect: 'if_required'
            });

            if (confirmError) {
                setError(confirmError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await fetch(`${apiUrl}/api/payment/confirm-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        bookingId: bookingDetails._id || bookingDetails.id,
                        customerId: bookingDetails.customerId
                    })
                });
                onSuccess(paymentIntent);
            }
        } catch (err) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <PaymentElement 
                    onReady={() => setIsReady(true)}
                    options={{
                        layout: 'tabs'
                    }}
                />
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || loading || !isReady}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                    </>
                ) : !isReady ? (
                    'Loading payment form...'
                ) : (
                    <>
                        Pay <CurrencyDisplay amount={bookingDetails.total} decimals={0} />
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by Stripe
            </div>
        </form>
    );
};

const PaymentSuccessModal = ({ payment, booking, onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your payment of <CurrencyDisplay amount={booking.total} decimals={0} /> has been processed successfully.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Service</span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Booking ID</span>
                        <span className="font-medium text-gray-900 dark:text-white">#{booking._id || booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                        <span className="font-mono text-xs text-gray-900 dark:text-white">{payment.id.slice(0, 20)}...</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/customer-dashboard')}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('pay');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        const initializePayment = async () => {
            const mockBooking = {
                _id: 'BK001',
                serviceType: 'Mobile Repair',
                device: { brand: 'iPhone', model: '13 Pro' },
                technician: { name: 'John Smith', rating: 4.8 },
                amount: 15000,
                serviceFee: 1500,
                total: 16500,
                customerId: user?.id || null
            };

            const booking = location.state?.booking || mockBooking;
            setBookingDetails(booking);

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/payment/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: booking.total,
                        currency: 'lkr',
                        bookingId: booking._id || booking.id,
                        customerId: booking.customerId || user?.id,
                        metadata: {
                            service: booking.serviceType,
                            device: `${booking.device?.brand} ${booking.device?.model}`
                        }
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to initialize payment');
                }

                setClientSecret(data.clientSecret);
                setPaymentIntentId(data.paymentIntentId);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializePayment();
    }, [location, user]);

    useEffect(() => {
        if (activeTab === 'history' && user?.id) {
            fetchPaymentHistory();
        }
    }, [activeTab, user]);

    const fetchPaymentHistory = async () => {
        if (!user?.id) {
            setPaymentHistory([
                {
                    id: 'pay_demo_1',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    amount: 12000,
                    status: 'completed',
                    card_brand: 'Visa',
                    card_last4: '4242'
                }
            ]);
            return;
        }

        setHistoryLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/payment/payments/customer/${user.id}`);
            const data = await response.json();
            setPaymentHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching payment history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentIntent) => {
        setPaymentSuccess(paymentIntent);
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Initializing secure payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <SEO
                title="Secure Payment - TechCare"
                description="Complete your payment securely for TechCare services."
            />

            {paymentSuccess && (
                <PaymentSuccessModal 
                    payment={paymentSuccess} 
                    booking={bookingDetails} 
                    onClose={() => setPaymentSuccess(null)} 
                />
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                    Payment Center
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Secure payment processing for your services
                </p>
            </div>

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

            {activeTab === 'pay' && bookingDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        #{bookingDetails._id || bookingDetails.id}
                                    </p>
                                </div>

                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Service</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        {bookingDetails.serviceType}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {bookingDetails.device?.brand} {bookingDetails.device?.model}
                                    </p>
                                </div>

                                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Technician</p>
                                    <p className="font-semibold text-text-light dark:text-text-dark">
                                        {bookingDetails.technician?.name}
                                    </p>
                                    {bookingDetails.technician?.rating && (
                                        <p className="text-sm text-yellow-600">
                                            ⭐ {bookingDetails.technician.rating}
                                        </p>
                                    )}
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

                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                                <p className="text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure payment powered by Stripe
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                                Payment Details
                            </h2>

                            {clientSecret ? (
                                <Elements 
                                    stripe={stripePromise} 
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'stripe',
                                            variables: {
                                                colorPrimary: '#3b82f6',
                                                colorBackground: '#f9fafb',
                                                colorText: '#1f2937',
                                                borderRadius: '8px'
                                            }
                                        }
                                    }}
                                >
                                    <CheckoutForm 
                                        bookingDetails={bookingDetails}
                                        clientSecret={clientSecret}
                                        paymentIntentId={paymentIntentId}
                                        onSuccess={handlePaymentSuccess}
                                    />
                                </Elements>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300">Loading payment form...</p>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    By completing this payment, you agree to our Terms of Service and Privacy Policy.
                                    Your card details are securely processed by Stripe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                        Transaction History
                    </h2>

                    {historyLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-300">Loading history...</p>
                        </div>
                    ) : paymentHistory.length === 0 ? (
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
                                                Payment #{payment.id?.slice(-8)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(payment.created_at).toLocaleDateString()}
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
                                    {payment.card_brand && (
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {payment.card_brand} •••• {payment.card_last4}
                                            </p>
                                            {payment.receipt_url && (
                                                <a 
                                                    href={payment.receipt_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:text-primary-dark"
                                                >
                                                    View Receipt
                                                </a>
                                            )}
                                        </div>
                                    )}
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

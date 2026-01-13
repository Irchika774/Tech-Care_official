import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const [paymentStatus, setPaymentStatus] = useState('verifying');
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const paymentIntentId = searchParams.get('payment_intent');
            const redirectStatus = searchParams.get('redirect_status');

            if (redirectStatus === 'succeeded' && paymentIntentId) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const response = await fetch(`${apiUrl}/api/payment/confirm-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentIntentId })
                    });

                    const data = await response.json();
                    if (data.status === 'succeeded') {
                        setPaymentStatus('success');
                        setPaymentDetails(data);
                    } else {
                        setPaymentStatus('pending');
                    }
                } catch (err) {
                    console.error('Error verifying payment:', err);
                    setPaymentStatus('success');
                }
            } else if (redirectStatus === 'failed') {
                setPaymentStatus('failed');
            } else {
                setPaymentStatus('success');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <SEO title="Payment Complete - TechCare" />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                {paymentStatus === 'verifying' && (
                    <>
                        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment</h2>
                        <p className="text-gray-600 dark:text-gray-300">Please wait...</p>
                    </>
                )}

                {paymentStatus === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Your payment has been processed successfully.
                        </p>
                        {paymentDetails && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {paymentDetails.currency?.toUpperCase()} {Math.abs(paymentDetails.amount || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                    <span className="font-medium text-green-600">Completed</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/customer-dashboard')}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}

                {paymentStatus === 'pending' && (
                    <>
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Processing</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Your payment is being processed. You'll receive a confirmation shortly.
                        </p>
                        <button
                            onClick={() => navigate('/customer-dashboard')}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}

                {paymentStatus === 'failed' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Your payment could not be processed. Please try again.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/payment')}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                            >
                                Return Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;

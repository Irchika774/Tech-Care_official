import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [expires, setExpires] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Payment processed successfully!');
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-background-light dark:bg-card-dark rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Payment Information
          </h1>
          <p className="text-subtext-light dark:text-subtext-dark mt-2">
            Choose your preferred payment method and complete your secure booking.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div 
            onClick={() => setPaymentMethod('credit-card')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === 'credit-card' 
                ? 'border-primary bg-slate-50 dark:bg-slate-700' 
                : 'border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary'
            }`}
          >
            <span className={`material-icons ${paymentMethod === 'credit-card' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              credit_card
            </span>
            <span className={`mt-2 text-sm font-medium ${paymentMethod === 'credit-card' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              Credit Card
            </span>
          </div>

          <div 
            onClick={() => setPaymentMethod('paypal')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === 'paypal' 
                ? 'border-primary bg-slate-50 dark:bg-slate-700' 
                : 'border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary'
            }`}
          >
            <span className={`material-icons ${paymentMethod === 'paypal' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              account_balance_wallet
            </span>
            <span className={`mt-2 text-sm font-medium ${paymentMethod === 'paypal' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              PayPal
            </span>
          </div>

          <div 
            onClick={() => setPaymentMethod('google-pay')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === 'google-pay' 
                ? 'border-primary bg-slate-50 dark:bg-slate-700' 
                : 'border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary'
            }`}
          >
            <svg className={`h-6 w-6 ${paymentMethod === 'google-pay' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C14.04,4.73 15.3,5.5 15.9,6.03L18.03,3.95C16.33,2.44 14.37,1.7 12.19,1.7C7.03,1.7 3,6.17 3,12C3,17.83 7.03,22.3 12.19,22.3C17.7,22.3 21.7,18.35 21.7,12.33C21.7,11.77 21.5,11.43 21.35,11.1Z" />
            </svg>
            <span className={`mt-2 text-sm font-medium ${paymentMethod === 'google-pay' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              Google Pay
            </span>
          </div>

          <div 
            onClick={() => setPaymentMethod('apple-pay')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
              paymentMethod === 'apple-pay' 
                ? 'border-primary bg-slate-50 dark:bg-slate-700' 
                : 'border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary'
            }`}
          >
            <svg className={`h-6 w-6 ${paymentMethod === 'apple-pay' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className={`mt-2 text-sm font-medium ${paymentMethod === 'apple-pay' ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              Apple Pay
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1" htmlFor="card-number">
              Card Number
            </label>
            <input 
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md bg-transparent text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              id="card-number" 
              placeholder="•••• •••• •••• 1234" 
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1" htmlFor="expires">
                Expires
              </label>
              <input 
                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md bg-transparent text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                id="expires" 
                placeholder="MM/YY" 
                type="text"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1" htmlFor="cvv">
                CVV
              </label>
              <input 
                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md bg-transparent text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                id="cvv" 
                placeholder="•••" 
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1" htmlFor="name-on-card">
              Name on Card
            </label>
            <input 
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md bg-transparent text-text-light dark:text-text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              id="name-on-card" 
              placeholder="John Doe" 
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 flex items-center justify-center"
          >
            <span className="material-icons mr-2">lock</span>
            Complete Payment
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-subtext-light dark:text-subtext-dark flex items-center justify-center">
            <span className="material-icons text-green-500 mr-2">verified_user</span>
            Payments secured by SSL encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

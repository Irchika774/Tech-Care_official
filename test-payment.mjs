const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        amount: 16500,
        currency: 'lkr',
        bookingId: 'test-booking-123'
    })
});

const data = await response.json();
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));

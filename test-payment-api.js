const http = require('http');

const data = JSON.stringify({
    amount: 5000,
    currency: 'lkr'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/payment/create-payment-intent',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);
    });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();

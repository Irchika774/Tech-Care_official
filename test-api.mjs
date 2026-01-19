const r = await fetch('https://server-seven-ecru.vercel.app/api/bookings', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://techcare-official-new.netlify.app'
    },
    body: JSON.stringify({ test: true })
});
console.log('Status:', r.status);
console.log('Body:', await r.text());

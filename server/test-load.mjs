import('./index.js').then(() => console.log('OK')).catch(e => console.error('Error:', e.message, e.stack));

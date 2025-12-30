const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalEnvVars = [
    { key: 'STRIPE_SECRET_KEY', warning: 'Payment processing will be disabled' },
    { key: 'STRIPE_WEBHOOK_SECRET', warning: 'Stripe webhooks will not work' },
    { key: 'GOOGLE_MAPS_API_KEY', warning: 'Maps features may not work' }
];

export function validateEnv() {
    const missing = [];
    const warnings = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    for (const { key, warning } of optionalEnvVars) {
        if (!process.env[key] || process.env[key].includes('your_') || process.env[key].includes('_here')) {
            warnings.push({ key, warning });
        }
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        console.error('\nPlease configure these in your .env file');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Optional environment variables not configured:');
        warnings.forEach(({ key, warning }) => {
            console.warn(`   - ${key}: ${warning}`);
        });
    }

    console.log('✅ Environment validation passed');
}

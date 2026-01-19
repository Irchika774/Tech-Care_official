
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const vars = [
    'STRIPE_SECRET_KEY',
    'DATABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'JWT_SECRET',
    'NODE_ENV'
];

console.log('--- Setting VERCEL Backend Env ---');
for (const v of vars) {
    const val = process.env[v];
    if (val) {
        try {
            console.log(`Setting ${v}...`);
            // Piping value to avoid interactive prompt
            execSync(`echo "${val}" | vercel env add ${v} production --force`, { stdio: 'inherit' });
        } catch (e) {
            console.error(`Failed to set ${v}: ${e.message}`);
        }
    }
}

const netlifyVars = [
    'VITE_API_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_SITE_URL'
];

// Set VITE_API_URL specifically for production
process.env.VITE_API_URL = 'https://server-seven-ecru.vercel.app';
process.env.VITE_SITE_URL = 'https://techcare-official-new.netlify.app';

console.log('\n--- Setting NETLIFY Frontend Env ---');
for (const v of netlifyVars) {
    const val = process.env[v];
    if (val) {
        try {
            console.log(`Setting ${v}...`);
            // Standardizing on 'all' scope for netlify
            execSync(`netlify env:set ${v} "${val}" --force`, { stdio: 'inherit' });
        } catch (e) {
            console.error(`Failed to set ${v}: ${e.message}`);
        }
    }
}

console.log('\n✅ Env sync script finished.');

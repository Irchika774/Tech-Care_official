
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
    console.error('DATABASE_URL is missing from .env');
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase transaction pooler usually, or session pooler
});

async function runMigration() {
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/006_payment_setup.sql');
    console.log(`Reading migration file from: ${migrationPath}`);

    try {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        console.log('Connecting to database...');
        const client = await pool.connect();
        try {
            console.log('Running migration...');
            await client.query(sql);
            console.log('✅ Migration applied successfully!');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();

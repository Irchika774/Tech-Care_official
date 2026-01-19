
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkProfiles() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'");
        console.log('Columns in profiles:');
        console.log(res.rows.map(r => r.column_name).join(', '));
    } finally {
        client.release();
        await pool.end();
    }
}

checkProfiles();


import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function addTotalBookingsColumn() {
    try {
        console.log('Adding total_bookings column to customers table...');

        // Add the column if it doesn't exist
        await pool.query(`
            ALTER TABLE customers 
            ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
        `);
        console.log('✅ total_bookings column added (or already existed).');

        // Optional: Backfill data (calculate total bookings for each customer)
        console.log('Backfilling total_bookings...');
        await pool.query(`
            UPDATE customers c
            SET total_bookings = (
                SELECT COUNT(*) FROM bookings b 
                WHERE b.customer_id = c.id
            );
        `);
        console.log('✅ total_bookings backfilled.');

    } catch (err) {
        console.error('Error adding column:', err);
    } finally {
        await pool.end();
    }
}

addTotalBookingsColumn();

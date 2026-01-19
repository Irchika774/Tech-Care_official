
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
    console.error('DATABASE_URL is missing from .env');
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applyFix() {
    console.log('Connecting to database...');
    const client = await pool.connect();
    try {
        console.log('Updating RLS policies for loyalty system...');

        const sql = `
            -- Drop existing policies if they exist (PostgreSQL 10+)
            DROP POLICY IF EXISTS "Users can view own loyalty account" ON loyalty_accounts;
            DROP POLICY IF EXISTS "Users can view own transactions" ON loyalty_transactions;
            DROP POLICY IF EXISTS "Users can view own redeemed rewards" ON redeemed_rewards;

            -- Create corrected policies
            CREATE POLICY "Users can view own loyalty account" ON loyalty_accounts
                FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

            CREATE POLICY "Users can view own transactions" ON loyalty_transactions
                FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

            CREATE POLICY "Users can view own redeemed rewards" ON redeemed_rewards
                FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
            
            -- Ensure RLS is enabled
            ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
            ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
            ALTER TABLE redeemed_rewards ENABLE ROW LEVEL SECURITY;

            -- Grant permissions (just in case)
            GRANT ALL ON loyalty_accounts TO authenticated;
            GRANT ALL ON loyalty_transactions TO authenticated;
            GRANT ALL ON redeemed_rewards TO authenticated;
        `;

        await client.query(sql);
        console.log('✅ RLS Policies updated successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

applyFix();

const { Client } = require('pg');
require('dotenv').config();

async function addConstraint() {
    console.log('Adding unique constraint to technicians table...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sql = `
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'unique_technician_user_id'
                ) THEN
                    ALTER TABLE technicians
                    ADD CONSTRAINT unique_technician_user_id UNIQUE (user_id);
                END IF;
            END $$;
        `;

        await client.query(sql);
        console.log('Unique constraint added successfully.');
    } catch (err) {
        console.error('Error adding constraint:', err);
    } finally {
        await client.end();
    }
}

addConstraint();

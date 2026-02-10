-- Add missing schedule columns to bookings table
-- These columns are required for the appointment confirmation flow

DO $$
BEGIN
    -- Add scheduled_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'scheduled_date') THEN
        ALTER TABLE bookings ADD COLUMN scheduled_date TIMESTAMP WITH TIME ZONE;
        CREATE INDEX IF NOT EXISTS bookings_scheduled_date_idx ON bookings(scheduled_date);
        RAISE NOTICE 'Added scheduled_date column to bookings';
    END IF;

    -- Add time_slot column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'time_slot') THEN
        ALTER TABLE bookings ADD COLUMN time_slot TEXT;
        RAISE NOTICE 'Added time_slot column to bookings';
    END IF;

    -- Add payment_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
        ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'pending';
        RAISE NOTICE 'Added payment_status column to bookings';
    END IF;

    -- Add payment_intent_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_intent_id') THEN
        ALTER TABLE bookings ADD COLUMN payment_intent_id TEXT;
        RAISE NOTICE 'Added payment_intent_id column to bookings';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'updated_at') THEN
        ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
        RAISE NOTICE 'Added updated_at column to bookings';
    END IF;
END $$;

-- Ensure RLS allows customers to update their own bookings
DO $$
BEGIN
    -- Drop existing update policies if any
    DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
    
    -- Create update policy for customers
    CREATE POLICY "Customers can update their own bookings"
        ON bookings FOR UPDATE
        USING (
            customer_id IN (
                SELECT id FROM customers WHERE user_id = auth.uid()
            )
        )
        WITH CHECK (
            customer_id IN (
                SELECT id FROM customers WHERE user_id = auth.uid()
            )
        );
    
    RAISE NOTICE 'Created RLS update policy for bookings';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Policy creation note: %', SQLERRM;
END $$;

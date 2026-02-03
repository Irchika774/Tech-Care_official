-- Add stripe_customer_id to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
        CREATE INDEX profiles_stripe_customer_id_idx ON profiles (stripe_customer_id);
    END IF;
END $$;

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES profiles(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'lkr',
    status TEXT NOT NULL, -- pending, completed, failed, refunded
    stripe_payment_intent_id TEXT UNIQUE,
    payment_method TEXT,
    card_brand TEXT,
    card_last4 TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments" 
    ON payments FOR SELECT 
    USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" 
    ON payments FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON payments(customer_id);

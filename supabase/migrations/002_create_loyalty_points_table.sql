-- Migration: Create Loyalty Points System Tables
-- Date: 2026-01-02
-- Description: Creates tables for loyalty points, tiers, rewards, and transactions

-- Loyalty tiers configuration table
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    min_points INTEGER NOT NULL,
    max_points INTEGER,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    benefits JSONB DEFAULT '[]',
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO loyalty_tiers (name, min_points, max_points, multiplier, benefits, icon, color) VALUES
('bronze', 0, 499, 1.0, '["1 point per LKR 100 spent", "Basic rewards access"]', 'Award', 'amber'),
('silver', 500, 1499, 1.25, '["1.25x points multiplier", "Priority support", "Exclusive discounts"]', 'Star', 'gray'),
('gold', 1500, 4999, 1.5, '["1.5x points multiplier", "Free diagnostics", "Birthday bonus"]', 'Crown', 'yellow'),
('platinum', 5000, NULL, 2.0, '["2x points multiplier", "VIP support", "Free pickup/delivery", "Exclusive events"]', 'Sparkles', 'purple')
ON CONFLICT (name) DO NOTHING;

-- Rewards catalog table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('discount', 'credit', 'service', 'gift', 'experience')),
    value DECIMAL(10,2), -- Monetary value if applicable
    discount_percent INTEGER, -- For percentage discounts
    code VARCHAR(50), -- Promo code if generated
    valid_days INTEGER DEFAULT 30, -- How long reward is valid after redemption
    min_tier VARCHAR(50) DEFAULT 'bronze',
    stock INTEGER, -- NULL means unlimited
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rewards
INSERT INTO rewards (name, description, points_required, reward_type, value, discount_percent) VALUES
('10% Off Next Repair', 'Get 10% discount on your next repair service', 100, 'discount', NULL, 10),
('20% Off Next Repair', 'Get 20% discount on your next repair service', 200, 'discount', NULL, 20),
('Free Screen Protector', 'Redeem a free tempered glass screen protector', 150, 'gift', 500, NULL),
('Free Diagnostics', 'Get a free device diagnostic check', 75, 'service', 1000, NULL),
('Priority Booking', 'Skip the queue with priority booking', 50, 'service', NULL, NULL),
('LKR 500 Credit', 'Get LKR 500 credit towards any service', 250, 'credit', 500, NULL),
('LKR 1000 Credit', 'Get LKR 1000 credit towards any service', 450, 'credit', 1000, NULL),
('Free Express Service', 'Get same-day express service for free', 300, 'service', 2000, NULL)
ON CONFLICT DO NOTHING;

-- Customer loyalty accounts
CREATE TABLE IF NOT EXISTS loyalty_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
    current_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    current_tier VARCHAR(50) DEFAULT 'bronze' REFERENCES loyalty_tiers(name),
    points_expiring_soon INTEGER DEFAULT 0,
    expiry_date DATE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES customers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate referral code function
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.customer_id::text || NOW()::text) FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_referral_code ON loyalty_accounts;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON loyalty_accounts
    FOR EACH ROW
    WHEN (NEW.referral_code IS NULL)
    EXECUTE FUNCTION generate_referral_code();

-- Points transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'earn_booking', 'earn_review', 'earn_referral', 'earn_bonus', 'earn_promotion',
        'redeem_reward', 'expire', 'adjust', 'refund'
    )),
    
    points INTEGER NOT NULL, -- Positive for earn, negative for redeem
    balance_after INTEGER NOT NULL,
    
    -- Reference to what caused this transaction
    reference_type VARCHAR(50), -- 'booking', 'review', 'reward', etc.
    reference_id UUID,
    
    description TEXT,
    expires_at DATE, -- When these points expire
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_account ON loyalty_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_customer ON loyalty_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_type ON loyalty_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created ON loyalty_transactions(created_at DESC);

-- Redeemed rewards tracking
CREATE TABLE IF NOT EXISTS redeemed_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id),
    
    points_spent INTEGER NOT NULL,
    reward_code VARCHAR(50) UNIQUE, -- Generated unique code for this redemption
    
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
    used_at TIMESTAMPTZ,
    used_on_booking UUID REFERENCES bookings(id),
    
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redeemed_rewards_account ON redeemed_rewards(account_id);
CREATE INDEX IF NOT EXISTS idx_redeemed_rewards_status ON redeemed_rewards(status);
CREATE INDEX IF NOT EXISTS idx_redeemed_rewards_code ON redeemed_rewards(reward_code);

-- Function to update tier based on points
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    NEW.current_tier := (
        SELECT name FROM loyalty_tiers
        WHERE NEW.current_points >= min_points
        AND (max_points IS NULL OR NEW.current_points <= max_points)
        ORDER BY min_points DESC
        LIMIT 1
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_loyalty_tier ON loyalty_accounts;
CREATE TRIGGER trigger_update_loyalty_tier
    BEFORE UPDATE OF current_points ON loyalty_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_loyalty_tier();

-- Function to earn points on booking completion
CREATE OR REPLACE FUNCTION earn_points_on_booking()
RETURNS TRIGGER AS $$
DECLARE
    v_account_id UUID;
    v_multiplier DECIMAL;
    v_points INTEGER;
    v_current_points INTEGER;
BEGIN
    -- Only process when booking is completed and paid
    IF NEW.status = 'completed' AND NEW.payment_status = 'paid' THEN
        -- Get or create loyalty account
        SELECT id INTO v_account_id FROM loyalty_accounts WHERE customer_id = NEW.customer_id;
        
        IF v_account_id IS NULL THEN
            INSERT INTO loyalty_accounts (customer_id)
            VALUES (NEW.customer_id)
            RETURNING id INTO v_account_id;
        END IF;
        
        -- Get tier multiplier
        SELECT lt.multiplier INTO v_multiplier
        FROM loyalty_accounts la
        JOIN loyalty_tiers lt ON la.current_tier = lt.name
        WHERE la.id = v_account_id;
        
        -- Calculate points (1 point per 100 LKR, with multiplier)
        v_points := FLOOR((COALESCE(NEW.final_cost, NEW.estimated_cost, 0) / 100) * COALESCE(v_multiplier, 1));
        
        IF v_points > 0 THEN
            -- Update account
            UPDATE loyalty_accounts
            SET current_points = current_points + v_points,
                lifetime_points = lifetime_points + v_points
            WHERE id = v_account_id
            RETURNING current_points INTO v_current_points;
            
            -- Record transaction
            INSERT INTO loyalty_transactions (
                account_id, customer_id, transaction_type, points, balance_after,
                reference_type, reference_id, description, expires_at
            ) VALUES (
                v_account_id, NEW.customer_id, 'earn_booking', v_points, v_current_points,
                'booking', NEW.id, 'Points earned from booking #' || NEW.id::text,
                CURRENT_DATE + INTERVAL '1 year'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemed_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own loyalty account" ON loyalty_accounts;
CREATE POLICY "Users can view own loyalty account" ON loyalty_accounts
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view own transactions" ON loyalty_transactions;
CREATE POLICY "Users can view own transactions" ON loyalty_transactions
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view own redeemed rewards" ON redeemed_rewards;
CREATE POLICY "Users can view own redeemed rewards" ON redeemed_rewards
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Public read for tiers and rewards
GRANT SELECT ON loyalty_tiers TO anon, authenticated;
GRANT SELECT ON rewards TO anon, authenticated;
GRANT ALL ON loyalty_accounts TO authenticated;
GRANT ALL ON loyalty_transactions TO authenticated;
GRANT ALL ON redeemed_rewards TO authenticated;

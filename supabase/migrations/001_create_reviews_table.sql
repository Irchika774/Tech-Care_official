-- Migration: Create Reviews Table
-- Date: 2026-01-02
-- Description: Creates the reviews table for customer feedback on technicians

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Rating fields
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Detailed ratings
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
    
    -- Flags
    would_recommend BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('pending', 'published', 'flagged', 'removed')),
    report_reason TEXT,
    reported_by UUID,
    reported_at TIMESTAMPTZ,
    
    -- Response from technician
    technician_response TEXT,
    response_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_technician_id ON reviews(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Unique constraint: One review per customer per booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_booking 
ON reviews(customer_id, technician_id, booking_id) 
WHERE booking_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read published reviews
CREATE POLICY "Public can view published reviews" ON reviews
    FOR SELECT
    USING (status = 'published');

-- Customers can insert their own reviews
CREATE POLICY "Customers can create reviews" ON reviews
    FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews" ON reviews
    FOR UPDATE
    USING (auth.uid() = customer_id);

-- Customers can delete their own reviews
CREATE POLICY "Customers can delete own reviews" ON reviews
    FOR DELETE
    USING (auth.uid() = customer_id);

-- Technicians can view reviews about them
CREATE POLICY "Technicians can view their reviews" ON reviews
    FOR SELECT
    USING (auth.uid() = technician_id);

-- Technicians can respond to reviews about them
CREATE POLICY "Technicians can respond to reviews" ON reviews
    FOR UPDATE
    USING (auth.uid() = technician_id)
    WITH CHECK (auth.uid() = technician_id);

-- Function to update technician rating after review changes
CREATE OR REPLACE FUNCTION update_technician_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE technicians
    SET 
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
            FROM reviews
            WHERE technician_id = COALESCE(NEW.technician_id, OLD.technician_id)
            AND status = 'published'
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE technician_id = COALESCE(NEW.technician_id, OLD.technician_id)
            AND status = 'published'
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.technician_id, OLD.technician_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic rating updates
DROP TRIGGER IF EXISTS trigger_update_rating_on_insert ON reviews;
CREATE TRIGGER trigger_update_rating_on_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_technician_rating();

DROP TRIGGER IF EXISTS trigger_update_rating_on_update ON reviews;
CREATE TRIGGER trigger_update_rating_on_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    WHEN (OLD.rating IS DISTINCT FROM NEW.rating OR OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_technician_rating();

DROP TRIGGER IF EXISTS trigger_update_rating_on_delete ON reviews;
CREATE TRIGGER trigger_update_rating_on_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_technician_rating();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON reviews TO anon;
GRANT ALL ON reviews TO authenticated;

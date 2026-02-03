-- Migration: Create Notifications Table
-- Date: 2026-01-02
-- Description: Creates the notifications table for real-time user notifications

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system' CHECK (type IN (
        'booking', 'payment', 'review', 'message', 'system', 
        'promotion', 'warning', 'success', 'error', 'reminder'
    )),
    
    -- Visual properties
    icon VARCHAR(50),
    image_url TEXT,
    
    -- Action properties
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Reference to related entity
    reference_type VARCHAR(50),
    reference_id UUID,
    
    -- Status
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Delivery channels
    sent_push BOOLEAN DEFAULT false,
    sent_email BOOLEAN DEFAULT false,
    sent_sms BOOLEAN DEFAULT false,
    
    -- Priority (for ordering and filtering)
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_label VARCHAR(100);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_type VARCHAR(50);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sent_push BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sent_email BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sent_sms BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Indexes for efficient queries
DROP INDEX IF EXISTS idx_notifications_user_id;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

DROP INDEX IF EXISTS idx_notifications_read;
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

DROP INDEX IF EXISTS idx_notifications_type;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

DROP INDEX IF EXISTS idx_notifications_created;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

DROP INDEX IF EXISTS idx_notifications_priority;
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority, created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- System can insert notifications for any user
DROP POLICY IF EXISTS "Service can insert notifications" ON notifications;
CREATE POLICY "Service can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET read = true, read_at = NOW()
    WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET read = true, read_at = NOW()
    WHERE user_id = auth.uid() AND read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM notifications
        WHERE user_id = p_user_id AND read = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50) DEFAULT 'system',
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL,
    p_priority VARCHAR(20) DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, action_url, priority)
    VALUES (p_user_id, p_title, p_message, p_type, p_reference_type, p_reference_id, p_action_url, p_priority)
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to notify on booking status change
CREATE OR REPLACE FUNCTION notify_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_title VARCHAR(255);
    v_message TEXT;
    v_type VARCHAR(50);
BEGIN
    -- Only notify on status change
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        CASE NEW.status
            WHEN 'confirmed' THEN
                v_title := 'Booking Confirmed';
                v_message := 'Your booking has been confirmed. A technician will be assigned soon.';
                v_type := 'success';
            WHEN 'assigned' THEN
                v_title := 'Technician Assigned';
                v_message := 'A technician has been assigned to your booking.';
                v_type := 'booking';
            WHEN 'in_progress' THEN
                v_title := 'Repair In Progress';
                v_message := 'Your device repair is now in progress.';
                v_type := 'booking';
            WHEN 'completed' THEN
                v_title := 'Repair Completed';
                v_message := 'Your device repair has been completed. Please leave a review!';
                v_type := 'success';
            WHEN 'cancelled' THEN
                v_title := 'Booking Cancelled';
                v_message := 'Your booking has been cancelled.';
                v_type := 'warning';
            ELSE
                RETURN NEW;
        END CASE;
        
        -- Create notification for customer
        PERFORM create_notification(
            NEW.customer_id,
            v_title,
            v_message,
            v_type,
            'booking',
            NEW.id,
            '/tracker/' || NEW.id::text,
            'high'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for notifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Grants
GRANT SELECT, UPDATE, DELETE ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notification_count TO authenticated;

-- Step 1: Delete duplicate technicians, keeping the one with the smallest ID (oldest)
DELETE FROM technicians
WHERE id NOT IN (
    SELECT MIN(id)
    FROM technicians
    GROUP BY user_id
) AND user_id IS NOT NULL;

-- Step 2: Add unique constraint to prevent future duplicates
-- Check if constraint already exists to avoid errors on re-run
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

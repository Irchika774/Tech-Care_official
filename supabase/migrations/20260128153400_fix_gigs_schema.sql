-- Migration to fix 'approved_at' column error
-- This safe migration adds the column only if the table exists but the column does not

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gigs') THEN
        ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Force schema cache reload just in case
NOTIFY pgrst, 'reload schema';

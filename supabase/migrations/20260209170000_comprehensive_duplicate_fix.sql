-- Comprehensive Duplicate Fix for Technicians AND Customers Tables
-- This migration handles duplicates by user_id AND by name (case-insensitive)
-- Created: 2026-02-09

-- ============================================
-- SECTION 1: FIX EXISTING DUPLICATES
-- ============================================

-- Step 1: Create a temporary table to track which technician records to keep (oldest by id)
CREATE TEMP TABLE technicians_to_keep AS
SELECT DISTINCT ON (LOWER(name)) id, user_id, name, email
FROM technicians
ORDER BY LOWER(name), id ASC;

-- Step 2: Delete all technicians NOT in the keep table
DELETE FROM technicians
WHERE id NOT IN (SELECT id FROM technicians_to_keep);

-- Step 3: Also handle duplicates by user_id (in case user_id is null but name differs)
-- For records with same user_id but different names, keep the oldest
DROP TABLE IF EXISTS technicians_to_keep;
CREATE TEMP TABLE technicians_to_keep AS
SELECT DISTINCT ON (user_id) id, user_id, name, email
FROM technicians
WHERE user_id IS NOT NULL
ORDER BY user_id, id ASC;

-- Delete technicians with same user_id but not in keep table
DELETE FROM technicians
WHERE user_id IN (
    SELECT user_id FROM technicians WHERE user_id IS NOT NULL
)
AND id NOT IN (SELECT id FROM technicians_to_keep);

DROP TABLE IF EXISTS technicians_to_keep;

-- Step 4: Do the same for customers table - fix duplicates by name
CREATE TEMP TABLE customers_to_keep AS
SELECT DISTINCT ON (LOWER(name)) id, user_id, name, email
FROM customers
ORDER BY LOWER(name), id ASC;

DELETE FROM customers
WHERE id NOT IN (SELECT id FROM customers_to_keep);

-- Fix duplicates by user_id for customers
DROP TABLE IF EXISTS customers_to_keep;
CREATE TEMP TABLE customers_to_keep AS
SELECT DISTINCT ON (user_id) id, user_id, name, email
FROM customers
WHERE user_id IS NOT NULL
ORDER BY user_id, id ASC;

DELETE FROM customers
WHERE user_id IN (
    SELECT user_id FROM customers WHERE user_id IS NOT NULL
)
AND id NOT IN (SELECT id FROM customers_to_keep);

DROP TABLE IF EXISTS customers_to_keep;

-- ============================================
-- SECTION 2: ADD UNIQUE CONSTRAINTS
-- ============================================

-- Step 5: Add enhanced unique constraint on technicians to prevent future duplicates
DO $
BEGIN
    -- Check for existing unique constraint on user_id
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_technician_user_id'
    ) THEN
        ALTER TABLE technicians
        ADD CONSTRAINT unique_technician_user_id UNIQUE (user_id);
    END IF;

    -- Check for existing unique constraint on name (case-insensitive)
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_technicians_name_lower_unique'
    ) THEN
        CREATE UNIQUE INDEX idx_technicians_name_lower_unique
        ON technicians (LOWER(name))
        WHERE name IS NOT NULL;
    END IF;
END $;

-- Step 6: Add unique constraints on customers table
DO $
BEGIN
    -- Check for existing unique constraint on user_id for customers
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_customer_user_id'
    ) THEN
        ALTER TABLE customers
        ADD CONSTRAINT unique_customer_user_id UNIQUE (user_id);
    END IF;

    -- Check for existing unique constraint on email for customers
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customers_email_lower_unique'
    ) THEN
        CREATE UNIQUE INDEX idx_customers_email_lower_unique
        ON customers (LOWER(email))
        WHERE email IS NOT NULL;
    END IF;
END $;

-- Step 7: Add unique constraint on profiles table
DO $
BEGIN
    -- Check for existing unique constraint on user_id for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_profile_user_id'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT unique_profile_user_id UNIQUE (id);
    END IF;

    -- Check for existing unique constraint on email for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_email_lower_unique'
    ) THEN
        CREATE UNIQUE INDEX idx_profiles_email_lower_unique
        ON profiles (LOWER(email))
        WHERE email IS NOT NULL;
    END IF;
END $;

-- ============================================
-- SECTION 3: CREATE PREVENTION TRIGGERS
-- ============================================

-- Step 8: Create a function to prevent duplicate names on technician insert/update
CREATE OR REPLACE FUNCTION prevent_duplicate_technician_name()
RETURNS TRIGGER AS $
BEGIN
    IF EXISTS (
        SELECT 1 FROM technicians
        WHERE LOWER(name) = LOWER(NEW.name)
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'A technician with the name "%" already exists.', NEW.name;
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Step 9: Create trigger if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prevent_duplicate_technician_name'
    ) THEN
        CREATE TRIGGER trg_prevent_duplicate_technician_name
        BEFORE INSERT OR UPDATE OF name ON technicians
        FOR EACH ROW
        EXECUTE FUNCTION prevent_duplicate_technician_name();
    END IF;
END $;

-- Step 10: Create a function to prevent duplicate user_id on technician insert/update
CREATE OR REPLACE FUNCTION prevent_duplicate_technician_user_id()
RETURNS TRIGGER AS $
BEGIN
    IF EXISTS (
        SELECT 1 FROM technicians
        WHERE user_id = NEW.user_id
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'A technician with user_id "%" already exists.', NEW.user_id;
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Step 11: Create trigger if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prevent_duplicate_technician_user_id'
    ) THEN
        CREATE TRIGGER trg_prevent_duplicate_technician_user_id
        BEFORE INSERT OR UPDATE OF user_id ON technicians
        FOR EACH ROW
        EXECUTE FUNCTION prevent_duplicate_technician_user_id();
    END IF;
END $;

-- Step 12: Create similar functions for customers
CREATE OR REPLACE FUNCTION prevent_duplicate_customer_email()
RETURNS TRIGGER AS $
BEGIN
    IF EXISTS (
        SELECT 1 FROM customers
        WHERE LOWER(email) = LOWER(NEW.email)
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'A customer with the email "%" already exists.', NEW.email;
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Step 13: Create trigger for customers email
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prevent_duplicate_customer_email'
    ) THEN
        CREATE TRIGGER trg_prevent_duplicate_customer_email
        BEFORE INSERT OR UPDATE OF email ON customers
        FOR EACH ROW
        EXECUTE FUNCTION prevent_duplicate_customer_email();
    END IF;
END $;

-- ============================================
-- SECTION 4: CREATE UTILITY FUNCTIONS
-- ============================================

-- Step 14: Create a function to find duplicate technicians (utility function)
CREATE OR REPLACE FUNCTION find_duplicate_technicians()
RETURNS TABLE (name TEXT, count BIGINT, user_ids TEXT[]) AS $
BEGIN
    RETURN QUERY
    SELECT LOWER(t.name) as name, COUNT(*) as count, ARRAY_AGG(t.user_id) as user_ids
    FROM technicians t
    WHERE t.name IS NOT NULL
    GROUP BY LOWER(t.name)
    HAVING COUNT(*) > 1
    ORDER BY count DESC;
END;
$ LANGUAGE plpgsql;

-- Step 15: Create a function to find duplicate customer emails (utility function)
CREATE OR REPLACE FUNCTION find_duplicate_customer_emails()
RETURNS TABLE (email TEXT, count BIGINT, user_ids TEXT[]) AS $
BEGIN
    RETURN QUERY
    SELECT LOWER(c.email) as email, COUNT(*) as count, ARRAY_AGG(c.user_id) as user_ids
    FROM customers c
    WHERE c.email IS NOT NULL
    GROUP BY LOWER(c.email)
    HAVING COUNT(*) > 1
    ORDER BY count DESC;
END;
$ LANGUAGE plpgsql;

-- Step 16: Create a function to find duplicate user_ids (utility function)
CREATE OR REPLACE FUNCTION find_duplicate_technician_user_ids()
RETURNS TABLE (user_id TEXT, count BIGINT, ids TEXT[]) AS $
BEGIN
    RETURN QUERY
    SELECT t.user_id, COUNT(*), ARRAY_AGG(t.id::TEXT) as ids
    FROM technicians t
    WHERE t.user_id IS NOT NULL
    GROUP BY t.user_id
    HAVING COUNT(*) > 1
    ORDER BY count DESC;
END;
$ LANGUAGE plpgsql;

COMMENT ON FUNCTION find_duplicate_technicians() IS 'Returns all technician names that appear more than once (case-insensitive)';
COMMENT ON FUNCTION find_duplicate_customer_emails() IS 'Returns all customer emails that appear more than once';
COMMENT ON FUNCTION find_duplicate_technician_user_ids() IS 'Returns all user_ids that appear more than once in the technicians table';

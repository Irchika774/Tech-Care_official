-- Migration to add missing optional date columns to user_devices table
ALTER TABLE user_devices
ALTER COLUMN purchase_date DROP NOT NULL;

ALTER TABLE user_devices
ALTER COLUMN warranty_expiry DROP NOT NULL;

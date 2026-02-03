-- Fix availability format to match new TechnicianDashboard schema
-- Replaces complex/old availability objects with simple days array format if 'days' is missing

UPDATE technicians 
SET availability = '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "startTime": "09:00", "endTime": "17:00"}'::jsonb 
WHERE availability->>'days' IS NULL;

-- Ensure default is set correctly for future rows
ALTER TABLE technicians 
ALTER COLUMN availability SET DEFAULT '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "startTime": "09:00", "endTime": "17:00"}'::jsonb;

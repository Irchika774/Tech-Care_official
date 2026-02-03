-- Add availability column to technicians table
ALTER TABLE technicians 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "startTime": "09:00", "endTime": "17:00"}';

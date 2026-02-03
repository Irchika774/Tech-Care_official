-- Add availability column to technicians table if it doesn't exist
ALTER TABLE technicians 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{
  "status": "available",
  "schedule": {
    "monday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "tuesday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "wednesday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "thursday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "friday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "saturday": {"available": true, "hours": {"from": "09:00", "to": "17:00"}},
    "sunday": {"available": false, "hours": {"from": "09:00", "to": "17:00"}}
  }
}';

-- Update RLS policies to allow technicians to update their own availability
-- (Assuming existing update policy covers all columns, but good to note)

-- Create technician_services table
CREATE TABLE IF NOT EXISTS public.technician_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    category TEXT,
    estimated_time TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create technician_availability table
CREATE TABLE IF NOT EXISTS public.technician_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
    start_time TIME NOT NULL DEFAULT '09:00',
    end_time TIME NOT NULL DEFAULT '17:00',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(technician_id, day_of_week)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tech_services_tech_id ON technician_services(technician_id);
CREATE INDEX IF NOT EXISTS idx_tech_availability_tech_id ON technician_availability(technician_id);

-- Enable RLS
ALTER TABLE technician_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_availability ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies (adjust as needed for full production)
-- Allow technicians to manage their own data
CREATE POLICY "Technicians can manage their own services" ON technician_services
    FOR ALL USING (technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid()));

CREATE POLICY "Technicians can manage their own availability" ON technician_availability
    FOR ALL USING (technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid()));

-- Allow public read access for booking process
CREATE POLICY "Public can view technician services" ON technician_services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view technician availability" ON technician_availability
    FOR SELECT USING (is_available = true);

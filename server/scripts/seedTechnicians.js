import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const technicians = [
    {
        name: 'John Tech',
        email: 'john@example.com',
        phone: '+1234567890',
        specialization: ['Screen Repair', 'Battery Replacement', 'Water Damage'],
        brands: ['Apple', 'Samsung', 'Google'],
        experience: 5,
        rating: 4.8,
        review_count: 124,
        price_range: { min: 50, max: 200 },
        status: 'active',
        is_verified: true,
        address: 'Colombo, Sri Lanka',
        latitude: 6.9271,
        longitude: 79.8612,
        description: 'Expert mobile repair technician with 5 years of experience in flagship devices.'
    },
    {
        name: 'Sarah Fix',
        email: 'sarah@example.com',
        phone: '+1234567891',
        specialization: ['Motherboard Repair', 'RAM Upgrade', 'Data Recovery'],
        brands: ['Dell', 'HP', 'Asus', 'Custom'],
        experience: 8,
        rating: 4.9,
        review_count: 210,
        price_range: { min: 100, max: 500 },
        status: 'active',
        is_verified: true,
        address: 'Kandy, Sri Lanka',
        latitude: 7.2906,
        longitude: 80.6337,
        description: 'Specialist in PC and Laptop hardware diagnostics and repairs.'
    },
    {
        name: 'Mike Mobile',
        email: 'mike@example.com',
        phone: '+1234567892',
        specialization: ['Charging Port', 'Software Issues', 'Camera Repair'],
        brands: ['Xiaomi', 'OnePlus', 'Huawei'],
        experience: 3,
        rating: 4.5,
        review_count: 56,
        price_range: { min: 30, max: 150 },
        status: 'active',
        is_verified: false,
        address: 'Galle, Sri Lanka',
        latitude: 6.0535,
        longitude: 80.2170,
        description: 'Fast and reliable mobile repairs for all major Android brands.'
    }
];

async function seed() {
    console.log('🌱 Seeding technicians...');
    
    for (const tech of technicians) {
        const { data, error } = await supabase
            .from('technicians')
            .upsert([tech], { onConflict: 'email' })
            .select();
        
        if (error) {
            console.error(`❌ Error seeding ${tech.name}:`, error.message);
        } else {
            console.log(`✅ Seeded ${tech.name}`);
        }
    }
    
    console.log('✅ Seeding complete!');
}

seed().catch(console.error);

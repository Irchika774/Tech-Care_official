import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedChat() {
    try {
        console.log('Starting seed...');

        // 1. Get Customer
        const { data: customer } = await supabase
            .from('customers')
            .select('id, user_id')
            .eq('email', 'testuser_final_100@example.com')
            .single();

        if (!customer) throw new Error('Customer not found');

        // 2. Create Technician
        const uniqueEmail = `tech_${Date.now()}@example.com`;
        const { data: auth, error: authError } = await supabase.auth.admin.createUser({
            email: uniqueEmail,
            password: 'Password123!',
            email_confirm: true,
            user_metadata: { role: 'technician', name: 'Demo Tech' }
        });

        if (authError) throw authError;
        const userId = auth.user.id;

        // 2a. Create Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: userId,
                email: uniqueEmail,
                name: 'Demo Tech',
                role: 'technician'
            }]);

        if (profileError) throw new Error(`Profile error: ${profileError.message}`);

        // 2b. Create Technician
        const { data: newTech, error: techError } = await supabase
            .from('technicians')
            .insert([{
                user_id: userId,
                name: 'Demo Tech',
                email: uniqueEmail,
                phone: '1234567890'
            }])
            .select()
            .single();

        if (techError) throw techError;

        // 3. Create Booking (Correct Columns)
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                customer_id: customer.id,
                technician_id: newTech.id,
                status: 'in_progress',
                estimated_cost: 5000,
                device_brand: 'Test',
                device_model: 'Device',
                device_type: 'smartphone',
                issue_type: 'Test',
                issue_description: 'Testing chat functionality'
            }])
            .select()
            .single();

        if (bookingError) throw new Error(`Booking error: ${bookingError.message}`);
        console.log('Booking created:', booking.id);

        // 4. Send Message
        const { error: msgError } = await supabase
            .from('messages')
            .insert([{
                booking_id: booking.id,
                sender_id: userId,
                content: 'Hello! I am your technician. How can a help you?'
            }]);

        if (msgError) throw new Error(`Message error: ${msgError.message}`);
        console.log('SUCCESS: Chat seeded.');

    } catch (err) {
        console.error('Seed failed:', err.message);
    }
}

seedChat();

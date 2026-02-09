const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log('Checking for duplicate technicians...');
    const { data: duplicates, error } = await supabase
        .rpc('get_duplicate_technicians'); // I'll check if this RPC exists or just query directly

    if (error) {
        // If RPC doesn't exist, use JS to find them
        console.log('RPC failed, fetching all technicians to find duplicates manually...');
        const { data: techs, error: fetchError } = await supabase
            .from('technicians')
            .select('id, user_id, name, email');

        if (fetchError) {
            console.error('Error fetching technicians:', fetchError);
            return;
        }

        const counts = {};
        const dupUsers = [];
        techs.forEach(t => {
            const key = t.user_id || t.email || t.name;
            counts[key] = (counts[key] || 0) + 1;
            if (counts[key] === 2) {
                dupUsers.push(key);
            }
        });

        if (dupUsers.length === 0) {
            console.log('No duplicates found based on user_id/email/name.');
        } else {
            console.log('Found duplicates for:', dupUsers);
            dupUsers.forEach(key => {
                const matches = techs.filter(t => (t.user_id === key || t.email === key || t.name === key));
                console.log(`Key: ${key}`, matches);
            });
        }
    } else {
        console.log('Duplicates found via RPC:', duplicates);
    }
}

checkDuplicates();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicates() {
    console.log('Fixing duplicate technicians...');

    // Step 1: Find all user_ids with duplicates
    const { data: techs, error: fetchError } = await supabase
        .from('technicians')
        .select('id, user_id')
        .order('id', { ascending: true });

    if (fetchError) {
        console.error('Error fetching technicians:', fetchError);
        return;
    }

    const seen = new Set();
    const toDelete = [];
    const keep = [];

    techs.forEach(t => {
        if (!t.user_id) return;
        if (seen.has(t.user_id)) {
            toDelete.push(t.id);
        } else {
            seen.add(t.user_id);
            keep.push(t.id);
        }
    });

    console.log(`Total technicians: ${techs.length}`);
    console.log(`Unique technicians: ${seen.size}`);
    console.log(`Duplicates to delete: ${toDelete.length}`);

    if (toDelete.length === 0) {
        console.log('No duplicates found.');
        return;
    }

    // Delete in batches of 100 to avoid request limits
    for (let i = 0; i < toDelete.length; i += 100) {
        const batch = toDelete.slice(i, i + 100);
        console.log(`Deleting batch ${i / 100 + 1}...`);
        const { error: deleteError } = await supabase
            .from('technicians')
            .delete()
            .in('id', batch);

        if (deleteError) {
            console.error('Error deleting batch:', deleteError);
            break;
        }
    }

    console.log('Duplicates fixed successfully.');
}

fixDuplicates();

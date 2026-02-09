/**
 * Comprehensive Duplicate Technician Fix Script
 * This script fixes duplicates by both user_id AND name
 * Usage: node scripts/comprehensive-fix-duplicates.cjs
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    console.error('Please make sure you have a .env file with these variables configured');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findDuplicatesByName() {
    console.log('\n=== Checking for duplicates by name ===');
    const { data: techs, error } = await supabase
        .from('technicians')
        .select('id, user_id, name, email')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching technicians:', error);
        return [];
    }

    const nameGroups = {};
    techs.forEach(t => {
        const name = t.name?.trim().toLowerCase() || 'unknown';
        if (!nameGroups[name]) {
            nameGroups[name] = [];
        }
        nameGroups[name].push(t);
    });

    const duplicates = Object.entries(nameGroups)
        .filter(([name, records]) => records.length > 1)
        .sort((a, b) => b[1].length - a[1].length);

    if (duplicates.length === 0) {
        console.log('No duplicates found by name.');
    } else {
        console.log(`Found ${duplicates.length} names with duplicates:`);
        duplicates.forEach(([name, records]) => {
            console.log(`\nName: "${name}" (${records.length} records)`);
            records.forEach((r, i) => {
                console.log(`  ${i + 1}. ID: ${r.id}, UserID: ${r.user_id}, Email: ${r.email}`);
            });
        });
    }

    return duplicates;
}

async function findDuplicatesByUserId() {
    console.log('\n=== Checking for duplicates by user_id ===');
    const { data: techs, error } = await supabase
        .from('technicians')
        .select('id, user_id, name, email')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching technicians:', error);
        return [];
    }

    const userIdGroups = {};
    techs.forEach(t => {
        if (t.user_id) {
            if (!userIdGroups[t.user_id]) {
                userIdGroups[t.user_id] = [];
            }
            userIdGroups[t.user_id].push(t);
        }
    });

    const duplicates = Object.entries(userIdGroups)
        .filter(([userId, records]) => records.length > 1)
        .sort((a, b) => b[1].length - a[1].length);

    if (duplicates.length === 0) {
        console.log('No duplicates found by user_id.');
    } else {
        console.log(`Found ${duplicates.length} user_ids with duplicates:`);
        duplicates.forEach(([userId, records]) => {
            console.log(`\nUserID: ${userId} (${records.length} records)`);
            records.forEach((r, i) => {
                console.log(`  ${i + 1}. ID: ${r.id}, Name: ${r.name}, Email: ${r.email}`);
            });
        });
    }

    return duplicates;
}

async function fixDuplicatesByName(duplicates) {
    console.log('\n=== Fixing duplicates by name ===');
    
    const idsToDelete = [];
    
    duplicates.forEach(([name, records]) => {
        // Keep the first record (alphabetically by name, which is already sorted)
        // Delete all others
        for (let i = 1; i < records.length; i++) {
            idsToDelete.push(records[i].id);
        }
    });

    if (idsToDelete.length === 0) {
        console.log('No duplicates to fix by name.');
        return;
    }

    console.log(`Deleting ${idsToDelete.length} duplicate records by name...`);
    
    // Delete in batches of 100
    for (let i = 0; i < idsToDelete.length; i += 100) {
        const batch = idsToDelete.slice(i, i + 100);
        const { error } = await supabase
            .from('technicians')
            .delete()
            .in('id', batch);

        if (error) {
            console.error(`Error deleting batch ${Math.floor(i / 100) + 1}:`, error);
        } else {
            console.log(`Deleted batch ${Math.floor(i / 100) + 1} (${batch.length} records)`);
        }
    }
}

async function fixDuplicatesByUserId(duplicates) {
    console.log('\n=== Fixing duplicates by user_id ===');
    
    const idsToDelete = [];
    
    duplicates.forEach(([userId, records]) => {
        // Keep the first record (oldest by id, which is already sorted)
        // Delete all others
        for (let i = 1; i < records.length; i++) {
            idsToDelete.push(records[i].id);
        }
    });

    if (idsToDelete.length === 0) {
        console.log('No duplicates to fix by user_id.');
        return;
    }

    console.log(`Deleting ${idsToDelete.length} duplicate records by user_id...`);
    
    // Delete in batches of 100
    for (let i = 0; i < idsToDelete.length; i += 100) {
        const batch = idsToDelete.slice(i, i + 100);
        const { error } = await supabase
            .from('technicians')
            .delete()
            .in('id', batch);

        if (error) {
            console.error(`Error deleting batch ${Math.floor(i / 100) + 1}:`, error);
        } else {
            console.log(`Deleted batch ${Math.floor(i / 100) + 1} (${batch.length} records)`);
        }
    }
}

async function addConstraints() {
    console.log('\n=== Adding constraints to prevent future duplicates ===');
    
    try {
        // Add unique constraint on user_id
        const { error: userIdError } = await supabase.rpc('exec_sql', {
            sql: `
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname = 'unique_technician_user_id'
                    ) THEN
                        ALTER TABLE technicians
                        ADD CONSTRAINT unique_technician_user_id UNIQUE (user_id);
                    END IF;
                END $$;
            `
        });
        
        if (userIdError) {
            console.log('Note: Could not add user_id constraint (may already exist):', userIdError.message);
        } else {
            console.log('Added unique constraint on user_id.');
        }
    } catch (e) {
        console.log('Note: Could not add user_id constraint:', e.message);
    }

    try {
        // Create unique index on lowercase name
        const { error: nameError } = await supabase.rpc('exec_sql', {
            sql: `
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_technicians_name_lower_unique'
                    ) THEN
                        CREATE UNIQUE INDEX idx_technicians_name_lower_unique
                        ON technicians (LOWER(name))
                        WHERE name IS NOT NULL;
                    END IF;
                END $$;
            `
        });
        
        if (nameError) {
            console.log('Note: Could not add name constraint (may already exist):', nameError.message);
        } else {
            console.log('Added unique constraint on name (case-insensitive).');
        }
    } catch (e) {
        console.log('Note: Could not add name constraint:', e.message);
    }
}

async function showStatistics() {
    console.log('\n=== Current Statistics ===');
    
    const { count: total } = await supabase
        .from('technicians')
        .select('*', { count: 'exact', head: true });

    const { count: withUserId } = await supabase
        .from('technicians')
        .select('*', { count: 'exact', head: true })
        .not('user_id', 'is', null);

    const { count: withoutUserId } = await supabase
        .from('technicians')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

    console.log(`Total technicians: ${total}`);
    console.log(`Technicians with user_id: ${withUserId}`);
    console.log(`Technicians without user_id: ${withoutUserId}`);
}

async function comprehensiveFix() {
    console.log('===========================================');
    console.log('Comprehensive Duplicate Technician Fix');
    console.log('===========================================');
    console.log(`Supabase URL: ${supabaseUrl}`);
    
    try {
        // Show current statistics
        await showStatistics();

        // Find duplicates by name
        const nameDuplicates = await findDuplicatesByName();

        // Find duplicates by user_id
        const userIdDuplicates = await findDuplicatesByUserId();

        // Confirm before fixing
        const totalDuplicates = [...new Set([
            ...nameDuplicates.flatMap(([_, records]) => records.map(r => r.id)),
            ...userIdDuplicates.flatMap(([_, records]) => records.map(r => r.id))
        ])];

        if (totalDuplicates.length === 0) {
            console.log('\n✓ No duplicates found! The database is clean.');
        } else {
            console.log(`\n⚠ Found ${totalDuplicates.length} duplicate records to fix.`);
            console.log('Starting fix process...\n');

            // Fix duplicates
            await fixDuplicatesByName(nameDuplicates);
            await fixDuplicatesByUserId(userIdDuplicates);

            // Add constraints to prevent future duplicates
            await addConstraints();

            // Show updated statistics
            console.log('\n=== After Fix ===');
            await showStatistics();

            console.log('\n✓ Duplicate fix completed successfully!');
        }

    } catch (error) {
        console.error('\n✗ Error during duplicate fix:', error);
        process.exit(1);
    }
}

// Run the fix
comprehensiveFix();

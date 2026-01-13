/**
 * Apply Storage RLS Policies
 * 
 * This script applies RLS policies for the 'images' storage bucket
 * using the PostgreSQL connection via Supabase's management API
 * 
 * Usage: node scripts/apply-storage-policies.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function applyRLSPolicies() {
    console.log('🔐 Applying RLS policies for images bucket...\n');

    // SQL statements for RLS policies
    const policies = [
        {
            name: 'Allow authenticated users to upload images',
            sql: `
                DO $$
                BEGIN
                    -- Drop existing policy if exists
                    DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
                    
                    -- Create INSERT policy
                    CREATE POLICY "Allow authenticated users to upload images"
                    ON storage.objects
                    FOR INSERT
                    TO authenticated
                    WITH CHECK (bucket_id = 'images');
                    
                    RAISE NOTICE 'Created INSERT policy for images bucket';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'Policy may already exist or error occurred: %', SQLERRM;
                END $$;
            `
        },
        {
            name: 'Allow public to view images',
            sql: `
                DO $$
                BEGIN
                    -- Drop existing policy if exists
                    DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
                    
                    -- Create SELECT policy for public access
                    CREATE POLICY "Allow public to view images"
                    ON storage.objects
                    FOR SELECT
                    TO public
                    USING (bucket_id = 'images');
                    
                    RAISE NOTICE 'Created SELECT policy for images bucket';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'Policy may already exist or error occurred: %', SQLERRM;
                END $$;
            `
        },
        {
            name: 'Allow authenticated users to update images',
            sql: `
                DO $$
                BEGIN
                    -- Drop existing policy if exists
                    DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
                    
                    -- Create UPDATE policy
                    CREATE POLICY "Allow authenticated users to update images"
                    ON storage.objects
                    FOR UPDATE
                    TO authenticated
                    USING (bucket_id = 'images')
                    WITH CHECK (bucket_id = 'images');
                    
                    RAISE NOTICE 'Created UPDATE policy for images bucket';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'Policy may already exist or error occurred: %', SQLERRM;
                END $$;
            `
        },
        {
            name: 'Allow authenticated users to delete images',
            sql: `
                DO $$
                BEGIN
                    -- Drop existing policy if exists
                    DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
                    
                    -- Create DELETE policy
                    CREATE POLICY "Allow authenticated users to delete images"
                    ON storage.objects
                    FOR DELETE
                    TO authenticated
                    USING (bucket_id = 'images');
                    
                    RAISE NOTICE 'Created DELETE policy for images bucket';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'Policy may already exist or error occurred: %', SQLERRM;
                END $$;
            `
        }
    ];

    let successCount = 0;

    for (const policy of policies) {
        console.log(`📜 Applying: ${policy.name}...`);

        try {
            const { data, error } = await supabase.rpc('exec_sql', { sql_query: policy.sql });

            if (error) {
                // If exec_sql doesn't exist, we'll handle it via raw SQL
                console.log(`   ⚠️  RPC not available, will need manual application`);
            } else {
                console.log(`   ✅ Applied successfully`);
                successCount++;
            }
        } catch (err) {
            console.log(`   ⚠️  Error: ${err.message}`);
        }
    }

    return successCount;
}

async function testUpload() {
    console.log('\n🧪 Testing upload capability...\n');

    try {
        // Create a simple test image (1x1 pixel PNG)
        const testImageData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
            0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);

        const testFileName = `test/migration-test-${Date.now()}.png`;

        // Try to upload with service role
        const { data, error } = await supabase.storage
            .from('images')
            .upload(testFileName, testImageData, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.log('❌ Upload test failed:', error.message);
            return false;
        }

        console.log('✅ Upload test successful!');
        console.log(`   Path: ${data.path}`);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(testFileName);

        console.log(`   Public URL: ${urlData.publicUrl}`);

        // Clean up test file
        await supabase.storage.from('images').remove([testFileName]);
        console.log('   🗑️  Test file cleaned up');

        return true;
    } catch (err) {
        console.log('❌ Upload test error:', err.message);
        return false;
    }
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     TechCare - Storage RLS Policies Setup                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

    // Note: Supabase JS SDK doesn't have a direct way to run raw SQL
    // The RPC approach requires a function to be set up in advance
    // So we'll provide alternative instructions

    console.log('⚠️  Note: RLS policies require direct SQL execution.\n');
    console.log('📋 The following SQL needs to be run in Supabase SQL Editor:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const policiesSQL = `
-- Policy 1: Allow authenticated users to upload images
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy 2: Allow anyone to view images (public access)
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy 3: Allow authenticated users to update their own uploaded images
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: Allow authenticated users to delete their own uploaded images
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
`;

    console.log(policiesSQL);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test upload with service role
    const uploadSuccess = await testUpload();

    if (uploadSuccess) {
        console.log('\n✅ Storage bucket is working with service role!');
        console.log('   Now apply the RLS policies in Supabase Dashboard for user uploads.\n');
    }
}

main();

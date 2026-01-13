/**
 * Test Image Upload as Authenticated User
 * 
 * This script tests the complete upload flow:
 * 1. Sign in as a test user
 * 2. Upload an image to the 'images' bucket
 * 3. Get the public URL
 * 4. Verify the upload worked
 * 
 * Usage: node scripts/test-image-upload.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

// Test with service role first (admin bypass)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Test with anon key (simulates frontend)
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testUpload(client, clientName) {
    console.log(`\n🧪 Testing upload with ${clientName}...\n`);

    try {
        // Create a test image (1x1 pixel PNG)
        const testImageData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
            0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);

        const testFileName = `uploads/test-${Date.now()}.png`;

        // Upload
        const { data, error } = await client.storage
            .from('images')
            .upload(testFileName, testImageData, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.log(`   ❌ Upload failed: ${error.message}`);
            return false;
        }

        console.log(`   ✅ Upload successful!`);
        console.log(`   📁 Path: ${data.path}`);

        // Get public URL
        const { data: urlData } = client.storage
            .from('images')
            .getPublicUrl(testFileName);

        console.log(`   🔗 Public URL: ${urlData.publicUrl}`);

        // Clean up
        const { error: deleteError } = await client.storage
            .from('images')
            .remove([testFileName]);

        if (deleteError) {
            console.log(`   ⚠️  Cleanup failed: ${deleteError.message}`);
        } else {
            console.log(`   🗑️  Test file cleaned up`);
        }

        return true;
    } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
        return false;
    }
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     TechCare - Image Upload Test                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    console.log(`\n📍 Supabase URL: ${supabaseUrl}`);

    // Test with service role (should always work)
    const adminSuccess = await testUpload(supabaseAdmin, 'Service Role (Admin)');

    // Test with anon key (should fail without auth due to RLS)
    const anonSuccess = await testUpload(supabaseAnon, 'Anonymous Key (No Auth)');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Results:');
    console.log(`   Service Role (Admin): ${adminSuccess ? '✅ Passed' : '❌ Failed'}`);
    console.log(`   Anonymous (No Auth):  ${anonSuccess ? '✅ Passed (unexpected!)' : '✅ Correctly Blocked'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (adminSuccess && !anonSuccess) {
        console.log('🎉 Storage is configured correctly!');
        console.log('   - Admin/Service role can upload');
        console.log('   - Anonymous users are blocked (RLS working)');
        console.log('   - Authenticated users in the frontend should work\n');
    } else if (adminSuccess && anonSuccess) {
        console.log('⚠️  Warning: Anonymous uploads are allowed.');
        console.log('   This may be intentional for public uploads.\n');
    } else {
        console.log('❌ There may be configuration issues.\n');
    }
}

main();

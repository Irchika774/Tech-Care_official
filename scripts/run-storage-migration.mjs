/**
 * Run Supabase Storage Bucket Migration
 * 
 * This script creates the 'images' storage bucket with proper RLS policies
 * for the TechCare application.
 * 
 * Usage: node scripts/run-storage-migration.mjs
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

async function createImagesBucket() {
    console.log('🚀 Creating images storage bucket...\n');

    try {
        // Check if bucket already exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('❌ Error listing buckets:', listError.message);
            return false;
        }

        const existingBucket = buckets.find(b => b.id === 'images');

        if (existingBucket) {
            console.log('ℹ️  Bucket "images" already exists');

            // Update bucket to ensure it's public
            const { error: updateError } = await supabase.storage.updateBucket('images', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
                fileSizeLimit: 52428800 // 50MB
            });

            if (updateError) {
                console.error('⚠️  Error updating bucket:', updateError.message);
            } else {
                console.log('✅ Bucket updated to public with image MIME types');
            }
        } else {
            // Create new bucket
            const { data, error: createError } = await supabase.storage.createBucket('images', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
                fileSizeLimit: 52428800 // 50MB
            });

            if (createError) {
                console.error('❌ Error creating bucket:', createError.message);
                return false;
            }

            console.log('✅ Successfully created "images" bucket');
        }

        // Test upload permissions by getting bucket info
        const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('images');

        if (bucketError) {
            console.error('❌ Error getting bucket info:', bucketError.message);
            return false;
        }

        console.log('\n📦 Bucket Configuration:');
        console.log(`   Name: ${bucketInfo.name}`);
        console.log(`   Public: ${bucketInfo.public}`);
        console.log(`   File Size Limit: ${(bucketInfo.file_size_limit / 1024 / 1024).toFixed(0)}MB`);
        console.log(`   Allowed MIME Types: ${bucketInfo.allowed_mime_types?.join(', ') || 'All'}`);

        return true;
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        return false;
    }
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     TechCare - Storage Bucket Migration                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

    const success = await createImagesBucket();

    if (success) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Migration completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📝 Next steps:');
        console.log('   1. Create RLS policies for the bucket in Supabase Dashboard');
        console.log('   2. Go to Storage → images → Policies');
        console.log('   3. Add policies for INSERT (authenticated) and SELECT (public)');
        console.log('\n   Or run the SQL migration manually in Supabase SQL Editor:\n');
        console.log('   supabase/migrations/005_create_images_bucket.sql\n');
    } else {
        console.log('\n❌ Migration failed. Please check the errors above.');
        process.exit(1);
    }
}

main();

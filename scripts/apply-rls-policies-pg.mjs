/**
 * Apply Storage RLS Policies via PostgreSQL
 * 
 * This script connects directly to the Supabase PostgreSQL database
 * and applies the necessary RLS policies for the 'images' storage bucket.
 * 
 * Usage: node scripts/apply-rls-policies-pg.mjs
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ Missing DATABASE_URL in .env');
    process.exit(1);
}

async function applyRLSPolicies() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     TechCare - Apply Storage RLS Policies                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const client = new Client({
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected to Supabase PostgreSQL\n');

        // Check if bucket exists
        console.log('📦 Checking if images bucket exists...');
        const bucketCheck = await client.query(
            "SELECT id, name, public FROM storage.buckets WHERE id = 'images'"
        );

        if (bucketCheck.rows.length === 0) {
            console.log('⚠️  Bucket "images" not found. Creating it...');
            await client.query(`
                INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
                VALUES (
                    'images',
                    'images',
                    true,
                    false,
                    52428800,
                    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
                )
            `);
            console.log('✅ Bucket created');
        } else {
            console.log(`✅ Bucket exists: ${bucketCheck.rows[0].name} (public: ${bucketCheck.rows[0].public})`);

            // Ensure it's public
            if (!bucketCheck.rows[0].public) {
                await client.query("UPDATE storage.buckets SET public = true WHERE id = 'images'");
                console.log('   ↳ Updated to public');
            }
        }

        console.log('\n🔐 Applying RLS policies...\n');

        // Policy 1: Allow authenticated users to upload
        console.log('1️⃣  Creating INSERT policy for authenticated users...');
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects`);
        await client.query(`
            CREATE POLICY "Allow authenticated users to upload images"
            ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'images')
        `);
        console.log('   ✅ INSERT policy created');

        // Policy 2: Allow public to view
        console.log('2️⃣  Creating SELECT policy for public access...');
        await client.query(`DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects`);
        await client.query(`
            CREATE POLICY "Allow public to view images"
            ON storage.objects
            FOR SELECT
            TO public
            USING (bucket_id = 'images')
        `);
        console.log('   ✅ SELECT policy created');

        // Policy 3: Allow authenticated users to update
        console.log('3️⃣  Creating UPDATE policy for authenticated users...');
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects`);
        await client.query(`
            CREATE POLICY "Allow authenticated users to update images"
            ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (bucket_id = 'images')
            WITH CHECK (bucket_id = 'images')
        `);
        console.log('   ✅ UPDATE policy created');

        // Policy 4: Allow authenticated users to delete
        console.log('4️⃣  Creating DELETE policy for authenticated users...');
        await client.query(`DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects`);
        await client.query(`
            CREATE POLICY "Allow authenticated users to delete images"
            ON storage.objects
            FOR DELETE
            TO authenticated
            USING (bucket_id = 'images')
        `);
        console.log('   ✅ DELETE policy created');

        // Verify policies
        console.log('\n📋 Verifying applied policies...');
        const policies = await client.query(`
            SELECT policyname, permissive, roles, cmd, qual, with_check
            FROM pg_policies
            WHERE tablename = 'objects' AND schemaname = 'storage'
            AND policyname LIKE '%images%'
        `);

        console.log(`   Found ${policies.rows.length} policies for images bucket:\n`);

        for (const policy of policies.rows) {
            console.log(`   📜 ${policy.policyname}`);
            console.log(`      Command: ${policy.cmd}`);
            console.log(`      Roles: ${Array.isArray(policy.roles) ? policy.roles.join(', ') : policy.roles}`);
            console.log('');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ All RLS policies applied successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📝 Summary:');
        console.log('   • Bucket "images" is PUBLIC ✅');
        console.log('   • Authenticated users can UPLOAD images ✅');
        console.log('   • Anyone can VIEW images ✅');
        console.log('   • Authenticated users can UPDATE their images ✅');
        console.log('   • Authenticated users can DELETE their images ✅');
        console.log('\n🎉 Image uploads in Create Service Gig should now work!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.message.includes('password authentication failed')) {
            console.error('\n   Check your DATABASE_URL in .env file.');
        } else if (error.message.includes('connection refused')) {
            console.error('\n   Unable to connect to database. Check your network.');
        }

        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

applyRLSPolicies();

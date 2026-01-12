#!/usr/bin/env node
/**
 * Upgrade a user to admin role
 * Usage: node scripts/upgrade-to-admin.js <email>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const email = process.argv[2] || 'visa-marine-simile@duck.com';

async function upgradeToAdmin(email) {
    console.log(`\n🔧 Upgrading user to admin: ${email}\n`);

    try {
        // Step 1: Find the user in profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (profileError) {
            console.error('❌ Error finding user profile:', profileError.message);

            // Try to find user in auth.users
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

            if (authError) {
                console.error('❌ Error listing auth users:', authError.message);
                return;
            }

            const authUser = authUsers.users.find(u => u.email === email);
            if (authUser) {
                console.log('✅ Found user in auth.users:', authUser.id);

                // Create profile if it doesn't exist
                const { error: insertError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authUser.id,
                        email: email,
                        name: authUser.user_metadata?.name || 'Admin',
                        role: 'admin',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (insertError) {
                    console.error('❌ Error creating/updating profile:', insertError.message);
                    return;
                }
                console.log('✅ Profile created/updated with admin role');
            } else {
                console.error('❌ User not found in auth.users either');
                return;
            }
        } else {
            console.log('✅ Found user profile:', profile.id);
            console.log('   Current role:', profile.role);
        }

        // Step 2: Update the profile role to admin
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
                role: 'admin',
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select()
            .single();

        if (updateError) {
            console.error('❌ Error updating profile role:', updateError.message);
            return;
        }

        console.log('✅ Profile role updated to: admin');

        // Step 3: Update auth user metadata
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const authUser = authUsers.users.find(u => u.email === email);

        if (authUser) {
            const { error: metaError } = await supabase.auth.admin.updateUserById(
                authUser.id,
                {
                    user_metadata: {
                        ...authUser.user_metadata,
                        role: 'admin'
                    }
                }
            );

            if (metaError) {
                console.error('⚠️ Warning: Could not update auth metadata:', metaError.message);
            } else {
                console.log('✅ Auth user metadata updated');
            }
        }

        console.log('\n🎉 SUCCESS! User has been upgraded to admin.');
        console.log('\n📋 Next steps:');
        console.log('   1. Log out if currently logged in');
        console.log('   2. Log back in with:', email);
        console.log('   3. You will be redirected to /admin dashboard');
        console.log('');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

upgradeToAdmin(email);

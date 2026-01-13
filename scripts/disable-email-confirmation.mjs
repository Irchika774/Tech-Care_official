/**
 * Disable Email Confirmation for Supabase Auth
 * 
 * This script uses the Supabase Management API to disable email confirmation.
 * 
 * To get your access token:
 * 1. Go to https://supabase.com/dashboard/account/tokens
 * 2. Generate a new access token
 * 3. Set it as SUPABASE_ACCESS_TOKEN in .env
 * 
 * Usage: node scripts/disable-email-confirmation.mjs
 */

import dotenv from 'dotenv';

dotenv.config();

const projectRef = 'xfnyzjcgsfbdlphhvcrr'; // Your project reference
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

async function disableEmailConfirmation() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     Supabase - Disable Email Confirmation                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (!accessToken) {
        console.log('⚠️  SUPABASE_ACCESS_TOKEN not found in .env\n');
        console.log('📝 To get your access token:');
        console.log('   1. Go to: https://supabase.com/dashboard/account/tokens');
        console.log('   2. Click "Generate new token"');
        console.log('   3. Add to .env: SUPABASE_ACCESS_TOKEN=your_token_here');
        console.log('   4. Run this script again\n');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔧 MANUAL ALTERNATIVE:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('You can disable email confirmation manually:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/xfnyzjcgsfbdlphhvcrr/auth/providers');
        console.log('   2. Click on "Email" provider');
        console.log('   3. Toggle OFF "Confirm email"');
        console.log('   4. Click "Save"\n');
        return;
    }

    console.log(`📍 Project: ${projectRef}\n`);
    console.log('🔧 Updating auth configuration...\n');

    try {
        // Get current auth config
        const getResponse = await fetch(
            `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!getResponse.ok) {
            const error = await getResponse.text();
            throw new Error(`Failed to get auth config: ${error}`);
        }

        const currentConfig = await getResponse.json();
        console.log('📋 Current Configuration:');
        console.log(`   Enable Signup: ${currentConfig.ENABLE_SIGNUP}`);
        console.log(`   Double Confirm Changes: ${currentConfig.DOUBLE_CONFIRM_CHANGES}`);
        console.log(`   Enable Confirmations: ${currentConfig.ENABLE_CONFIRMATIONS ?? 'N/A'}`);
        console.log(`   Mailer Autoconfirm: ${currentConfig.MAILER_AUTOCONFIRM}`);
        console.log('');

        // Update to disable email confirmation
        const updateResponse = await fetch(
            `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MAILER_AUTOCONFIRM: true,           // Auto-confirm emails
                    ENABLE_SIGNUP: true,                 // Keep signup enabled
                    DOUBLE_CONFIRM_CHANGES: false,       // Don't require double confirmation
                    SECURITY_CAPTCHA_ENABLED: false      // Disable captcha if not needed
                })
            }
        );

        if (!updateResponse.ok) {
            const error = await updateResponse.text();
            throw new Error(`Failed to update auth config: ${error}`);
        }

        const updatedConfig = await updateResponse.json();

        console.log('✅ Configuration updated successfully!\n');
        console.log('📋 New Configuration:');
        console.log(`   Mailer Autoconfirm: ${updatedConfig.MAILER_AUTOCONFIRM}`);
        console.log(`   Enable Signup: ${updatedConfig.ENABLE_SIGNUP}`);
        console.log(`   Double Confirm Changes: ${updatedConfig.DOUBLE_CONFIRM_CHANGES}`);
        console.log('');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 Email confirmation is now DISABLED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Users can now sign up without email verification.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.log('\n⚠️  Access token is invalid or expired.');
            console.log('   Generate a new one at: https://supabase.com/dashboard/account/tokens\n');
        }

        console.log('\n🔧 MANUAL ALTERNATIVE:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/xfnyzjcgsfbdlphhvcrr/auth/providers');
        console.log('   2. Click on "Email" provider');
        console.log('   3. Toggle OFF "Confirm email"');
        console.log('   4. Click "Save"\n');
    }
}

disableEmailConfirmation();

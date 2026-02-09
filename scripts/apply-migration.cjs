#!/usr/bin/env node

/**
 * Apply Supabase Migration Script
 * 
 * This script automatically applies the comprehensive duplicate fix migration
 * to your Supabase database.
 * 
 * Prerequisites:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Link project: supabase link --project-ref <your-project-ref>
 * 
 * Or use this script with environment variables:
 * - SUPABASE_ACCESS_TOKEN (from https://supabase.com/dashboard/account/tokens)
 * - SUPABASE_PROJECT_ID (from your project settings)
 * 
 * Usage:
 *   node scripts/apply-migration.cjs
 *   
 * Options:
 *   --dry-run    Show what would be done without actually applying
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const MIGRATION_FILE = path.join(__dirname, '../supabase/migrations/20260209170000_comprehensive_duplicate_fix.sql');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
    console.log('\n' + '='.repeat(60));
    log(message, 'cyan');
    console.log('='.repeat(60));
}

function logStep(step, message) {
    console.log(`\n${colors.yellow}Step ${step}:${colors.reset} ${message}`);
}

function logSuccess(message) {
    log(`✓ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠ ${message}`, 'yellow');
}

function logError(message) {
    log(`✗ ${message}`, 'red');
}

// Check if file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Read migration file
function readMigrationFile() {
    if (!fileExists(MIGRATION_FILE)) {
        throw new Error(`Migration file not found: ${MIGRATION_FILE}`);
    }
    return fs.readFileSync(MIGRATION_FILE, 'utf8');
}

// Check for Supabase CLI
function checkSupabaseCLI() {
    try {
        execSync('supabase --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

// Run migration using Supabase CLI
function runMigrationCLI() {
    try {
        log('Running migration via Supabase CLI...', 'cyan');

        // Run the migration
        execSync('npx supabase db push', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });

        return true;
    } catch (e) {
        logError(`Failed to run migration via CLI: ${e.message}`);
        return false;
    }
}

// Print migration summary
function printMigrationSummary() {
    logHeader('Migration Summary');

    console.log(`
${colors.green}1. Remove existing duplicates:${colors.reset}
   - Delete duplicate technicians (keep oldest by name/user_id)
   - Delete duplicate customers (keep oldest by name/user_id)

${colors.green}2. Add unique constraints:${colors.reset}
   - technicians.user_id (UNIQUE)
   - technicians.name (case-insensitive UNIQUE index)
   - customers.user_id (UNIQUE)
   - customers.email (case-insensitive UNIQUE index)
   - profiles.id (UNIQUE)
   - profiles.email (case-insensitive UNIQUE index)

${colors.green}3. Create prevention triggers:${colors.reset}
   - Prevent duplicate technician names on INSERT/UPDATE
   - Prevent duplicate technician user_ids on INSERT/UPDATE
   - Prevent duplicate customer emails on INSERT/UPDATE

${colors.green}4. Add utility functions:${colors.reset}
   - find_duplicate_technicians()
   - find_duplicate_customer_emails()
   - find_duplicate_technician_user_ids()
`);
}

// Ask for user confirmation
async function askConfirmation() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('\nDo you want to apply this migration? (yes/no): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

// Main function
async function main() {
    logHeader('Supabase Duplicate Fix Migration');

    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    console.log(`\n${colors.cyan}Migration file:${colors.reset} ${MIGRATION_FILE}`);
    console.log(`${colors.cyan}Mode:${colors.reset} ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);

    try {
        // Read and display migration file
        const sql = readMigrationFile();
        console.log(`${colors.cyan}Migration size:${colors.reset} ${sql.length} bytes`);

        // Print summary
        printMigrationSummary();

        if (dryRun) {
            log('\n🔍 DRY RUN - Showing first 2000 characters of SQL:', 'yellow');
            console.log(sql.substring(0, 2000) + '\n... (truncated)\n');
            logSuccess('Dry run complete. No changes made.');

            console.log(`\n${colors.cyan}To apply the migration, run:${colors.reset}`);
            console.log('   node scripts/apply-migration.cjs\n');
            return;
        }

        // Ask for confirmation
        const confirmed = await askConfirmation();

        if (!confirmed) {
            logWarning('Migration cancelled by user.');
            process.exit(0);
        }

        // Check for Supabase CLI first
        if (checkSupabaseCLI()) {
            log('✓ Supabase CLI found', 'green');
            const success = runMigrationCLI();
            if (success) {
                logSuccess('Migration applied successfully!');
            }
        } else {
            log('⚠ Supabase CLI not found', 'yellow');

            console.log(`\n${colors.cyan}Alternative: Run the SQL manually in Supabase Dashboard:${colors.reset}`);
            console.log('\n1. Open https://supabase.com/dashboard');
            console.log('2. Select your project: tech-care-official-new');
            console.log('3. Go to SQL Editor');
            console.log('4. Copy and paste the contents of:');
            console.log(`   ${MIGRATION_FILE}`);
            console.log('5. Click "Run" (or Ctrl+Enter)\n');

            logWarning('Please apply the migration manually using the steps above.');
        }

    } catch (e) {
        logError(`Error: ${e.message}`);
        process.exit(1);
    }
}

// Run the script
main().catch(console.error);

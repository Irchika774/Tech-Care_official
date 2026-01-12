import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = './test-results/screenshots/approvals';
const REPORT_FILE = './test-results/approval_report.md';

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test Data
// Using hardcoded credentials as seen in comprehensive tests usually
const ADMIN_USER = { email: 'admin@techcare.com', password: 'Admin123!' };

let browser;
let page;
let reportContent = '# 🤖 ADMIN APPROVAL WORKFLOW TEST\n\nDate: ' + new Date().toLocaleString() + '\n\n';

async function log(message, type = 'INFO') {
    const logLine = `[${type}] ${message}`;
    console.log(logLine);
    reportContent += `- **${type}**: ${message}\n`;
}

async function takeScreenshot(name) {
    const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    log(`Screenshot saved: ${filename}`, 'SCREENSHOT');
}

async function runTest() {
    try {
        log('Starting Admin Approval Workflow Test', 'START');

        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 }
        });
        page = await browser.newPage();

        // 1. Admin Login
        log('Logging in as Admin', 'STEP');
        await page.goto(`${BASE_URL}/login`);
        await page.waitForSelector('#email', { visible: true, timeout: 5000 });
        await page.type('#email', ADMIN_USER.email);
        await page.type('#password', ADMIN_USER.password);
        await takeScreenshot('0_login_filled');

        const loginBtn = await page.$('button[type="submit"]');
        if (loginBtn) await loginBtn.click();

        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
        } catch (e) { log('Nav timeout', 'WARN'); }

        log(`Current URL after login attempt: ${page.url()}`, 'INFO');

        if (page.url().includes('/admin')) {
            log('Admin Logged In', 'PASS');
        } else {
            await takeScreenshot('1_login_failure');
            // Don't throw immediately, check if we are just slow
            // Wait for element that only exists in dashboard
            try {
                await page.waitForSelector('h1', { timeout: 2000 }); // "Dashboard" usually
            } catch (e) { }

            if (page.url().includes('/admin')) {
                log('Admin Logged In', 'PASS');
            } else {
                throw new Error(`Admin login failed. URL: ${page.url()}`);
            }
        }

        await takeScreenshot('1_admin_dashboard');

        // 2. Select Service Approvals Tab
        log('Navigating to Service Approvals', 'STEP');
        try {
            const tabs = await page.$x("//button[contains(., 'Service Approvals')]");
            if (tabs.length > 0) {
                await tabs[0].click();
                await new Promise(r => setTimeout(r, 1000));
                log('Clicked Service Approvals Tab', 'PASS');
                await takeScreenshot('2_approvals_tab');
            } else {
                log('Service Approvals tab not found in DOM', 'WARN');
                // Maybe it's under matched text
            }
        } catch (e) {
            log(`Failed to navigate tabs: ${e.message}`, 'WARN');
        }

        // 3. Check for Pending Gigs
        log('Checking for Pending Gigs', 'STEP');
        await takeScreenshot('3_pending_gigs_list');

        // 4. Attempt to Approve first pending gig
        const approveBtns = await page.$x("//button[contains(., 'Approve')]");
        if (approveBtns.length > 0) {
            log(`Found ${approveBtns.length} approve buttons`, 'INFO');
            await approveBtns[0].click();
            await new Promise(r => setTimeout(r, 2000));
            log('Clicked Approve on first gig', 'PASS');
            await takeScreenshot('4_after_approval');
        } else {
            log('No pending gigs to approve found', 'INFO');
        }

    } catch (error) {
        log(`Test failed: ${error.message}`, 'ERROR');
        console.error(error);
    } finally {
        if (browser) await browser.close();
        fs.writeFileSync(REPORT_FILE, reportContent);
        console.log(`Report saved to ${REPORT_FILE}`);
    }
}

runTest();

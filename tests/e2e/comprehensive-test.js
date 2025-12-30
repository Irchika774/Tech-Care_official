import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = './test-results/screenshots';
const REPORT_FILE = './test-results/report.md';

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Test Data
const ADMIN_USER = { email: 'admin@techcare.com', password: 'Admin123!' };
const CUSTOMER_USER = { email: 'customer@test.com', password: 'Test123!' };
const TECH_USER = {
    name: 'Auto Test Tech',
    email: `tech.auto.${Date.now()}@test.com`,
    password: 'Test123!'
};

let browser;
let page;
let reportContent = '# 🤖 AUTOMATED E2E TEST REPORT\n\nDate: ' + new Date().toLocaleString() + '\n\n';

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
        log('Starting Comprehensive E2E Test Suite', 'START');

        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 }
        });
        page = await browser.newPage();

        // --- TEST SUITE 1: PUBLIC ACCESS ---
        log('Testing Public Access', 'SUITE');

        await page.goto(BASE_URL);
        await page.waitForSelector('nav'); // Wait for header
        log('Homepage loaded successfully', 'PASS');
        await takeScreenshot('homepage');

        await page.goto(`${BASE_URL}/mobile-repair`);
        await page.waitForSelector('h1'); // Wait for title
        log('Mobile Repair page loaded', 'PASS');
        await takeScreenshot('mobile_repair_page');

        // --- TEST SUITE 2: ADMIN ROLE ---
        log('Testing Admin Role', 'SUITE');

        await page.goto(`${BASE_URL}/login`);

        // Wait for form to animate in
        await page.waitForSelector('#email', { visible: true });

        await page.type('#email', ADMIN_USER.email);
        await page.type('#password', ADMIN_USER.password);
        await takeScreenshot('admin_login_filled');

        // Click login button
        const loginBtn = await page.$('button[type="submit"]');
        if (loginBtn) await loginBtn.click();

        // Wait for navigation specifically to /admin
        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        } catch (e) {
            log('Navigation timeout, checking URL anyway', 'WARN');
        }

        // Verify Admin Dashboard
        if (page.url().includes('/admin')) {
            log('Admin login successful - Redirected to /admin', 'PASS');
            try {
                await page.waitForSelector('.text-3xl', { timeout: 5000 });
                log('Dashboard stats visible', 'PASS');
            } catch (e) {
                log('Dashboard stats not found immediately', 'WARN');
            }
            await takeScreenshot('admin_dashboard');
        } else {
            log(`Admin login failed - URL is ${page.url()}`, 'FAIL');
        }

        // Test Admin Navigation
        await page.goto(`${BASE_URL}/customer-dashboard`);
        if (page.url().includes('/customer-dashboard')) {
            log('Admin can access Customer Dashboard', 'PASS');
            await takeScreenshot('admin_viewing_customer_dash');
        } else {
            log('Admin failed to access Customer Dashboard', 'FAIL');
        }

        // Logout
        await page.evaluate(() => localStorage.clear());
        await page.goto(`${BASE_URL}/login`);
        log('Logged out Admin', 'INFO');

        // --- TEST SUITE 3: CUSTOMER ROLE ---
        log('Testing Customer Role', 'SUITE');

        await page.goto(`${BASE_URL}/login`);
        await page.waitForSelector('#email', { visible: true });

        await page.type('#email', CUSTOMER_USER.email);
        await page.type('#password', CUSTOMER_USER.password);

        const custLoginBtn = await page.$('button[type="submit"]');
        if (custLoginBtn) await custLoginBtn.click();

        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        } catch (e) { }

        if (page.url().includes('/customer-dashboard')) {
            log('Customer login successful', 'PASS');
            try {
                await page.waitForSelector('.text-3xl', { timeout: 5000 });
            } catch (e) { }
            await takeScreenshot('customer_dashboard');
        } else {
            log(`Customer login failed - URL is ${page.url()}`, 'FAIL');
        }

        // Logout
        await page.evaluate(() => localStorage.clear());
        log('Logged out Customer', 'INFO');

        // --- TEST SUITE 4: TECHNICIAN REGISTRATION ---
        log('Testing Technician Registration', 'SUITE');

        await page.goto(`${BASE_URL}/register`);
        await page.waitForSelector('#name', { visible: true });

        await page.type('#name', TECH_USER.name);
        await page.type('#email', TECH_USER.email);
        await page.type('#password', TECH_USER.password);
        await page.type('#confirmPassword', TECH_USER.password);

        // Select Technician Role
        try {
            await page.click('#technician');
            log('Selected Technician role via ID', 'INFO');
        } catch (e) {
            const techLabel = await page.$('label[for="technician"]');
            if (techLabel) {
                await techLabel.click();
                log('Selected Technician role via Label', 'INFO');
            } else {
                log('Could not find Technician role selector', 'WARN');
            }
        }

        await takeScreenshot('technician_registration_filled');

        const regBtn = await page.$('button[type="submit"]');
        if (regBtn) await regBtn.click();

        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        } catch (e) { }

        log(`Registration submitted. Current URL: ${page.url()}`, 'INFO');

        // Login as new Technician
        await page.goto(`${BASE_URL}/login`);
        await page.waitForSelector('#email', { visible: true });

        await page.type('#email', TECH_USER.email);
        await page.type('#password', TECH_USER.password);

        const techLoginBtn = await page.$('button[type="submit"]');
        if (techLoginBtn) await techLoginBtn.click();

        try {
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        } catch (e) { }

        if (page.url().includes('/technician-dashboard')) {
            log('Technician login successful', 'PASS');
            try {
                await page.waitForSelector('.text-3xl', { timeout: 5000 });
            } catch (e) { }
            await takeScreenshot('technician_dashboard');
        } else {
            log(`Technician login failed - URL is ${page.url()}`, 'FAIL');
        }

        // --- TEST SUITE 5: GUEST ACCESS ---
        log('Testing Guest Access Protection', 'SUITE');
        await page.evaluate(() => localStorage.clear()); // Logout

        await page.goto(`${BASE_URL}/admin`);
        // Wait a bit for redirect
        await new Promise(r => setTimeout(r, 2000));

        if (page.url().includes('/login')) {
            log('Guest redirected from /admin to /login', 'PASS');
        } else {
            log(`Guest NOT redirected from /admin - URL: ${page.url()}`, 'FAIL');
        }

    } catch (error) {
        log(`Test failed with error: ${error.message}`, 'ERROR');
        console.error(error);
    } finally {
        if (browser) await browser.close();
        fs.writeFileSync(REPORT_FILE, reportContent);
        console.log(`\nReport saved to ${REPORT_FILE}`);
    }
}

runTest();

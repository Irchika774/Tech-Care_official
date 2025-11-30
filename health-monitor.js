import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const CHECK_INTERVAL = 30000; // 30 seconds
const SERVER_DIR = join(__dirname, 'server');

let backendProcess = null;
let isRestarting = false;

// ANSI color codes for console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    const timestamp = new Date().toLocaleString();
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

function checkBackendHealth() {
    return new Promise((resolve) => {
        const req = http.get(`${BACKEND_URL}/api/health`, (res) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

function startBackend() {
    if (isRestarting) {
        log('Already restarting backend...', colors.yellow);
        return;
    }

    isRestarting = true;
    log('Starting backend server...', colors.blue);

    backendProcess = spawn('npm', ['run', 'dev'], {
        cwd: SERVER_DIR,
        shell: true,
        stdio: 'inherit'
    });

    backendProcess.on('error', (error) => {
        log(`Failed to start backend: ${error.message}`, colors.red);
        isRestarting = false;
    });

    backendProcess.on('exit', (code, signal) => {
        if (code !== null) {
            log(`Backend exited with code ${code}`, colors.yellow);
        }
        if (signal) {
            log(`Backend killed with signal ${signal}`, colors.yellow);
        }
        backendProcess = null;
        isRestarting = false;
    });

    // Give the server time to start
    setTimeout(() => {
        isRestarting = false;
        log('Backend start command executed', colors.green);
    }, 3000);
}

function stopBackend() {
    if (backendProcess) {
        log('Stopping backend server...', colors.yellow);
        backendProcess.kill('SIGTERM');
        backendProcess = null;
    }
}

async function monitorBackend() {
    try {
        const isHealthy = await checkBackendHealth();

        if (isHealthy) {
            log('✓ Backend is healthy', colors.green);
        } else {
            log('✗ Backend is offline! Attempting to restart...', colors.red);
            stopBackend();
            startBackend();
        }
    } catch (error) {
        log(`Error during health check: ${error.message}`, colors.red);
    }
}

// Handle graceful shutdown
function handleShutdown() {
    log('Shutting down health monitor...', colors.cyan);
    stopBackend();
    process.exit(0);
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start monitoring
log('╔════════════════════════════════════════════╗', colors.cyan);
log('║   TechCare Backend Health Monitor v1.0    ║', colors.cyan);
log('╚════════════════════════════════════════════╝', colors.cyan);
log(`Monitoring backend at ${BACKEND_URL}`, colors.cyan);
log(`Check interval: ${CHECK_INTERVAL / 1000} seconds`, colors.cyan);
log('Press Ctrl+C to stop monitoring\n', colors.cyan);

// Start the backend initially
startBackend();

// Wait a bit before first health check
setTimeout(() => {
    // Perform initial check
    monitorBackend();

    // Then check every interval
    setInterval(monitorBackend, CHECK_INTERVAL);
}, 5000);

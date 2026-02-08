#!/usr/bin/env node

/**
 * Production Verification Script
 * Checks if the Takkunu PDF deployment is healthy
 */

const https = require('https');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://takkunu-pdf.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://takkunu-pdf-server.onrender.com';

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkUrl(url, expectedStatus = 200) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === expectedStatus) {
                    resolve({ success: true, status: res.statusCode, data });
                } else {
                    reject({ success: false, status: res.statusCode, data });
                }
            });
        }).on('error', (err) => {
            reject({ success: false, error: err.message });
        });
    });
}

async function verifyDeployment() {
    log('\n🔍 Takkunu PDF - Production Verification\n', 'blue');
    log('━'.repeat(50), 'blue');

    let allPassed = true;

    // Check Frontend
    log('\n📱 Frontend Checks', 'yellow');
    try {
        await checkUrl(FRONTEND_URL);
        log('✅ Frontend is accessible', 'green');
    } catch (err) {
        log(`❌ Frontend check failed: ${err.error || err.status}`, 'red');
        allPassed = false;
    }

    // Check Backend Health
    log('\n🔧 Backend Checks', 'yellow');
    try {
        const result = await checkUrl(`${BACKEND_URL}/healthz`);
        log('✅ Backend health check passed', 'green');
    } catch (err) {
        log(`❌ Backend health check failed: ${err.error || err.status}`, 'red');
        allPassed = false;
    }

    // Check Backend API
    try {
        const result = await checkUrl(`${BACKEND_URL}/`);
        const data = JSON.parse(result.data);
        if (data.service === 'Takkunu PDF Backend' && data.status === 'active') {
            log('✅ Backend API is responding correctly', 'green');
            log(`   Version: ${data.version}`, 'blue');
        } else {
            log('⚠️  Backend API response unexpected', 'yellow');
        }
    } catch (err) {
        log(`❌ Backend API check failed: ${err.error || err.status}`, 'red');
        allPassed = false;
    }

    // Summary
    log('\n' + '━'.repeat(50), 'blue');
    if (allPassed) {
        log('\n✅ All checks passed! Deployment is healthy.\n', 'green');
        process.exit(0);
    } else {
        log('\n❌ Some checks failed. Please review the errors above.\n', 'red');
        process.exit(1);
    }
}

// Run verification
verifyDeployment().catch((err) => {
    log(`\n❌ Verification failed: ${err.message}\n`, 'red');
    process.exit(1);
});

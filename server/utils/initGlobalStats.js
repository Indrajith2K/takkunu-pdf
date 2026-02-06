const GlobalStats = require('../models/GlobalStats');

/**
 * Initialize global stats document on server startup
 * Idempotent - safe to call on every restart
 */
async function initGlobalStats() {
    try {
        await GlobalStats.getSingleton();
        console.log('✅ Global stats initialized');
    } catch (error) {
        console.error('⚠️ Failed to initialize global stats:', error.message);
    }
}

module.exports = initGlobalStats;

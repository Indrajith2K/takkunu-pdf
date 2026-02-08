const GlobalStats = require('../models/GlobalStats');

/**
 * Fire-and-forget atomic increment
 * Never throws, never blocks request flow
 */
function incrementApiHit() {
    // Non-blocking, async fire-and-forget
    setImmediate(() => {
        GlobalStats.incrementHit().catch(err => {
            // Silent fail - analytics should never break user requests
            console.error('Analytics increment failed (non-critical):', err.message);
        });
    });
}

module.exports = incrementApiHit;

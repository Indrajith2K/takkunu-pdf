const express = require('express');
const router = express.Router();
const GlobalStats = require('../models/GlobalStats');

// GET /api/stats/global-activity
router.get('/global-activity', async (req, res) => {
    try {
        const stats = await GlobalStats.getSingleton();
        res.json({
            total: stats.totalApiHits || 0
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({
            total: 0,
            error: 'Failed to fetch stats'
        });
    }
});

module.exports = router;

const mongoose = require('mongoose');

const globalStatsSchema = new mongoose.Schema({
    totalApiHits: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true,
    collection: 'globalstats'
});

// Singleton pattern - only one document should exist
globalStatsSchema.statics.getSingleton = async function () {
    let stats = await this.findOne();
    if (!stats) {
        stats = await this.create({ totalApiHits: 0 });
    }
    return stats;
};

// Atomic increment
globalStatsSchema.statics.incrementHit = async function () {
    try {
        await this.updateOne(
            {},
            { $inc: { totalApiHits: 1 } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Failed to increment API hit (non-blocking):', error.message);
    }
};

module.exports = mongoose.model('GlobalStats', globalStatsSchema);

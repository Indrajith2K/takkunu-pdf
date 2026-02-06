const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const initGlobalStats = require('./utils/initGlobalStats');

const pdfRoutes = require('./routes/pdf.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// MongoDB Connection (Non-blocking)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/takkunu-pdf';
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(async () => {
        console.log('✅ MongoDB Connected');
        await initGlobalStats();
    })
    .catch(err => {
        console.error('⚠️ MongoDB Connection Failed (non-critical):', err.message);
    });

// Security & Middleware
app.use(helmet());
app.use(cors({
    origin: '*', // Open for students, can be restricted later
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check (Critical for Render)
app.get('/healthz', (req, res) => {
    res.status(200).send('ok');
});

// Root Route
app.get('/', (req, res) => {
    res.json({
        service: 'Takkunu PDF Backend',
        status: 'active',
        version: '1.0.0'
    });
});

// PDF Routes
app.use('/api/pdf', pdfRoutes);

// Stats Routes
app.use('/api/stats', statsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);

    // Cleanup files if request fails and files were uploaded
    if (req.files) {
        req.files.forEach(file => {
            fs.unlink(file.path, () => { });
        });
    }

    res.status(500).json({
        error: true,
        message: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;

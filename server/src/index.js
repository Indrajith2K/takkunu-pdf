// Main Server File - takkunu pdf Backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import convertRoutes from './routes/convertRoutes.js';
import organizeRoutes from './routes/organizeRoutes.js';
import { cleanupOldFiles } from './utils/fileCleanup.js';

// Load environment variables
dotenv.config();

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'takkunu-pdf-api'
    });
});

// API Routes
app.use('/api/convert', convertRoutes);
app.use('/api/organize', organizeRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'takkunu pdf API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            convert: '/api/convert',
            organize: '/api/organize'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 takkunu pdf API Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📄 Convert API: http://localhost:${PORT}/api/convert`);
    console.log(`🗂  Organize API: http://localhost:${PORT}/api/organize`);
    console.log('='.repeat(50));

    // Start cleanup job (runs every 5 minutes)
    setInterval(() => {
        cleanupOldFiles();
    }, 5 * 60 * 1000);

    // Run initial cleanup
    cleanupOldFiles();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    process.exit(0);
});

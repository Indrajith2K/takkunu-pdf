const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Graceful Shutdown
const gracefulShutdown = () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

server.listen(PORT, () => {
    console.log(`
    🚀 Takkunu PDF Backend running
    ------------------------------
    PORT:   ${PORT}
    ENV:    ${process.env.NODE_ENV || 'development'}
    ------------------------------
    `);
});

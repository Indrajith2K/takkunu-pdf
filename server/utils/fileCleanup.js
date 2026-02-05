const fs = require('fs');

/**
 * Deletes a file from the filesystem asynchronously
 * @param {string} filePath - Absolute path to file
 */
const cleanupFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            // console.log(`Cleaned up: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error.message);
    }
};

/**
 * Cleans up multiple files
 * @param {Array} filePaths - Array of file paths
 */
const cleanupFiles = async (filePaths) => {
    if (!filePaths || filePaths.length === 0) return;

    await Promise.all(filePaths.map(path => cleanupFile(path)));
};

module.exports = {
    cleanupFile,
    cleanupFiles
};

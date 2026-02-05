// File Cleanup Utility
// Automatically deletes files older than 5 minutes from temp directory

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, '../../temp');
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clean up old files from temp directory
 */
export const cleanupOldFiles = async () => {
    try {
        console.log('[Cleanup] Starting file cleanup...');

        const files = await fs.readdir(TEMP_DIR);
        const now = Date.now();
        let deletedCount = 0;

        for (const file of files) {
            // Skip .gitkeep file
            if (file === '.gitkeep') continue;

            const filePath = path.join(TEMP_DIR, file);

            try {
                const stats = await fs.stat(filePath);
                const age = now - stats.mtimeMs;

                if (age > MAX_AGE_MS) {
                    await fs.unlink(filePath);
                    deletedCount++;
                    console.log(`[Cleanup] Deleted: ${file} (age: ${Math.round(age / 1000 / 60)}min)`);
                }
            } catch (err) {
                // File might have been deleted already, skip
                console.error(`[Cleanup] Error processing ${file}:`, err.message);
            }
        }

        console.log(`[Cleanup] Completed. Deleted ${deletedCount} file(s)`);
    } catch (error) {
        console.error('[Cleanup] Error during cleanup:', error);
    }
};

/**
 * Delete a specific file
 */
export const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log(`[Cleanup] Deleted file: ${filePath}`);
    } catch (error) {
        console.error(`[Cleanup] Failed to delete ${filePath}:`, error.message);
    }
};

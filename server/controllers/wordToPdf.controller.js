const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cleanupFile } = require('../utils/fileCleanup');
const incrementApiHit = require('../utils/incrementApiHit');

exports.wordToPdf = async (req, res) => {
    incrementApiHit(); // Track engagement immediately

    let outputFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a Word (.docx) file.' });
        }

        const inputPath = req.file.path;
        const outputDir = path.dirname(inputPath);
        // LibreOffice output name logic: same filename but with .pdf
        const outputFileName = path.basename(inputPath, path.extname(inputPath)) + '.pdf';
        outputFilePath = path.join(outputDir, outputFileName);

        // Command: soffice --headless --convert-to pdf --outdir <dir> <input>
        const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error('LibreOffice Execution Error:', error);
                await cleanupFile(inputPath);
                return res.status(500).json({ error: 'Conversion failed during processing.' });
            }

            if (!fs.existsSync(outputFilePath)) {
                console.error('Output file missing after conversion.');
                await cleanupFile(inputPath);
                return res.status(500).json({ error: 'Conversion result not found.' });
            }

            // Send file
            res.download(outputFilePath, 'takkunu-converted.pdf', async (err) => {
                if (err) console.error('Download Error:', err);
                // Cleanup
                await cleanupFile(inputPath);
                await cleanupFile(outputFilePath);
            });
        });

    } catch (error) {
        console.error('Word to PDF Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (outputFilePath) await cleanupFile(outputFilePath);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

<<<<<<< HEAD
const docxConverter = require('docx-pdf');
const path = require('path');
const { cleanupFile } = require('../utils/fileCleanup');

exports.wordToPdf = async (req, res) => {
=======
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cleanupFile } = require('../utils/fileCleanup');
const incrementApiHit = require('../utils/incrementApiHit');

exports.wordToPdf = async (req, res) => {
    incrementApiHit(); // Track engagement immediately

>>>>>>> feature/study-mode-improvements
    let outputFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a Word (.docx) file.' });
        }

<<<<<<< HEAD
        const fileName = `converted-${Date.now()}.pdf`;
        outputFilePath = path.join(__dirname, '../temp', fileName);

        // Convert DOCX to PDF
        docxConverter(req.file.path, outputFilePath, async (err, result) => {
            if (err) {
                console.error('DOCX Conversion Error:', err);
                await cleanupFile(req.file.path);
                return res.status(500).json({ error: 'Conversion failed. Please ensure the file is a valid .docx document.' });
            }

            res.download(outputFilePath, 'takkunu-converted.pdf', async (downloadErr) => {
                if (downloadErr) console.error(downloadErr);
                await cleanupFile(req.file.path);
=======
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
>>>>>>> feature/study-mode-improvements
                await cleanupFile(outputFilePath);
            });
        });

    } catch (error) {
        console.error('Word to PDF Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (outputFilePath) await cleanupFile(outputFilePath);
<<<<<<< HEAD
        res.status(500).json({ error: 'Internal server error during conversion.' });
=======
        res.status(500).json({ error: 'Internal server error.' });
>>>>>>> feature/study-mode-improvements
    }
};

const docxConverter = require('docx-pdf');
const path = require('path');
const { cleanupFile } = require('../utils/fileCleanup');

exports.wordToPdf = async (req, res) => {
    let outputFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a Word (.docx) file.' });
        }

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
                await cleanupFile(outputFilePath);
            });
        });

    } catch (error) {
        console.error('Word to PDF Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (outputFilePath) await cleanupFile(outputFilePath);
        res.status(500).json({ error: 'Internal server error during conversion.' });
    }
};

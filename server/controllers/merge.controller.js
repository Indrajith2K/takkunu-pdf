const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { cleanupFiles, cleanupFile } = require('../utils/fileCleanup');

exports.mergePdfs = async (req, res) => {
    let outputFilePath = null;
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
        }

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Loop through uploaded files and merge them
        for (const file of req.files) {
            const pdfBytes = await fs.promises.readFile(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Save merged PDF
        const pdfBytes = await mergedPdf.save();
        const fileName = `merged-${Date.now()}.pdf`;
        outputFilePath = path.join(__dirname, '../temp', fileName);

        await fs.promises.writeFile(outputFilePath, pdfBytes);

        // Send file to user
        res.download(outputFilePath, 'takkunu-merged.pdf', async (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) res.status(500).send('Error downloading file');
            }
            // Cleanup input files and output file
            await cleanupFiles(req.files.map(f => f.path));
            await cleanupFile(outputFilePath);
        });

    } catch (error) {
        console.error('Merge Error:', error);
        // Cleanup on error
        if (req.files) await cleanupFiles(req.files.map(f => f.path));
        if (outputFilePath) await cleanupFile(outputFilePath);

        res.status(500).json({ error: 'Failed to merge PDFs. One or more files might be corrupted.' });
    }
};

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { cleanupFile } = require('../utils/fileCleanup');
const incrementApiHit = require('../utils/incrementApiHit');

exports.splitPdf = async (req, res) => {
    incrementApiHit(); // Track engagement immediately

    let zipPath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file.' });
        }

        const pdfBytes = await fs.promises.readFile(req.file.path);
        const sourcePdf = await PDFDocument.load(pdfBytes);
        const pageCount = sourcePdf.getPageCount();

        // Create a ZIP stream
        const zipName = `split-${Date.now()}.zip`;
        zipPath = path.join(__dirname, '../temp', zipName);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            // Send ZIP to user
            res.download(zipPath, 'takkunu-split.zip', async (err) => {
                // Cleanup
                await cleanupFile(req.file.path);
                await cleanupFile(zipPath);
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // Split pages and add to zip
        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
            newPdf.addPage(copiedPage);

            const pdfBuffer = await newPdf.save();
            archive.append(Buffer.from(pdfBuffer), { name: `page-${i + 1}.pdf` });
        }

        await archive.finalize();

    } catch (error) {
        console.error('Split Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (zipPath) await cleanupFile(zipPath);
        res.status(500).json({ error: 'Failed to split PDF.' });
    }
};

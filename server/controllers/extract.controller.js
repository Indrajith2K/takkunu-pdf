const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { cleanupFile } = require('../utils/fileCleanup');

exports.extractPages = async (req, res) => {
    let outputFilePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file.' });
        }

        const pageRange = req.body.pages; // e.g., "1,3,5-7"
        if (!pageRange) {
            return res.status(400).json({ error: 'Page range is required (e.g., "1,3-5").' });
        }

        const pdfBytes = await fs.promises.readFile(req.file.path);
        const sourcePdf = await PDFDocument.load(pdfBytes);
        const totalPages = sourcePdf.getPageCount();

        // Parse page range string to array of indices (0-based)
        const pagesToExtract = parsePageRange(pageRange, totalPages);

        if (pagesToExtract.length === 0) {
            return res.status(400).json({ error: 'Invalid page range selected.' });
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBuffer = await newPdf.save();
        const fileName = `extracted-${Date.now()}.pdf`;
        outputFilePath = path.join(__dirname, '../temp', fileName);

        await fs.promises.writeFile(outputFilePath, pdfBuffer);

        res.download(outputFilePath, 'takkunu-extracted.pdf', async (err) => {
            await cleanupFile(req.file.path);
            await cleanupFile(outputFilePath);
        });

    } catch (error) {
        console.error('Extract Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (outputFilePath) await cleanupFile(outputFilePath);
        res.status(500).json({ error: 'Failed to extract pages.' });
    }
};

// Helper: Parse "1,3-5" to [0, 2, 3, 4]
function parsePageRange(rangeStr, maxPages) {
    const pages = new Set();
    const parts = rangeStr.split(',');

    parts.forEach(part => {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPages) pages.add(i - 1);
                }
            }
        } else {
            const page = parseInt(part.trim());
            if (!isNaN(page) && page > 0 && page <= maxPages) {
                pages.add(page - 1);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

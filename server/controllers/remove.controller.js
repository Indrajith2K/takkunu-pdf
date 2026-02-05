const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { cleanupFile } = require('../utils/fileCleanup');

exports.removePages = async (req, res) => {
    let outputFilePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file.' });
        }

        const pagesToRemoveStr = req.body.pages; // e.g., "1,2"
        if (!pagesToRemoveStr) {
            return res.status(400).json({ error: 'Pages to remove are required.' });
        }

        const pdfBytes = await fs.promises.readFile(req.file.path);
        const sourcePdf = await PDFDocument.load(pdfBytes);
        const totalPages = sourcePdf.getPageCount();

        // Identify pages to KEEP
        // 1. Get indices of pages to REMOVE
        const pagesToRemove = parsePageList(pagesToRemoveStr, totalPages);

        // 2. Filter existing pages
        const pagesToKeep = [];
        for (let i = 0; i < totalPages; i++) {
            if (!pagesToRemove.has(i)) {
                pagesToKeep.push(i);
            }
        }

        if (pagesToKeep.length === 0) {
            return res.status(400).json({ error: 'Cannot remove all pages from the PDF.' });
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBuffer = await newPdf.save();
        const fileName = `cleaned-${Date.now()}.pdf`;
        outputFilePath = path.join(__dirname, '../temp', fileName);

        await fs.promises.writeFile(outputFilePath, pdfBuffer);

        res.download(outputFilePath, 'takkunu-cleaned.pdf', async (err) => {
            await cleanupFile(req.file.path);
            await cleanupFile(outputFilePath);
        });

    } catch (error) {
        console.error('Remove Pages Error:', error);
        if (req.file) await cleanupFile(req.file.path);
        if (outputFilePath) await cleanupFile(outputFilePath);
        res.status(500).json({ error: 'Failed to remove pages.' });
    }
};

function parsePageList(str, maxPages) {
    const pages = new Set();
    const parts = str.split(',').map(s => s.trim());

    parts.forEach(part => {
        const page = parseInt(part);
        if (!isNaN(page) && page > 0 && page <= maxPages) {
            pages.add(page - 1);
        }
    });
    return pages;
}

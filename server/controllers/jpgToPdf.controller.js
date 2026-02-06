const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { cleanupFiles, cleanupFile } = require('../utils/fileCleanup');
const incrementApiHit = require('../utils/incrementApiHit');

exports.jpgToPdf = async (req, res) => {
    incrementApiHit(); // Track engagement immediately

    let outputFilePath = null;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image.' });
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of req.files) {
            const imageBytes = await fs.promises.readFile(file.path);
            let image;

            try {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.mimetype === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    continue;
                }

                // Add page matching image dimensions
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            } catch (embedError) {
                console.error(`Failed to embed image ${file.originalname}:`, embedError.message);
            }
        }

        if (pdfDoc.getPageCount() === 0) {
            // Cleanup if no pages were added
            await cleanupFiles(req.files.map(f => f.path));
            return res.status(400).json({ error: 'No valid images could be converted.' });
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `images-to-pdf-${Date.now()}.pdf`;
        outputFilePath = path.join(__dirname, '../temp', fileName);

        await fs.promises.writeFile(outputFilePath, pdfBytes);

        res.download(outputFilePath, 'takkunu-images.pdf', async (err) => {
            if (err) console.error(err);
            await cleanupFiles(req.files.map(f => f.path));
            await cleanupFile(outputFilePath);
        });

    } catch (error) {
        console.error('JPG to PDF Error:', error);
        if (req.files) await cleanupFiles(req.files.map(f => f.path));
        if (outputFilePath) await cleanupFile(outputFilePath);
        res.status(500).json({ error: 'Failed to convert images to PDF.' });
    }
};

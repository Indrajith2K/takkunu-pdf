const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const { cleanupFiles, cleanupFile } = require('../utils/fileCleanup');

exports.jpgToPdf = async (req, res) => {
    let outputFilePath = null;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image.' });
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of req.files) {
            const imageBytes = await fs.promises.readFile(file.path);
            let image;

            // Check image type and embed accordingly
            const dimensions = sizeOf(file.path);
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (file.mimetype === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                continue; // Skip unsupported formats if any slip through
            }

            // Add page matching image dimensions
            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
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

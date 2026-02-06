const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { cleanupFile, cleanupFiles } = require('../utils/fileCleanup');

exports.pdfToJpg = async (req, res) => {
    let outputZipPath = null;
    let generatedImages = [];
    const inputPath = req.file ? req.file.path : null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file.' });
        }

        const outputDir = path.dirname(inputPath);
        const baseName = path.basename(inputPath, path.extname(inputPath));
        const outputPrefix = path.join(outputDir, `${baseName}-page`);

        // 1. Convert PDF to JPGs using pdftoppm
        // -jpeg: Output format
        // -r 150: Resolution (150 DPI is good balance for speed/quality)
        const command = `pdftoppm -jpeg -r 150 "${inputPath}" "${outputPrefix}"`;

        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('pdftoppm error:', stderr);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // 2. Identify generated files
        const allFiles = await fs.promises.readdir(outputDir);
        generatedImages = allFiles
            .filter(file => file.startsWith(`${baseName}-page`) && file.endsWith('.jpg'))
            .map(file => path.join(outputDir, file));

        if (generatedImages.length === 0) {
            throw new Error('No images were generated.');
        }

        // 3. Create ZIP
        const zipName = `images-${Date.now()}.zip`;
        outputZipPath = path.join(outputDir, zipName);
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            // 4. Send Response
            res.download(outputZipPath, 'takkunu-images.zip', async (err) => {
                if (err) console.error('Download error:', err);

                // 5. Cleanup
                const filesToDelete = [inputPath, outputZipPath, ...generatedImages];
                await cleanupFiles(filesToDelete);
            });
        });

        archive.on('error', async (err) => {
            throw err;
        });

        archive.pipe(output);

        // Append images to zip
        generatedImages.forEach(img => {
            archive.file(img, { name: path.basename(img) });
        });

        await archive.finalize();

    } catch (error) {
        console.error('PDF to JPG Error:', error);

        // Cleanup all potential files
        const filesToDelete = [inputPath];
        if (outputZipPath) filesToDelete.push(outputZipPath);
        if (generatedImages.length > 0) filesToDelete.push(...generatedImages);

        await cleanupFiles(filesToDelete);

        res.status(500).json({ error: 'Failed to convert PDF to images.' });
    }
};

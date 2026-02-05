// Convert Service - PDF/Document/Image Conversion Logic
// This service uses open-source tools for conversion operations

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert PDF to Word using LibreOffice
 * Command: libreoffice --headless --convert-to docx input.pdf --outdir output/
 */
export const pdfToWord = async (inputPath) => {
    const outputDir = path.dirname(inputPath);
    const filename = path.basename(inputPath, '.pdf') + '.docx';

    try {
        // Using LibreOffice in headless mode
        const command = `libreoffice --headless --convert-to docx "${inputPath}" --outdir "${outputDir}"`;

        await execAsync(command, { timeout: 60000 });

        const outputPath = path.join(outputDir, filename);

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('PDF to Word conversion error:', error);
        throw new Error('Failed to convert PDF to Word. Ensure the PDF contains extractable text.');
    }
};

/**
 * Convert Word to PDF using LibreOffice
 * Command: libreoffice --headless --convert-to pdf input.docx --outdir output/
 */
export const wordToPdf = async (inputPath) => {
    const outputDir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const filename = path.basename(inputPath, ext) + '.pdf';

    try {
        const command = `libreoffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

        await execAsync(command, { timeout: 60000 });

        const outputPath = path.join(outputDir, filename);

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('Word to PDF conversion error:', error);
        throw new Error('Failed to convert Word to PDF');
    }
};

/**
 * Convert JPG to PDF using ImageMagick
 * Command: convert input.jpg output.pdf
 */
export const jpgToPdf = async (inputPath) => {
    const outputDir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const filename = path.basename(inputPath, ext) + '.pdf';
    const outputPath = path.join(outputDir, filename);

    try {
        // Using ImageMagick convert command
        const command = `magick convert "${inputPath}" "${outputPath}"`;

        await execAsync(command, { timeout: 30000 });

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('JPG to PDF conversion error:', error);
        throw new Error('Failed to convert JPG to PDF');
    }
};

/**
 * Convert PDF to JPG using Poppler's pdftoppm
 * Command: pdftoppm -jpeg -r 300 input.pdf output
 */
export const pdfToJpg = async (inputPath) => {
    const outputDir = path.dirname(inputPath);
    const basename = path.basename(inputPath, '.pdf');
    const outputPrefix = path.join(outputDir, basename);

    try {
        // Using pdftoppm from Poppler utils
        const command = `pdftoppm -jpeg -r 150 "${inputPath}" "${outputPrefix}"`;

        await execAsync(command, { timeout: 60000 });

        // Check if multiple pages (will have -1.jpg, -2.jpg, etc.)
        const files = await fs.readdir(outputDir);
        const jpgFiles = files.filter(f => f.startsWith(basename) && f.endsWith('.jpg'));

        if (jpgFiles.length === 1) {
            // Single page PDF
            const outputPath = path.join(outputDir, jpgFiles[0]);
            return {
                outputPath,
                filename: basename + '.jpg',
                isZip: false
            };
        } else {
            // Multiple pages - would need to zip them
            // For MVP, return first page or create zip (implementation needed)
            const outputPath = path.join(outputDir, jpgFiles[0]);
            return {
                outputPath,
                filename: jpgFiles[0],
                isZip: false
            };
        }
    } catch (error) {
        console.error('PDF to JPG conversion error:', error);
        throw new Error('Failed to convert PDF to JPG');
    }
};

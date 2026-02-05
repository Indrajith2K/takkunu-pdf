// Organize Service - PDF Organization Operations
// This service uses open-source PDF manipulation tools

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Merge multiple PDF files into one
 * Command: pdfunite input1.pdf input2.pdf output.pdf
 * OR: qpdf --empty --pages *.pdf -- output.pdf
 */
export const mergePdf = async (inputPaths) => {
    const outputDir = path.dirname(inputPaths[0]);
    const timestamp = Date.now();
    const filename = `merged-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);

    try {
        // Using pdfunite from Poppler utils
        const inputs = inputPaths.map(p => `"${p}"`).join(' ');
        const command = `pdfunite ${inputs} "${outputPath}"`;

        await execAsync(command, { timeout: 60000 });

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('PDF merge error:', error);
        throw new Error('Failed to merge PDF files');
    }
};

/**
 * Split PDF into separate pages
 * Command: pdfseparate input.pdf output-%d.pdf
 * OR: qpdf --split-pages input.pdf output.pdf
 */
export const splitPdf = async (inputPath) => {
    const outputDir = path.dirname(inputPath);
    const basename = path.basename(inputPath, '.pdf');
    const timestamp = Date.now();
    const outputPattern = path.join(outputDir, `${basename}-page-%d.pdf`);

    try {
        // Using pdfseparate from Poppler utils
        const command = `pdfseparate "${inputPath}" "${outputPattern}"`;

        await execAsync(command, { timeout: 60000 });

        // Would need to zip the files - for MVP, return info
        // In production, use archiver package to create zip
        const filename = `split-${basename}-${timestamp}.zip`;
        const outputPath = path.join(outputDir, filename);

        // TODO: Implement zip creation
        // For now, return the directory

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('PDF split error:', error);
        throw new Error('Failed to split PDF');
    }
};

/**
 * Extract specific pages from PDF
 * Command: qpdf input.pdf --pages input.pdf 1-3,5 -- output.pdf
 * OR: pdftk input.pdf cat 1-3 5 output output.pdf
 */
export const extractPages = async (inputPath, pageSpec) => {
    const outputDir = path.dirname(inputPath);
    const basename = path.basename(inputPath, '.pdf');
    const timestamp = Date.now();
    const filename = `extracted-${basename}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);

    try {
        // Using qpdf
        // Convert page spec (e.g., "1-3,5,7-9") to qpdf format
        const command = `qpdf "${inputPath}" --pages "${inputPath}" ${pageSpec} -- "${outputPath}"`;

        await execAsync(command, { timeout: 60000 });

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('PDF extract error:', error);
        throw new Error('Failed to extract pages. Check page specification format (e.g., 1-3,5,7-9)');
    }
};

/**
 * Remove specific pages from PDF
 * Logic: Get total pages, then extract all EXCEPT the specified pages
 * Command: qpdf input.pdf --pages input.pdf 1-2,4-10 -- output.pdf (skipping page 3)
 */
export const removePages = async (inputPath, pageSpec) => {
    const outputDir = path.dirname(inputPath);
    const basename = path.basename(inputPath, '.pdf');
    const timestamp = Date.now();
    const filename = `removed-${basename}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);

    try {
        // First, get total number of pages
        const { stdout } = await execAsync(`qpdf --show-npages "${inputPath}"`);
        const totalPages = parseInt(stdout.trim());

        // Parse pages to remove
        const pagesToRemove = parsePageSpec(pageSpec);

        // Calculate pages to keep
        const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
        const pagesToKeep = allPages.filter(p => !pagesToRemove.includes(p));

        if (pagesToKeep.length === 0) {
            throw new Error('Cannot remove all pages from PDF');
        }

        // Convert to range format for qpdf
        const keepSpec = formatPageRange(pagesToKeep);

        const command = `qpdf "${inputPath}" --pages "${inputPath}" ${keepSpec} -- "${outputPath}"`;

        await execAsync(command, { timeout: 60000 });

        // Verify output file exists
        await fs.access(outputPath);

        return {
            outputPath,
            filename
        };
    } catch (error) {
        console.error('PDF remove pages error:', error);
        throw new Error('Failed to remove pages. Check page specification format (e.g., 2,4-6,8)');
    }
};

/**
 * Parse page specification string into array of page numbers
 * Example: "1-3,5,7-9" => [1,2,3,5,7,8,9]
 */
function parsePageSpec(spec) {
    const pages = [];
    const parts = spec.split(',').map(s => s.trim());

    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim()));
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        } else {
            pages.push(parseInt(part));
        }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
}

/**
 * Format array of page numbers into range string
 * Example: [1,2,3,5,7,8,9] => "1-3,5,7-9"
 */
function formatPageRange(pages) {
    if (pages.length === 0) return '';

    const ranges = [];
    let start = pages[0];
    let end = pages[0];

    for (let i = 1; i < pages.length; i++) {
        if (pages[i] === end + 1) {
            end = pages[i];
        } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = end = pages[i];
        }
    }

    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(',');
}

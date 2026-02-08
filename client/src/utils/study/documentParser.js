import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Use strict import for worker to ensure it works with Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Load the document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const numPages = pdf.numPages;
        let fullText = '';
        let hasText = false;

        for (let i = 1; i <= numPages; i++) {
            try {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');

                if (pageText.trim().length > 0) {
                    hasText = true;
                }

                fullText += `\n\n--- Page ${i} ---\n${pageText}`;
            } catch (pageError) {
                console.warn(`Error on page ${i}:`, pageError);
                // Continue to next page rather than failing completely
            }
        }

        const trimmedText = fullText.trim();

        if (!hasText || trimmedText.length < 20) {
            return {
                text: "This document appears to be scanned or contains no selectable text. Text extraction is not available yet.",
                pageCount: numPages,
                isScanned: true
            };
        }

        return {
            text: trimmedText,
            pageCount: numPages
        };
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file. The file may be corrupted or password protected.');
    }
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        return {
            text: result.value.trim(),
            pageCount: Math.ceil(result.value.length / 3000) // Estimate pages
        };
    } catch (error) {
        console.error('DOCX parsing error:', error);
        throw new Error('Failed to parse DOCX file');
    }
}

/**
 * Parse PPTX file (basic text extraction)
 */
export async function parsePPTX(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        return {
            text: result.value.trim(),
            pageCount: Math.ceil(result.value.length / 1500) // Estimate slides
        };
    } catch (error) {
        console.error('PPTX parsing error:', error);
        throw new Error('Failed to parse PPTX file');
    }
}

/**
 * Main document parser - routes to appropriate parser
 */
export async function parseDocument(file) {
    const extension = file.name.split('.').pop().toLowerCase();

    switch (extension) {
        case 'pdf':
            return await parsePDF(file);
        case 'docx':
        case 'doc':
            return await parseDOCX(file);
        case 'pptx':
        case 'ppt':
            return await parsePPTX(file);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}

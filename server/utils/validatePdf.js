const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Validates if files are valid PDFs that can be opened
 * @param {Array} files - Multer file objects
 * @returns {Promise<boolean>}
 */
const validatePdfs = async (files) => {
    try {
        for (const file of files) {
            const pdfBytes = await fs.promises.readFile(file.path);
            await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        }
        return true;
    } catch (error) {
        console.error('PDF Validation Failed:', error.message);
        return false;
    }
};

module.exports = {
    validatePdfs
};

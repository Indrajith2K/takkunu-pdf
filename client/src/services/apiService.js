// API Service for communicating with backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Convert a file using the backend API
 * @param {string} tool - Tool identifier (e.g., 'pdf-to-word')
 * @param {File} file - File to convert
 * @returns {Promise<{blob: Blob, filename: string}>}
 */
export const convertFile = async (tool, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/api/convert/${tool}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Conversion failed');
        }

        // Get the filename from the header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'converted-file';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        const blob = await response.blob();

        return { blob, filename };
    } catch (error) {
        console.error('Conversion error:', error);
        throw error;
    }
};

/**
 * Organize PDF files using the backend API
 * @param {string} tool - Tool identifier (e.g., 'merge-pdf')
 * @param {File[]} files - Files to process
 * @param {string} pages - Page specification (for extract/remove)
 * @returns {Promise<{blob: Blob, filename: string}>}
 */
export const organizeFile = async (tool, files, pages = '') => {
    const formData = new FormData();

    // Add all files
    files.forEach((file, index) => {
        formData.append('files', file);
    });

    // Add page specification if provided
    if (pages) {
        formData.append('pages', pages);
    }

    try {
        const response = await fetch(`${API_URL}/api/organize/${tool}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Operation failed');
        }

        // Get the filename from the header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'processed-file.pdf';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        const blob = await response.blob();

        return { blob, filename };
    } catch (error) {
        console.error('Organization error:', error);
        throw error;
    }
};

/**
 * Check server health
 * @returns {Promise<boolean>}
 */
export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
};

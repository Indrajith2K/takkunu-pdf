import axios from 'axios';

const API_BASE_URL = "https://takkunu-pdf-server.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const pdfApi = {
    // Merge: Upload multiple files
    mergePdf: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post('/api/pdf/merge', formData, {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    },

    // Split: Upload single file
    splitPdf: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/api/pdf/split', formData, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Extract: Upload single file + pages string (e.g., "1,3,5-7")
    extractPdf: async (file, pages) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pages', pages);

        const response = await api.post('/api/pdf/extract', formData, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Remove: Upload single file + pages string (e.g., "1,2")
    removePdf: async (file, pages) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pages', pages);

        const response = await api.post('/api/pdf/remove', formData, {
            responseType: 'blob',
        });
        return response.data;
    },

    // JPG to PDF: Upload multiple images
    jpgToPdf: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post('/api/pdf/jpg-to-pdf', formData, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Word to PDF: Upload single docx file
    wordToPdf: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/api/pdf/word-to-pdf', formData, {
            responseType: 'blob',
        });
        return response.data;
    }
};

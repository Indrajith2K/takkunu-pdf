import axios from 'axios';

// Use environment variable for API base URL, fallback to Render deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://takkunu-pdf-server.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 second timeout for large file uploads
});

// Add request interceptor for debugging in development
if (import.meta.env.DEV) {
    api.interceptors.request.use(
        (config) => {
            console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        },
        (error) => {
            console.error('🔴 API Request Error:', error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            console.log(`🟢 API Response: ${response.config.url}`, response.status);
            return response;
        },
        (error) => {
            console.error('🔴 API Response Error:', error.response?.status, error.message);
            return Promise.reject(error);
        }
    );
}

export const pdfApi = {
    // Merge: Upload multiple files
    mergePdf: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post('/api/pdf/merge', formData, {
            responseType: 'blob',
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
    },

    // PDF to JPG: Upload single PDF file -> ZIP
    pdfToJpg: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/api/pdf/to-jpg', formData, {
            responseType: 'blob',
        });
        return response.data;
    }
};

export default api;

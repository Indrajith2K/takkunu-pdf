import axios from 'axios';

const API_BASE_URL = "https://takkunu-pdf-server.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000, // 2 minutes for large files
});

export const statsApi = {
    // Get global activity count
    getGlobalActivity: async () => {
        try {
            const response = await api.get('/api/stats/global-activity');
            return response.data.total || 0;
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            return 0;
        }
    }
};

import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Works universally via Vite proxy locally and Vercel Serverless in prod
});

// ── Request interceptor: attach JWT token ──
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 expired/invalid token ──
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear local auth state and redirect to login
            localStorage.removeItem('token');
            // Only redirect if not already on the auth page
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

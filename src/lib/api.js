import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API client with error handling
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Users API
export const usersAPI = {
    getAll: () => apiClient.get('/api/users'),
    getById: (id) => apiClient.get(`/api/users/${id}`),
    create: (data) => apiClient.post('/api/users', data),
    update: (id, data) => apiClient.put(`/api/users/${id}`, data),
    delete: (id) => apiClient.delete(`/api/users/${id}`),
};

// Technicians API
export const techniciansAPI = {
    getAll: () => apiClient.get('/api/technicians'),
    getNearby: (lng, lat, dist = 5000) =>
        apiClient.get(`/api/technicians/nearby?lng=${lng}&lat=${lat}&dist=${dist}`),
};

// Services API
export const servicesAPI = {
    getAll: () => apiClient.get('/api/services'),
    getById: (id) => apiClient.get(`/api/services/${id}`),
    create: (data) => apiClient.post('/api/services', data),
    update: (id, data) => apiClient.put(`/api/services/${id}`, data),
    delete: (id) => apiClient.delete(`/api/services/${id}`),
};

// Jobs API
export const jobsAPI = {
    getAll: () => apiClient.get('/api/jobs'),
    getById: (id) => apiClient.get(`/api/jobs/${id}`),
    create: (data) => apiClient.post('/api/jobs', data),
    update: (id, data) => apiClient.put(`/api/jobs/${id}`, data),
    delete: (id) => apiClient.delete(`/api/jobs/${id}`),
};

// Bids API
export const bidsAPI = {
    getAll: (jobId) => apiClient.get(`/api/bids${jobId ? `?jobId=${jobId}` : ''}`),
    create: (data) => apiClient.post('/api/bids', data),
    update: (id, data) => apiClient.put(`/api/bids/${id}`, data),
    delete: (id) => apiClient.delete(`/api/bids/${id}`),
};

// Appointments API
export const appointmentsAPI = {
    getAll: () => apiClient.get('/api/appointments'),
    getById: (id) => apiClient.get(`/api/appointments/${id}`),
    create: (data) => apiClient.post('/api/appointments', data),
    update: (id, data) => apiClient.put(`/api/appointments/${id}`, data),
    delete: (id) => apiClient.delete(`/api/appointments/${id}`),
};

// Reviews API
export const reviewsAPI = {
    getAll: () => apiClient.get('/api/reviews'),
    create: (data) => apiClient.post('/api/reviews', data),
    update: (id, data) => apiClient.put(`/api/reviews/${id}`, data),
    delete: (id) => apiClient.delete(`/api/reviews/${id}`),
};

// Payment API
export const paymentAPI = {
    createIntent: (amount, currency = 'lkr', metadata = {}) =>
        apiClient.post('/api/payment/create-payment-intent', { amount, currency, metadata }),
    confirmPayment: (paymentIntentId) =>
        apiClient.post('/api/payment/confirm-payment', { paymentIntentId }),
};

// Health Check
export const healthAPI = {
    check: () => apiClient.get('/api/health'),
};

export default apiClient;

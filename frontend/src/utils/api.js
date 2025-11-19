import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Questions API
export const questionsAPI = {
  getAll: (category) => apiClient.get('/questions', { params: { category } }),
  getById: (id) => apiClient.get(`/questions/${id}`),
  getByCategory: (category, limit) =>
    apiClient.get(`/questions/category/${category}`, { params: { limit } }),
  create: (data) => apiClient.post('/questions', data),
  update: (id, data) => apiClient.put(`/questions/${id}`, data),
  delete: (id) => apiClient.delete(`/questions/${id}`),
};

// Interviews API
export const interviewsAPI = {
  create: (data) => apiClient.post('/interviews', data),
  getById: (id) => apiClient.get(`/interviews/${id}`),
  submitAnswer: (id, questionIndex, data) =>
    apiClient.put(`/interviews/${id}/answer/${questionIndex}`, data),
  complete: (id) => apiClient.put(`/interviews/${id}/complete`),
  getAll: () => apiClient.get('/interviews'),
  getReport: (id) => apiClient.get(`/interviews/${id}/report`),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

export default apiClient;

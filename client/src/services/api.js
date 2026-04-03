import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const services = {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),

  // Books
  getBooks: (params) => api.get('/books', { params }),
  createBook: (data) => api.post('/books', data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),

  // Comments
  getComments: (bookId) => api.get(`/comments/${bookId}`),
  addComment: (bookId, text) => api.post(`/comments/${bookId}`, { text }),
  deleteComment: (id) => api.delete(`/comments/${id}`),

  // Users
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Stats
  getStats: () => api.get('/stats')
};

export default services;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const skillApi = {
  offer: (data) => api.post('/api/skills/offer', data),
  want: (data) => api.post('/api/skills/want', data),
  browse: () => api.get('/api/skills/browse'),
  mine: () => api.get('/api/skills/mine'),
};

export const matchApi = {
  search: () => api.post('/api/matches/search'),
  myMatches: () => api.get('/api/matches'),
  updateStatus: (id, status) => api.put(`/api/matches/${id}/status`, null, { params: { status } }),
};

export const activityApi = {
  recent: () => api.get('/api/activity/recent'),
};

export const sessionApi = {
  book: (data) => api.post('/api/sessions', data),
  getForMatch: (matchId) => api.get(`/api/sessions/${matchId}`),
  updateStatus: (id, status) => api.put(`/api/sessions/${id}/status`, null, { params: { status } }),
};

export default api;

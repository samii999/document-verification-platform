import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - is the backend running?');
    }
    
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      throw new Error(message);
    }
    
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

export const auth = {
  register: async (userData: { email: string; password: string }) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  }
};

export const documents = {
  upload: async (formData: FormData) => {
    const response = await API.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  getDocuments: async () => {
    const response = await API.get('/documents');
    return response.data;
  },
  
  getDocumentById: async (id: string) => {
    const response = await API.get(`/documents/${id}`);
    return response.data;
  },
  
  verifyDocument: async (documentId: string, hash: string) => {
    const response = await API.post(`/documents/verify/${documentId}`, { hash });
    return response.data;
  },
  
  getAll: async () => {
    const response = await API.get('/documents/all');
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  }
};

export default API;

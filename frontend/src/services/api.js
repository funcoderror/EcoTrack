import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3001',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers if available
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    // Get token from localStorage as backup (for cases where cookies don't work)
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Store token if returned in response (backup mechanism)
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - clearing token and redirecting to login');
      localStorage.removeItem('token');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (email, password, firstName, lastName) => 
    api.post('/api/auth/register', { email, password, firstName, lastName }),
  
  logout: () => 
    api.post('/api/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/api/auth/me'),
};

// Users API calls
export const usersAPI = {
  getProfile: () => 
    api.get('/api/users/profile'),
  
  updateProfile: (firstName, lastName) => 
    api.put('/api/users/profile', { firstName, lastName }),
  
  getStats: () => 
    api.get('/api/users/stats'),
};

// Activities API calls
export const activitiesAPI = {
  getActivities: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get(`/api/activities?${queryParams}`);
  },
  
  createActivity: (categoryId, description, quantity, activityDate) => 
    api.post('/api/activities', { categoryId, description, quantity, activityDate }),
  
  updateActivity: (id, categoryId, description, quantity, activityDate) => 
    api.put(`/api/activities/${id}`, { categoryId, description, quantity, activityDate }),
  
  deleteActivity: (id) => 
    api.delete(`/api/activities/${id}`),
  
  getCategories: () => 
    api.get('/api/activities/categories'),
};

// Carbon Footprint API calls
export const carbonFootprintAPI = {
  calculate: (transport, electricity, diet, flights, waste) =>
    api.post('/api/carbon-footprint/calculate', { transport, electricity, diet, flights, waste }),
  
  getHistory: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    return api.get(`/api/carbon-footprint/history?${queryParams}`);
  },
  
  getLatest: () =>
    api.get('/api/carbon-footprint/latest'),
  
  deleteCalculation: (id) =>
    api.delete(`/api/carbon-footprint/${id}`),
};

export default api;
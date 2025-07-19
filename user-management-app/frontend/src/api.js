const api = axios.create({
      // Use a relative path. Nginx will proxy this to the backend.
      baseURL: '/api',
      timeout: 10000,
    });
    
    // Interceptor to add the auth token to requests
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Interceptor to handle auth errors globally
    api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          // Dispatch a custom event to notify the app of logout
          window.dispatchEvent(new CustomEvent('unauthorized'));
        }
        return Promise.reject(error);
      }
    );
    
    export const login = (credentials) => api.post('/auth/login', credentials);
    export const register = (userData) => api.post('/auth/register', userData);
    export const logout = () => api.post('/auth/logout');
    export const getUsers = () => api.get('/users');
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/reducers/authReducer';

// Base URL for your API
const BASE_URL = 'http://127.0.0.1:4000/api/v1';

// Public Axios instance (no authentication required)
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Private Axios instance (requires authentication)
export const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication if necessary
});

// Token refreshing logic
let isRefreshing = false;
let refreshSubscribers = [];

// Function to add subscribers
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Function to notify subscribers
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// Interceptor to attach tokens for privateAxios
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally and refresh tokens
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing the token
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(authClient(originalRequest));
          });
        });
      }

      // Mark the request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await publicClient.post('/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken } = response.data;

        // Store the new access token
        localStorage.setItem('accessToken', accessToken);

        // Notify all subscribers with the new token
        onTokenRefreshed(accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Handle token refresh failure (e.g., log out the user)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Adjust as needed
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export const useLogout = () => {
  const dispatch = useDispatch(); 
  const logout = () => {
    // Clear user authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('persist:root');
    localStorage.removeItem('refreshToken');
    dispatch(authActions.signout());  
    // window.location.href = '/login';
  };

  return logout;
};
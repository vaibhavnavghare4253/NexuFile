import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create auth store with Zustand
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setTokens: (tokens) => set({ 
        token: tokens.access_token, 
        refreshToken: tokens.refresh_token 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Authentication methods
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
          const { user, tokens } = response.data;
          
          set({ 
            user, 
            token: tokens.access_token, 
            refreshToken: tokens.refresh_token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },
      
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
          const { user, tokens } = response.data;
          
          set({ 
            user, 
            token: tokens.access_token, 
            refreshToken: tokens.refresh_token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          refreshToken: null, 
          isAuthenticated: false,
          error: null 
        });
        
        // Remove authorization header
        delete axios.defaults.headers.common['Authorization'];
      },
      
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          
          const { tokens } = response.data;
          
          set({ 
            token: tokens.access_token, 
            refreshToken: tokens.refresh_token 
          });
          
          // Update authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
          
          return tokens.access_token;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          throw error;
        }
      },
      
      initializeAuth: () => {
        const { token, user } = get();
        
        if (token && user) {
          set({ isAuthenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
      
      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData);
          const { user } = response.data;
          
          set({ user, isLoading: false });
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },
      
      getProfile: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/profile`);
          const user = response.data;
          
          set({ user });
          
          return user;
        } catch (error) {
          console.error('Failed to get profile:', error);
          return null;
        }
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Setup axios interceptors for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshAccessToken } = useAuthStore.getState();
        await refreshAccessToken();
        
        // Retry the original request with new token
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

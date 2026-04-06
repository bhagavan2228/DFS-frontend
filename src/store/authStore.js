import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      ghostMode: false,

      syncSession: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null, ghostMode: false });
          return;
        }
        try {
          const { data } = await api.get('/users/me');
          set({
            user: data,
            token,
            isAuthenticated: true,
            ghostMode: Boolean(data.ghostMode),
          });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, ghostMode: false });
        }
      },

      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials);
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            ghostMode: Boolean(user.ghostMode),
          });
          return { success: true };
        } catch (error) {
          console.error('Authentication failed:', error.response?.data?.message || error.message);
          return { success: false, error: error.response?.data?.message || 'Invalid email or password.' };
        }
      },

      toggleGhostMode: async () => {
        try {
          const response = await api.post('/users/me/toggle-ghost');
          const g = Boolean(response.data.ghostMode);
          set((state) => ({
            ghostMode: g,
            user: state.user ? { ...state.user, ghostMode: g } : null,
          }));
          return { success: true, ghostMode: g };
        } catch (error) {
          console.error('Ghost mode toggle failed:', error);
          return { success: false, error: 'Could not update ghost mode.' };
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          return { success: true, data: response.data };
        } catch (error) {
          console.error('Registration failed:', error.response?.data?.message || error.message);
          return { success: false, error: error.response?.data?.message || 'Registration failed.' };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, ghostMode: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

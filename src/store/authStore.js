import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { post } from '@/lib/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      login: (userData) => set({ 
        user: userData, 
        isLoggedIn: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isLoggedIn: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Reusable authentication functions that can be imported separately
export const loginUser = async (credentials) => {
  try {
    const data = await post('/api/auth/login', credentials);
    
    // Update the auth store
    useAuthStore.getState().login(data.user);
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signupUser = async (userData) => {
  try {
    const data = await post('/api/auth/signup', userData);
    
    // Update the auth store
    useAuthStore.getState().login(data.user);
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => {
  useAuthStore.getState().logout();
  return { success: true };
};

export const isAdmin = () => {
  const { user } = useAuthStore.getState();
  return user?.isAdmin === true;
};

export const isAuthenticated = () => {
  const { isLoggedIn } = useAuthStore.getState();
  return isLoggedIn === true;
};

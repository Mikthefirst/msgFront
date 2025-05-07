import { create } from 'zustand';
import { User } from '../types';
import { currentUser } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'valid@gmail.com' && password === '1111') {
        set({ user: currentUser, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid credentials', isLoading: false });
      }
    } catch (error) {
      set({ error: 'An error occurred', isLoading: false });
    }
  },
  
  signup: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - in a real app, this would be a fetch to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just simulate a successful signup
      set({ 
        user: { ...currentUser, username }, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'An error occurred', isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
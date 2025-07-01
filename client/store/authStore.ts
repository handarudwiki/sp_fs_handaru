import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setAuth: ( token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setAuth: (token) => {
        localStorage.setItem('token', token);
        set({  token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({  token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
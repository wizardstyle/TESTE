import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username: string, password: string) => {
        // In a real app, this would validate against a backend
        if (username === 'admin' && password === 'admin') {
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, username: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
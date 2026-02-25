import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from './events';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrating: (hydrating: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isHydrating: false,
      setAuth: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true, isHydrating: false }),
      clearAuth: () =>
        set({ accessToken: null, user: null, isAuthenticated: false, isHydrating: false }),
      setHydrating: (isHydrating) => set({ isHydrating }),
    }),
    {
      name: 'auth-storage',
      // We use sessionStorage to keep the token around on refresh, 
      // but still clear it if the user closes the tab (closer to memory-only security).
      // In a real app, you'd use HTTP-only cookies and a /refresh endpoint instead.
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

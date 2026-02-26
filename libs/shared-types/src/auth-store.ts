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
      // TODO (Security): We are using sessionStorage temporarily so the app survives a page refresh.
      // Once the backend implements HttpOnly cookies and a /refresh endpoint, this persist middleware
      // should be removed, keeping the accessToken strictly in-memory.
      storage: createJSONStorage(() => window.sessionStorage),
    }
  )
);

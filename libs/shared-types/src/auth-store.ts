import { create } from 'zustand';
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

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isHydrating: false,
  setAuth: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true, isHydrating: false }),
  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false, isHydrating: false }),
  setHydrating: (isHydrating) => set({ isHydrating }),
}));

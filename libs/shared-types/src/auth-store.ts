import { create } from 'zustand';
import type { User } from './events';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setHydrating: (hydrating: boolean) => void;
}

/**
 * Auth state is intentionally memory-only on frontend.
 * Session persistence must come from secure HttpOnly cookies, not Web Storage.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: false,
  setAuth: (user) => set({ user, isAuthenticated: true, isHydrating: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false, isHydrating: false }),
  setHydrating: (isHydrating) => set({ isHydrating }),
}));

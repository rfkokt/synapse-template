import type { User } from './events';
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setHydrating: (hydrating: boolean) => void;
}
export declare const useAuthStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<AuthState>
>;
//# sourceMappingURL=auth-store.d.ts.map

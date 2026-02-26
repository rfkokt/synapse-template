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
export declare const useAuthStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<AuthState>
>;
//# sourceMappingURL=auth-store.d.ts.map

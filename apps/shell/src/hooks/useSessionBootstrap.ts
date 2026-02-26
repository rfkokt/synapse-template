import { useEffect } from 'react';
import { API, apiClient } from '@synapse/shared-api';
import { useAuthStore } from '@synapse/shared-types';
import type { User } from '@synapse/shared-types';

interface RefreshResponse {
  access_token: string;
  user?: User;
}

/**
 * Restores session on app bootstrap using refresh cookie.
 * This keeps users signed in after browser refresh when backend/mock API is available.
 */
export function useSessionBootstrap() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrating = useAuthStore((s) => s.setHydrating);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        if (useAuthStore.getState().accessToken) {
          return;
        }

        const res = await apiClient.post<RefreshResponse>(API.auth.refresh(), {});
        const token = res.data.access_token;
        const user = res.data.user ?? useAuthStore.getState().user;

        if (token && user) {
          setAuth(token, user);
        } else {
          if (!cancelled) clearAuth();
        }
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) {
          setHydrating(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [setAuth, clearAuth, setHydrating]);
}

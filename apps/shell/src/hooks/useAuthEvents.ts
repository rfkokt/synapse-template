import { useEffect } from 'react';
import { MFE_EVENTS, onMfeEvent, useAuthStore } from '@synapse/shared-types';
import type { AuthEventPayload } from '@synapse/shared-types';

/**
 * Hook that listens for MFE auth events and updates the global auth store.
 * Must be used within the Shell (host) only.
 */
export function useAuthEvents() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const unsubLogin = onMfeEvent<AuthEventPayload>(MFE_EVENTS.AUTH.USER_LOGGED_IN, (payload) => {
      setAuth(
        payload.accessToken,
        payload.user || {
          id: payload.userId,
          email: '',
          name: '',
          role: '',
        }
      );
    });

    const unsubLogout = onMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_OUT, () => {
      clearAuth();
    });

    const unsubRefresh = onMfeEvent<AuthEventPayload>(
      MFE_EVENTS.AUTH.TOKEN_REFRESHED,
      (payload) => {
        setAuth(
          payload.accessToken,
          payload.user || {
            id: payload.userId,
            email: '',
            name: '',
            role: '',
          }
        );
      }
    );

    return () => {
      unsubLogin();
      unsubLogout();
      unsubRefresh();
    };
  }, [setAuth, clearAuth]);
}

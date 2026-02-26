import { useEffect } from 'react';
import { MFE_EVENTS, onMfeEvent, useAuthStore } from '@synapse/shared-types';
import type { AuthEventPayload } from '@synapse/shared-types';
import type { User } from '@synapse/shared-types';

/**
 * Hook that listens for MFE auth events and updates the global auth store.
 * Must be used within the Shell (host) only.
 */
export function useAuthEvents() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const resolveUserFromPayload = (payload: AuthEventPayload): User => {
    const currentUser = useAuthStore.getState().user;
    const payloadUser = payload.user;

    return {
      id: payloadUser?.id || payload.userId || currentUser?.id || 'unknown-user',
      email: payloadUser?.email || currentUser?.email || '',
      name: payloadUser?.name || currentUser?.name || '',
      role: payloadUser?.role || currentUser?.role || 'user',
      avatar: payloadUser?.avatar || currentUser?.avatar,
    };
  };

  useEffect(() => {
    const unsubLogin = onMfeEvent<AuthEventPayload>(MFE_EVENTS.AUTH.USER_LOGGED_IN, (payload) => {
      setAuth(payload.accessToken, resolveUserFromPayload(payload));
    });

    const unsubLogout = onMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_OUT, () => {
      clearAuth();
    });

    const unsubRefresh = onMfeEvent<AuthEventPayload>(
      MFE_EVENTS.AUTH.TOKEN_REFRESHED,
      (payload) => {
        setAuth(payload.accessToken, resolveUserFromPayload(payload));
      }
    );

    return () => {
      unsubLogin();
      unsubLogout();
      unsubRefresh();
    };
  }, [setAuth, clearAuth]);
}

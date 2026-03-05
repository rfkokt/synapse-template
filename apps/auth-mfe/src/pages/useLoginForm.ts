import { apiClient, API } from '@synapse/shared-api';
import type { AuthEventPayload, User } from '@synapse/shared-types';
import {
  useAuthStore,
  getSafeRedirectTarget,
  isAppError,
  MFE_EVENTS,
  dispatchMfeEvent,
} from '@synapse/shared-types';
import type { TFunction } from 'i18next';
import { type FormEvent, useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */

const SESSION_DURATION_MS = 15 * 60 * 1000;

export type DemoLoginRole = 'admin' | 'manager' | 'developer' | 'user';

export const DEMO_ROLE_ACCOUNTS: Record<
  DemoLoginRole,
  { label: string; email: string; password: string; description: string }
> = {
  admin: {
    label: 'Admin',
    email: 'admin@Synapse.com',
    password: 'password123',
    description: 'Akses penuh termasuk User Management.',
  },
  manager: {
    label: 'Manager',
    email: 'manager@Synapse.com',
    password: 'password123',
    description: 'Akses laporan & operasional.',
  },
  developer: {
    label: 'Developer',
    email: 'dev@Synapse.com',
    password: 'password123',
    description: 'Akses menu dokumentasi dan UI Kit.',
  },
  user: {
    label: 'User',
    email: 'user@Synapse.com',
    password: 'password123',
    description: 'Akses fitur operasional dasar.',
  },
};

export const DEMO_ROLE_ORDER: DemoLoginRole[] = ['admin', 'manager', 'developer', 'user'];

/* ─────────────────────────────────────────────
   Hook: useLoginForm
   Manages form state, demo credentials, submit
   ───────────────────────────────────────────── */

interface LoginResponse {
  user: User;
}

export interface UseLoginFormReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  selectedDemoRole: DemoLoginRole;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  error: string;
  success: boolean;
  safeRedirectTarget: string | null;
  showMockCredentials: boolean;
  shellUrl: string;
  applyDemoCredentials: (role: DemoLoginRole) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export function useLoginForm(t: TFunction): UseLoginFormReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState<DemoLoginRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [safeRedirectTarget, setSafeRedirectTarget] = useState<string | null>(null);

  const shellUrl = import.meta.env.VITE_SHELL_URL || 'http://localhost:4000';
  const shouldUseMsw =
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false');
  const showMockCredentials = import.meta.env.DEV && shouldUseMsw;

  const applyDemoCredentials = (role: DemoLoginRole) => {
    const account = DEMO_ROLE_ACCOUNTS[role];
    setSelectedDemoRole(role);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new window.URLSearchParams(window.location.search);
      setSafeRedirectTarget(getSafeRedirectTarget(urlParams.get('redirect')));
    }
  }, []);

  useEffect(() => {
    if (!showMockCredentials) return;
    if (email || password) return;
    applyDemoCredentials(selectedDemoRole);
  }, [showMockCredentials]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError(t('login.errorEmpty'));
        return;
      }

      const res = await apiClient.post<LoginResponse>(API.auth.login(), { email, password });
      const user = res.data.user;

      if (!user) {
        throw new Error(t('login.errorAuth'));
      }

      const payload: AuthEventPayload = {
        userId: user.id,
        user,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };

      dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, payload);
      useAuthStore.getState().setAuth(user);

      if (safeRedirectTarget) {
        window.location.assign(safeRedirectTarget);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(isAppError(err) ? err.message : t('login.errorAuth'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    selectedDemoRole,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    success,
    safeRedirectTarget,
    showMockCredentials,
    shellUrl,
    applyDemoCredentials,
    handleSubmit,
  };
}

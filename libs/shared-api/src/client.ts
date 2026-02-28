import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@synapse/shared-types';
import type { AppError, User } from '@synapse/shared-types';
import { API } from './endpoints';

const shouldUseMsw =
  import.meta.env.VITE_ENABLE_MSW === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false');

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiBaseUrl = shouldUseMsw ? '/' : configuredApiBaseUrl || '/';

/**
 * Shared Axios client instance.
 * All MFEs should use this for API calls.
 */
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Normalize any error into AppError shape.
 */
function normalizeError(error: AxiosError): AppError {
  const data = error.response?.data as Record<string, unknown> | undefined;
  return {
    code: (data?.code as string) || 'UNKNOWN_ERROR',
    message: (data?.message as string) || error.message || 'An unexpected error occurred',
    statusCode: error.response?.status || 500,
    details: data?.details,
  };
}

/**
 * Single promise for refresh token to avoid concurrent refresh calls.
 */
let refreshPromise: Promise<void> | null = null;

interface RefreshResponse {
  user?: User;
}

async function refreshSession(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = apiClient
    .post<RefreshResponse>(API.auth.refresh(), {}, { withCredentials: true })
    .then((res) => {
      const nextUser = res.data.user ?? useAuthStore.getState().user;
      if (!nextUser) {
        useAuthStore.getState().clearAuth();
        throw new Error('AUTH_USER_CONTEXT_MISSING');
      }
      useAuthStore.getState().setAuth(nextUser);
    })
    .catch((err) => {
      useAuthStore.getState().clearAuth();
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// Response interceptor: auto-refresh session via HttpOnly cookies + error normalization
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/api/v1/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

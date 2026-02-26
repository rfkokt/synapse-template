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
let refreshPromise: Promise<string> | null = null;

interface RefreshResponse {
  access_token: string;
  user?: User;
}

async function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = apiClient
    .post<RefreshResponse>(API.auth.refresh(), {}, { withCredentials: true })
    .then((res) => {
      const newToken = res.data.access_token;
      const nextUser = res.data.user ?? useAuthStore.getState().user;
      if (!nextUser) {
        useAuthStore.getState().clearAuth();
        throw new Error('AUTH_USER_CONTEXT_MISSING');
      }
      useAuthStore.getState().setAuth(newToken, nextUser);
      return newToken;
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

// Request interceptor: inject access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh + error normalization
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/api/v1/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

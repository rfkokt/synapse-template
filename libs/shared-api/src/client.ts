import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@synapse/shared-types';
import type { AppError } from '@synapse/shared-types';

/**
 * Shared Axios client instance.
 * All MFEs should use this for API calls.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4003',
  timeout: 15_000,
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

async function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post<{ access_token: string }>(
      `${apiClient.defaults.baseURL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true }
    )
    .then((res) => {
      const newToken = res.data.access_token;
      useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user!);
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

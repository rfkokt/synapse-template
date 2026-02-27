import { create } from 'zustand';

/* ─────────────────────────────────────────────
   Notification Store — Global toast queue
   Any MFE can push a toast; Shell renders them.
   ───────────────────────────────────────────── */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  list?: string[];
  duration?: number;
}

export interface Toast {
  id: string;
  message?: string;
  variant: ToastVariant;
  title?: string;
  list?: string[];
  /** Auto-dismiss after ms (default: 4000) */
  duration?: number;
}

export interface NotificationState {
  toasts: Toast[];
  /** Push a new toast. Returns its ID. */
  addToast: (
    messageOrOptions: string | (ToastOptions & { message?: string }),
    variant?: ToastVariant
  ) => string;
  /** Remove a toast by ID */
  removeToast: (id: string) => void;
  /** Convenience shortcuts */
  success: (messageOrOptions: string | (ToastOptions & { message?: string })) => string;
  error: (messageOrOptions: string | (ToastOptions & { message?: string })) => string;
  warning: (messageOrOptions: string | (ToastOptions & { message?: string })) => string;
  info: (messageOrOptions: string | (ToastOptions & { message?: string })) => string;
}

let toastCounter = 0;

const createNotificationStore = () =>
  create<NotificationState>((set, get) => ({
    toasts: [],

    addToast: (payload, variant = 'info') => {
      const id = `toast-${++toastCounter}-${Date.now()}`;

      let toast: Toast;
      if (typeof payload === 'string') {
        toast = { id, message: payload, variant, duration: 4000 };
      } else {
        toast = {
          id,
          message: payload.message,
          variant,
          title: payload.title,
          list: payload.list,
          duration: payload.duration !== undefined ? payload.duration : 4000,
        };
      }

      set((s) => ({ toasts: [...s.toasts, toast] }));

      // Auto-dismiss
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => get().removeToast(id), toast.duration);
      }
      return id;
    },

    removeToast: (id) => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    success: (payload) => get().addToast(payload, 'success'),
    error: (payload) => get().addToast(payload, 'error'),
    warning: (payload) => get().addToast(payload, 'warning'),
    info: (payload) => get().addToast(payload, 'info'),
  }));

const GLOBAL_KEY = '__SYNAPSE_NOTIFICATION_STORE__';
const _window = typeof window !== 'undefined' ? window : ({} as any);

export const useNotificationStore =
  (_window as any)[GLOBAL_KEY] || ((_window as any)[GLOBAL_KEY] = createNotificationStore());

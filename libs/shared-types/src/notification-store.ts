import { create } from 'zustand';

/* ─────────────────────────────────────────────
   Notification Store — Global toast queue
   Any MFE can push a toast; Shell renders them.
   ───────────────────────────────────────────── */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss after ms (default: 4000) */
  duration?: number;
}

export interface NotificationState {
  toasts: Toast[];
  /** Push a new toast. Returns its ID. */
  addToast: (message: string, variant?: ToastVariant, duration?: number) => string;
  /** Remove a toast by ID */
  removeToast: (id: string) => void;
  /** Convenience shortcuts */
  success: (message: string) => string;
  error: (message: string) => string;
  warning: (message: string) => string;
  info: (message: string) => string;
}

let toastCounter = 0;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],

  addToast: (message, variant = 'info', duration = 4000) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const toast: Toast = { id, message, variant, duration };
    set((s) => ({ toasts: [...s.toasts, toast] }));

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
    return id;
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  success: (message) => get().addToast(message, 'success'),
  error: (message) => get().addToast(message, 'error'),
  warning: (message) => get().addToast(message, 'warning'),
  info: (message) => get().addToast(message, 'info'),
}));

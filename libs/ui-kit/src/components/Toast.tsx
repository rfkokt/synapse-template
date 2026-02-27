import { useEffect, useState } from 'react';
import {
  LuX as X,
  LuCircleCheck as CheckCircle,
  LuTriangleAlert as AlertTriangle,
  LuCircleAlert as AlertCircle,
  LuInfo as Info,
} from 'react-icons/lu';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Toast Component — "dumb" UI, no store import.
   The store connection lives in the consumer (Shell).
   ───────────────────────────────────────────── */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItemData {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface ToastContainerProps {
  toasts: ToastItemData[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: React.ElementType }> =
  {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/40',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Info,
    },
  };

const variantText: Record<ToastVariant, string> = {
  success: 'text-emerald-800 dark:text-emerald-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-amber-800 dark:text-amber-200',
  info: 'text-blue-800 dark:text-blue-200',
};

const variantIconColor: Record<ToastVariant, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const style = variantStyles[toast.variant];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 ${
        style.bg
      } ${style.border} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
      role="status"
      aria-live="polite"
    >
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${variantIconColor[toast.variant]}`} />
      <p className={`text-sm font-medium flex-1 ${variantText[toast.variant]}`}>{toast.message}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="shrink-0 h-6 w-6 px-0 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors bg-transparent"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/** Renders a stack of toasts. Connect to your store in the consumer. */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default ToastContainer;

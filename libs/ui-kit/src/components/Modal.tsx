import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Modal / Dialog Component
   Sizes: sm, md, lg, fullscreen
   ───────────────────────────────────────────── */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  children: ReactNode;
  /** Show close button (default: true) */
  showClose?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  fullscreen: 'max-w-none m-0 w-screen h-screen rounded-none',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showClose = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync open state with <dialog>
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handler = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', handler);
    return () => el.removeEventListener('cancel', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`${sizeClasses[size]} w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm`}
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Header */}
      {(title || showClose) && (
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
            )}
          </div>
          {showClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 px-0 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors bg-transparent"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-6 pt-2">{children}</div>
    </dialog>
  );
}

export default Modal;

import { useEffect, useRef, type ReactNode } from 'react';
import { LuX as X } from 'react-icons/lu';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Modal / Dialog Component
   Sizes: sm, md, lg, full, fullscreen
   Positions: top-left ... bottom-right
   ───────────────────────────────────────────── */

export type ModalSize = 'sm' | 'md' | 'lg' | 'full' | 'fullscreen';
export type ModalPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  position?: ModalPosition;
  children: ReactNode;
  /** Sticky footer area (ideal for action buttons) */
  footer?: ReactNode;
  /** Show close button (default: true) */
  showClose?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'w-full max-w-md max-h-[calc(100vh-2rem)]',
  md: 'w-full max-w-lg max-h-[calc(100vh-2rem)]',
  lg: 'w-full max-w-2xl max-h-[calc(100vh-2rem)]',
  full: 'w-[calc(100vw-2rem)] max-w-none max-h-[calc(100vh-2rem)]',
  fullscreen: 'inset-0 w-screen h-screen max-w-none max-h-none rounded-none',
};

const positionClasses: Record<ModalPosition, string> = {
  center: 'top-1/2 left-1/2 right-auto bottom-auto -translate-x-1/2 -translate-y-1/2',
  'top-left': 'top-4 left-4 right-auto bottom-auto translate-x-0 translate-y-0',
  'top-center': 'top-4 left-1/2 right-auto bottom-auto -translate-x-1/2 translate-y-0',
  'top-right': 'top-4 right-4 left-auto bottom-auto translate-x-0 translate-y-0',
  'center-left': 'top-1/2 left-4 right-auto bottom-auto translate-x-0 -translate-y-1/2',
  'center-right': 'top-1/2 right-4 left-auto bottom-auto translate-x-0 -translate-y-1/2',
  'bottom-left': 'bottom-4 left-4 right-auto top-auto translate-x-0 translate-y-0',
  'bottom-center': 'bottom-4 left-1/2 right-auto top-auto -translate-x-1/2 translate-y-0',
  'bottom-right': 'bottom-4 right-4 left-auto top-auto translate-x-0 translate-y-0',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  position = 'center',
  children,
  footer,
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

  const placementClass = size === 'fullscreen' ? '' : positionClasses[position];
  const hasFooter = Boolean(footer);

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-auto m-0 flex flex-col overflow-hidden p-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 backdrop:bg-black/50 backdrop:backdrop-blur-sm ${sizeClasses[size]} ${placementClass}`}
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
      <div
        className={`px-6 ${title || showClose ? 'pt-2' : 'pt-6'} pb-6 ${hasFooter ? 'min-h-0 flex-1 overflow-y-auto' : ''}`}
      >
        {children}
      </div>

      {footer && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}

export default Modal;

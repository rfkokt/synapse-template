import { useState, useRef, useEffect, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Dropdown Menu Component
   Trigger button with floating menu items
   ───────────────────────────────────────────── */

export interface DropdownMenuItem {
  /** Menu item label */
  label?: string;
  /** Icon element (e.g. lucide-react icon) */
  icon?: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Danger styling (red) */
  danger?: boolean;
  /** Divider above this item */
  divider?: boolean;
}

export interface DropdownMenuProps {
  /** Menu items to display */
  items: DropdownMenuItem[];
  /** Custom trigger element (defaults to ⋯ icon) */
  trigger?: ReactNode;
  /** Alignment of the dropdown. Default: 'right' */
  align?: 'left' | 'right';
  /** Width class for dropdown panel. Default: 'w-44' */
  width?: string;
  /** Additional className for wrapper */
  className?: string;
}

export function DropdownMenu({
  items,
  trigger,
  align = 'right',
  width = 'w-44',
  className = '',
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      {/* Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors h-8 w-8 px-0 bg-transparent hover:bg-neutral-100/50"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger || <MoreHorizontal className="h-4 w-4" />}
      </Button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 ${width} bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
          role="menu"
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && (
                <div className="border-t border-neutral-100 dark:border-neutral-700 my-1" />
              )}
              {item.label && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={`flex items-center justify-start gap-2.5 w-full px-3.5 py-2 text-sm transition-colors h-auto font-normal rounded-none ${
                    item.danger
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                  role="menuitem"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;

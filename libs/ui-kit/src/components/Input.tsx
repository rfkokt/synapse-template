import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { LuEye as Eye, LuEyeOff as EyeOff } from 'react-icons/lu';
import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Show built-in eye toggle when type="password" (default: true) */
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, id, type, disabled, showPasswordToggle = true, ...props },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const hintId = hint && inputId ? `${inputId}-hint` : undefined;
    const hasPasswordToggle = type === 'password' && showPasswordToggle;
    const resolvedType = hasPasswordToggle && isPasswordVisible ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              'h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-sm transition-colors',
              'placeholder:text-neutral-400',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100',
              hasPasswordToggle && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          {hasPasswordToggle && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={isPasswordVisible ? 'Sembunyikan password' : 'Lihat password'}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="text-xs text-neutral-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

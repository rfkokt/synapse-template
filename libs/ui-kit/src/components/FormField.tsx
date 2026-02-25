import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

/**
 * FormField — wraps any form input with label, error, and hint.
 *
 * Works with any input component (Input, select, textarea, etc.)
 * and integrates naturally with useFormValidation hook.
 */
export interface FormFieldProps {
  /** Field name — used for id generation and aria attributes */
  name: string;
  /** Label text shown above the input */
  label?: string;
  /** Error message — shown in red below the input */
  error?: string;
  /** Hint text — shown below the input when no error */
  hint?: string;
  /** Whether the field is required — adds asterisk to label */
  required?: boolean;
  /** The input element(s) to wrap */
  children: ReactNode;
  /** Additional className for the wrapper */
  className?: string;
}

export function FormField({
  name,
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint && !error ? `${name}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={hintId} className="text-xs text-neutral-500 dark:text-neutral-400">
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

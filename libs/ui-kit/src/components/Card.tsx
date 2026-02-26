import type { ReactNode, JSX } from 'react';
import { cn } from '../utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

const variantStyles = {
  default:
    'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm',
  outlined: 'bg-transparent border-2 border-neutral-300 dark:border-neutral-700',
  elevated: 'bg-white dark:bg-neutral-900 shadow-lg',
};

export function Card({ children, className, variant = 'default' }: CardProps): JSX.Element {
  return (
    <div className={cn('rounded-lg p-6 transition-colors', variantStyles[variant], className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-100', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <p className={cn('text-sm text-neutral-500 dark:text-neutral-400 mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <div className={cn('mt-4 flex items-center gap-2', className)}>{children}</div>;
}

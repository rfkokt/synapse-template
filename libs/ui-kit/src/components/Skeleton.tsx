import type { JSX } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const variantStyles = {
  text: 'h-4 w-full rounded',
  circular: 'h-10 w-10 rounded-full',
  rectangular: 'h-32 w-full rounded-lg',
};

export function Skeleton({ className, variant = 'text' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn('animate-pulse bg-neutral-200', variantStyles[variant], className)}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

import React from 'react';
import { cn } from '@synapse/ui-kit';

export type DocsStepColor = 'emerald' | 'indigo' | 'slate';

interface DocsStepProps {
  title: React.ReactNode;
  color?: DocsStepColor;
  className?: string;
  children: React.ReactNode;
}

const colorVariants: Record<DocsStepColor, string> = {
  emerald: 'border-emerald-400 dark:border-emerald-600',
  indigo: 'border-indigo-400 dark:border-indigo-600',
  slate: 'border-slate-400 dark:border-slate-600',
};

export function DocsStep({ title, color = 'emerald', className, children }: DocsStepProps) {
  return (
    <div className={cn('border-l-4 pl-4 space-y-2', colorVariants[color], className)}>
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      {children}
    </div>
  );
}

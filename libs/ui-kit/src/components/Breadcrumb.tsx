import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onNavigate?: (href: string) => void;
}

export function Breadcrumb({ items, className, onNavigate }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm text-neutral-500', className)}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span
                  className="font-semibold text-neutral-900 dark:text-neutral-100"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      if (item.href && onNavigate) {
                        onNavigate(item.href);
                      }
                    }}
                    className={cn(
                      'px-0 py-0 h-auto font-normal bg-transparent hover:bg-transparent transition-colors',
                      item.href
                        ? 'hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer'
                        : 'cursor-default'
                    )}
                  >
                    {item.label}
                  </Button>
                  <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0 text-neutral-400" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

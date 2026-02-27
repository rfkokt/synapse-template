import type { JSX } from 'react';
import { LuTriangleAlert as AlertTriangle, LuRefreshCw as RefreshCw } from 'react-icons/lu';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { cn } from '../utils/cn';

export type ErrorFallbackVariant = 'compact' | 'default' | 'full';

export interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
  variant?: ErrorFallbackVariant;
  actionLabel?: string;
  showErrorMessage?: boolean;
  className?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Terjadi Kesalahan',
  description = 'Modul tidak dapat dimuat. Silakan coba lagi.',
  variant = 'default',
  actionLabel = 'Coba Lagi',
  showErrorMessage = true,
  className,
}: ErrorFallbackProps): JSX.Element {
  const isCompact = variant === 'compact';
  const isFull = variant === 'full';

  const iconSizeClass = isCompact ? 'h-5 w-5' : isFull ? 'h-7 w-7' : 'h-6 w-6';
  const iconContainerSizeClass = isCompact ? 'h-10 w-10' : isFull ? 'h-14 w-14' : 'h-12 w-12';

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        isCompact ? 'min-h-[140px] p-4' : isFull ? 'min-h-[320px] p-8' : 'min-h-[200px] p-6',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Card
        variant="outlined"
        className={cn(
          'w-full border-error/30 bg-white/95 shadow-sm transition-all dark:border-error/40 dark:bg-neutral-900/95',
          isCompact && 'max-w-sm !p-4 text-left',
          variant === 'default' && 'max-w-md text-center',
          isFull &&
            'max-w-2xl !p-8 text-center bg-gradient-to-b from-white to-error/5 dark:from-neutral-900 dark:to-error/10'
        )}
      >
        <CardContent>
          <div className={cn('flex gap-4', isCompact ? 'items-start' : 'flex-col items-center')}>
            <div
              className={cn('relative flex items-center justify-center', iconContainerSizeClass)}
            >
              <span className="absolute inset-0 rounded-full bg-error/25 motion-safe:animate-ping" />
              <span
                className={cn(
                  'relative flex items-center justify-center rounded-full bg-error/10',
                  iconContainerSizeClass
                )}
              >
                <AlertTriangle
                  className={cn('text-error motion-safe:animate-pulse', iconSizeClass)}
                />
              </span>
            </div>

            <div className={cn('min-w-0', isCompact ? 'flex-1' : 'max-w-xl')}>
              <h3
                className={cn(
                  'font-semibold text-neutral-900 dark:text-neutral-100',
                  isCompact ? 'text-base' : 'text-lg'
                )}
              >
                {title}
              </h3>
              <p
                className={cn(
                  'mt-1 text-neutral-500 dark:text-neutral-400',
                  isCompact ? 'text-xs' : 'text-sm'
                )}
              >
                {description}
              </p>

              {showErrorMessage && error?.message && (
                <p
                  className={cn(
                    'mt-2 break-words rounded-md bg-neutral-100 font-mono text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300',
                    isCompact ? 'px-2 py-1.5 text-[11px]' : 'p-2 text-xs'
                  )}
                >
                  {error.message}
                </p>
              )}

              <div className={cn('mt-3', isCompact ? '' : 'flex flex-col items-center gap-2')}>
                {resetErrorBoundary ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetErrorBoundary}
                    className="group border-error/40 text-error hover:bg-error/5"
                  >
                    <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                    {actionLabel}
                  </Button>
                ) : (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Muat ulang halaman jika error tetap muncul.
                  </p>
                )}

                {isFull && (
                  <p className="max-w-md text-xs text-neutral-500 dark:text-neutral-400">
                    Jika error terus berulang, cek koneksi jaringan, console browser, dan status
                    service remote.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

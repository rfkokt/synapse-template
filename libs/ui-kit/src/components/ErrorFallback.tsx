import type { JSX } from 'react';
import { LuTriangleAlert as AlertTriangle, LuRefreshCw as RefreshCw } from 'react-icons/lu';
import { Button } from './Button';
import { Card, CardContent } from './Card';

export interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Terjadi Kesalahan',
  description = 'Modul tidak dapat dimuat. Silakan coba lagi.',
}: ErrorFallbackProps): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6" role="alert">
      <Card variant="outlined" className="max-w-md w-full text-center">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{description}</p>
              {error?.message && (
                <p className="text-xs text-neutral-400 mt-2 font-mono bg-neutral-100 p-2 rounded">
                  {error.message}
                </p>
              )}
            </div>
            {resetErrorBoundary && (
              <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

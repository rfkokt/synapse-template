import { Suspense, type ReactNode } from 'react';
import { Skeleton } from '@synapse/ui-kit';
import { ErrorBoundary } from './ErrorBoundary';

interface RemoteLoaderProps {
  children: ReactNode;
}

function LoadingFallback() {
  return (
    <div className="flex flex-col gap-4 p-6 animate-in fade-in" aria-busy="true">
      <Skeleton variant="text" className="h-8 w-48" />
      <Skeleton variant="rectangular" className="h-48" />
      <div className="flex gap-4">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Wraps remote MFE components with Suspense + Error Boundary.
 * Required per PRD: "Setiap remote import wajib dibungkus React.Suspense dan Error Boundary"
 */
export function RemoteLoader({ children }: RemoteLoaderProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

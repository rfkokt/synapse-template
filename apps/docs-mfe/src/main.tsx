import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { useAuthStore } from '@synapse/shared-types';
import './index.css';
import { App } from './App';

function StandaloneAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new window.URLSearchParams(window.location.search);
      const authData = urlParams.get('standaloneAuth');
      if (authData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(authData));
          useAuthStore.getState().setAuth(parsed.token, parsed.user);

          // Clean up URL to prevent leak and reload loop
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
          return;
        } catch (e) {
          console.error('Failed to parse standalone auth', e);
        }
      }
    }

    if (!isHydrating && !isAuthenticated) {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `http://localhost:4000/auth/login?redirect=${currentUrl}`;
    }
  }, [isHydrating, isAuthenticated]);

  if (isHydrating || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return <>{children}</>;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <StandaloneAuthGuard>
        <div className="min-h-screen bg-neutral-50 p-4">
          <header className="mb-8 pl-4 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <p className="text-sm text-neutral-500 font-medium">
              Standalone Mode - Secured (Port 4003)
            </p>
          </header>
          <App />
        </div>
      </StandaloneAuthGuard>
    </BrowserRouter>
  </StrictMode>
);

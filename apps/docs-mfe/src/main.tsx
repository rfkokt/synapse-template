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
    // We removed URL standaloneAuth sync logic for security. Local login screen is used instead.
  }, [isHydrating, isAuthenticated]);

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Standalone Access</h2>
          <p className="text-sm text-neutral-500 mb-6">
            MFE ini berjalan di mode terisolasi. Silakan login untuk melanjutkan versi development.
          </p>
          <button
            onClick={() => {
              useAuthStore.getState().setAuth('mock-standalone-token', {
                id: 'dev-user',
                name: 'Developer (MFE Local)',
                email: 'dev@synapse.local',
                role: 'developer',
              });
            }}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Masuk sebagai Developer
          </button>
        </div>
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

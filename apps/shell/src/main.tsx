import { StrictMode } from 'react';
import { initMsw } from '@synapse/mock-api';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initMonitoring, ErrorBoundary } from '@synapse/shared-monitoring';
import { useAuthStore } from '@synapse/shared-types';
import './index.css';
import { registerRuntimeRemotesFromRegistry } from './utils/runtime-remotes';

async function bootstrap() {
  const shouldEnableMsw =
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false');

  if (shouldEnableMsw) {
    await initMsw();
  }

  try {
    await registerRuntimeRemotesFromRegistry();
  } catch (error) {
    console.warn('[RemoteRegistry] Failed to register runtime remotes:', error);
  }

  // Initialize monitoring before the app renders.
  initMonitoring();
  useAuthStore.getState().setHydrating(true);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary
        fallback={
          <div className="p-4 text-rose-600 bg-rose-50 rounded-md">
            Terjadi Kesalahan Aplikasi. Tim kami sudah dinotifikasi.
          </div>
        }
      >
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

void bootstrap();

import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@synapse/shared-api';
import { AppRouter } from './router';
import { useAuthEvents } from './hooks/useAuthEvents';
import { useSessionBootstrap } from './hooks/useSessionBootstrap';

function AuthEventListener() {
  useAuthEvents();
  return null;
}

function SessionBootstrapper() {
  useSessionBootstrap();
  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:font-bold focus:rounded focus:shadow-lg dark:focus:bg-neutral-800 dark:focus:text-blue-400"
      >
        Lanjut ke konten utama (Skip to main content)
      </a>
      <BrowserRouter>
        <SessionBootstrapper />
        <AuthEventListener />
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

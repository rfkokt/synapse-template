import { useAuthStore } from '@synapse/shared-types';
import { StrictMode, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import { App } from './App';

function StandaloneAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DEV_USERNAME = 'dev@synapse.local';
  const DEV_PASSWORD = 'password123';

  const handleStandaloneLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().toLowerCase() !== DEV_USERNAME || password !== DEV_PASSWORD) {
      setError('Invalid username or password.');
      return;
    }

    useAuthStore.getState().setAuth({
      id: 'dev-user',
      name: 'Developer (MFE Local)',
      email: DEV_USERNAME,
      role: 'developer',
    });
  };

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
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Standalone Access</h2>
          <p className="text-sm text-neutral-500 mb-6">
            This MFE runs in isolated development mode. Login locally to continue.
          </p>
          <form className="space-y-3 text-left" onSubmit={handleStandaloneLogin}>
            <div>
              <label
                htmlFor="standalone-username"
                className="block text-xs font-medium text-neutral-600 mb-1"
              >
                Username
              </label>
              <input
                id="standalone-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label
                htmlFor="standalone-password"
                className="block text-xs font-medium text-neutral-600 mb-1"
              >
                Password
              </label>
              <input
                id="standalone-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter password"
              />
            </div>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Login Standalone
            </button>
          </form>
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-left">
            <p className="text-xs font-semibold text-neutral-700 mb-1">
              Dev Credentials (Standalone):
            </p>
            <p className="text-xs text-neutral-600">
              Username: <code className="bg-neutral-200 px-1 rounded">dev@synapse.local</code>
            </p>
            <p className="text-xs text-neutral-600">
              Password: <code className="bg-neutral-200 px-1 rounded">password123</code>
            </p>
          </div>
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
          <header className="mb-8 pl-4">
            <p className="text-sm text-warning font-medium">
              Standalone Mode - Secured (Port 4005)
            </p>
          </header>
          <App />
        </div>
      </StandaloneAuthGuard>
    </BrowserRouter>
  </StrictMode>
);

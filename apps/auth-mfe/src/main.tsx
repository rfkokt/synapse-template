import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import '@synapse/shared-types'; // Initializes i18n
import { initMsw } from '@synapse/mock-api';
import './index.css';

/**
 * Standalone entry point for auth-mfe.
 * Only used during standalone development (port 4001).
 * When loaded via Module Federation, Shell provides its own routing.
 */
async function bootstrap() {
  const shouldEnableMsw =
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false');

  if (shouldEnableMsw) {
    await initMsw();
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* Support Shell-style /auth/* paths in standalone */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

void bootstrap();

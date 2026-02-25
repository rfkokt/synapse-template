import { type FormEvent, type ChangeEvent, useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@synapse/ui-kit';
import { MFE_EVENTS, dispatchMfeEvent, SharedOriginGuard } from '@synapse/shared-types';
import type { AuthEventPayload } from '@synapse/shared-types';
import { LogIn, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const { t } = useTranslation('auth');

  // Extract redirect query param on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new window.URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      if (redirectParam) {
        setRedirectUrl(redirectParam);
      }
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call (replace with actual apiClient.post when backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      if (email && password) {
        const payload: AuthEventPayload = {
          userId: 'usr_' + Date.now(),
          accessToken: 'mock_access_token_' + Date.now(),
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        };

        // Dispatch event — Shell will pick this up and redirect to dashboard
        dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, payload);

        const user = {
          id: payload.userId,
          email,
          name: email.split('@')[0],
          role: 'user',
        };

        // Also update the shared store directly for immediate effect
        const { useAuthStore } = await import('@synapse/shared-types');
        useAuthStore.getState().setAuth(payload.accessToken, user);

        // Execute standalone redirection immediately if present, bypassing normal flow
        if (redirectUrl) {
          const authData = encodeURIComponent(JSON.stringify({ token: payload.accessToken, user }));
          const separator = redirectUrl.includes('?') ? '&' : '?';
          window.location.href = redirectUrl + separator + 'standaloneAuth=' + authData;
          return; // stop execution
        }

        // Show success state (Shell will auto-redirect via useAuthEvents)
        setSuccess(true);
      } else {
        setError(t('login.errorEmpty'));
      }
    } catch {
      setError(t('login.errorAuth'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
        <Card variant="elevated" className="max-w-md w-full text-center shadow-xl">
          <CardContent className="py-8">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">{t('login.success')}</h2>
            <p className="text-neutral-500 mb-6">
              {t('login.welcome', { name: email.split('@')[0] })}
            </p>
            <p className="text-sm text-neutral-400">
              {redirectUrl ? (
                <>
                  {t('login.redirectingApp').split('...')[0] + ' '}
                  <a href={redirectUrl} className="text-primary-600 hover:underline font-medium">
                    {t('login.redirectingApp').split('...')[1] || '...'}
                  </a>
                </>
              ) : (
                <>
                  {t('login.redirectingShell')}{' '}
                  <a
                    href="http://localhost:4000"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    Shell (localhost:4000)
                  </a>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SharedOriginGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('login.title')}
            </h1>
            <p className="text-neutral-500 mt-2">{t('login.subtitle')}</p>
          </div>

          <Card variant="elevated" className="shadow-xl">
            <CardHeader>
              <CardTitle>{t('login.cardTitle')}</CardTitle>
              <CardDescription>{t('login.cardDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    className="p-3 rounded-lg bg-error/10 text-error text-sm border border-error/20"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <Input
                  label={t('login.emailLabel')}
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />

                <div className="relative">
                  <Input
                    label={t('login.passwordLabel')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-8 h-8 w-8 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100/50 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  <LogIn className="h-4 w-4" />
                  {t('login.submit')}
                </Button>

                <p className="text-center text-sm text-neutral-500">
                  {t('login.noAccount')}{' '}
                  <a
                    href="/auth/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('login.register')}
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedOriginGuard>
  );
}

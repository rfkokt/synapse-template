import { type FormEvent, type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@synapse/ui-kit';
import {
  MFE_EVENTS,
  dispatchMfeEvent,
  SharedOriginGuard,
  useAuthStore,
  getSafeRedirectTarget,
} from '@synapse/shared-types';
import type { AuthEventPayload, User, AppError } from '@synapse/shared-types';
import { apiClient, API } from '@synapse/shared-api';
import {
  LuLogIn as LogIn,
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuCircleCheck as CheckCircle,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface LoginResponse {
  user: User;
}

type DemoLoginRole = 'admin' | 'manager' | 'developer' | 'user';

const DEMO_ROLE_ACCOUNTS: Record<
  DemoLoginRole,
  { label: string; email: string; password: string; description: string }
> = {
  admin: {
    label: 'Admin',
    email: 'admin@Synapse.com',
    password: 'password123',
    description: 'Akses penuh termasuk User Management.',
  },
  manager: {
    label: 'Manager',
    email: 'manager@Synapse.com',
    password: 'password123',
    description: 'Akses laporan & operasional.',
  },
  developer: {
    label: 'Developer',
    email: 'dev@Synapse.com',
    password: 'password123',
    description: 'Akses menu dokumentasi dan UI Kit.',
  },
  user: {
    label: 'User',
    email: 'user@Synapse.com',
    password: 'password123',
    description: 'Akses fitur operasional dasar.',
  },
};

const DEMO_ROLE_ORDER: DemoLoginRole[] = ['admin', 'manager', 'developer', 'user'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState<DemoLoginRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [safeRedirectTarget, setSafeRedirectTarget] = useState<string | null>(null);
  const { t } = useTranslation('auth');
  const shellUrl = import.meta.env.VITE_SHELL_URL || 'http://localhost:4000';
  const shouldUseMsw =
    import.meta.env.VITE_ENABLE_MSW === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false');
  const showMockCredentials = import.meta.env.DEV && shouldUseMsw;

  const applyDemoCredentials = (role: DemoLoginRole) => {
    const account = DEMO_ROLE_ACCOUNTS[role];
    setSelectedDemoRole(role);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new window.URLSearchParams(window.location.search);
      setSafeRedirectTarget(getSafeRedirectTarget(urlParams.get('redirect')));
    }
  }, []);

  useEffect(() => {
    if (!showMockCredentials) return;
    if (email || password) return;
    applyDemoCredentials(selectedDemoRole);
  }, [showMockCredentials]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError(t('login.errorEmpty'));
        return;
      }

      const res = await apiClient.post<LoginResponse>(API.auth.login(), { email, password });
      const user = res.data.user;

      if (!user) {
        throw new Error(t('login.errorAuth'));
      }

      const payload: AuthEventPayload = {
        userId: user.id,
        user,
        expiresAt: Date.now() + 15 * 60 * 1000,
      };

      // Dispatch event — Shell will pick this up and redirect to dashboard
      dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, payload);

      // Also update the shared store directly for immediate effect
      useAuthStore.getState().setAuth(user);

      if (safeRedirectTarget) {
        window.location.assign(safeRedirectTarget);
        return;
      }

      // Show success state (Shell will auto-redirect via useAuthEvents)
      setSuccess(true);
    } catch (error) {
      const appError = error as AppError | undefined;
      setError(appError?.message || t('login.errorAuth'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
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
              {safeRedirectTarget ? (
                <>
                  {t('login.redirectingApp').split('...')[0] + ' '}
                  <a
                    href={safeRedirectTarget}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {t('login.redirectingApp').split('...')[1] || '...'}
                  </a>
                </>
              ) : (
                <>
                  {t('login.redirectingShell')}{' '}
                  <a href={shellUrl} className="text-primary-600 hover:underline font-medium">
                    Shell ({shellUrl.replace(/^https?:\/\//, '')})
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
                  onKeyDown={handleInputEnter}
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
                    onKeyDown={handleInputEnter}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                    showPasswordToggle={false}
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

                {showMockCredentials ? (
                  <div className="rounded-lg border border-dashed border-primary-200 bg-primary-50/70 p-3">
                    <p className="mb-2 text-xs font-semibold text-primary-900">
                      Quick Role Login (Dev)
                    </p>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {DEMO_ROLE_ORDER.map((role) => (
                        <Button
                          key={role}
                          type="button"
                          size="sm"
                          variant={selectedDemoRole === role ? 'primary' : 'outline'}
                          onClick={() => applyDemoCredentials(role)}
                          className="h-7 px-2.5 text-xs"
                        >
                          {DEMO_ROLE_ACCOUNTS[role].label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-primary-900/80">
                      {DEMO_ROLE_ACCOUNTS[selectedDemoRole].description}
                    </p>
                  </div>
                ) : null}

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

              {showMockCredentials ? (
                <div className="mt-4 rounded-lg border border-dashed border-primary-200 bg-primary-50/60 px-3 py-3 text-xs text-primary-900">
                  <p className="font-semibold mb-2">Kredensial Mock Login (Dev):</p>
                  {DEMO_ROLE_ORDER.map((role) => (
                    <p key={role}>
                      {DEMO_ROLE_ACCOUNTS[role].label}:{' '}
                      <code className="rounded bg-white/80 px-1">
                        {DEMO_ROLE_ACCOUNTS[role].email}
                      </code>{' '}
                      /{' '}
                      <code className="rounded bg-white/80 px-1">
                        {DEMO_ROLE_ACCOUNTS[role].password}
                      </code>
                    </p>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedOriginGuard>
  );
}

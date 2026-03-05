import { SharedOriginGuard } from '@synapse/shared-types';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@synapse/ui-kit';
import { type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LuLogIn as LogIn,
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuCircleCheck as CheckCircle,
} from 'react-icons/lu';
import {
  useLoginForm,
  DEMO_ROLE_ACCOUNTS,
  DEMO_ROLE_ORDER,
  type DemoLoginRole,
} from './useLoginForm';

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function LoginSuccessCard({
  email,
  safeRedirectTarget,
  shellUrl,
  t,
}: {
  email: string;
  safeRedirectTarget: string | null;
  shellUrl: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
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

function DemoCredentialPicker({
  selectedDemoRole,
  onSelectRole,
}: {
  selectedDemoRole: DemoLoginRole;
  onSelectRole: (role: DemoLoginRole) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-primary-200 bg-primary-50/70 p-3">
      <p className="mb-2 text-xs font-semibold text-primary-900">Quick Role Login (Dev)</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {DEMO_ROLE_ORDER.map((role) => (
          <Button
            key={role}
            type="button"
            size="sm"
            variant={selectedDemoRole === role ? 'primary' : 'outline'}
            onClick={() => onSelectRole(role)}
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
  );
}

function DemoCredentialInfo() {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-primary-200 bg-primary-50/60 px-3 py-3 text-xs text-primary-900">
      <p className="font-semibold mb-2">Kredensial Mock Login (Dev):</p>
      {DEMO_ROLE_ORDER.map((role) => (
        <p key={role}>
          {DEMO_ROLE_ACCOUNTS[role].label}:{' '}
          <code className="rounded bg-white/80 px-1">{DEMO_ROLE_ACCOUNTS[role].email}</code> /{' '}
          <code className="rounded bg-white/80 px-1">{DEMO_ROLE_ACCOUNTS[role].password}</code>
        </p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Login Page
   ───────────────────────────────────────────── */

export default function Login() {
  const { t } = useTranslation('auth');
  const form = useLoginForm(t);

  const handleInputEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  if (form.success) {
    return (
      <LoginSuccessCard
        email={form.email}
        safeRedirectTarget={form.safeRedirectTarget}
        shellUrl={form.shellUrl}
        t={t}
      />
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
              <form onSubmit={form.handleSubmit} className="space-y-4">
                {form.error && (
                  <div
                    className="p-3 rounded-lg bg-error/10 text-error text-sm border border-error/20"
                    role="alert"
                  >
                    {form.error}
                  </div>
                )}

                <Input
                  label={t('login.emailLabel')}
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={form.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => form.setEmail(e.target.value)}
                  onKeyDown={handleInputEnter}
                  required
                  autoComplete="email"
                  autoFocus
                />

                <div className="relative">
                  <Input
                    label={t('login.passwordLabel')}
                    type={form.showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={form.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      form.setPassword(e.target.value)
                    }
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
                    onClick={() => form.setShowPassword(!form.showPassword)}
                    aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                  >
                    {form.showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {form.showMockCredentials ? (
                  <DemoCredentialPicker
                    selectedDemoRole={form.selectedDemoRole}
                    onSelectRole={form.applyDemoCredentials}
                  />
                ) : null}

                <Button type="submit" className="w-full" size="lg" isLoading={form.isLoading}>
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

              {form.showMockCredentials ? <DemoCredentialInfo /> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedOriginGuard>
  );
}

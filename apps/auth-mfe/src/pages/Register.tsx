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
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SharedOriginGuard } from '@synapse/shared-types';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.errorMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('register.errorLength'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (name && email && password) {
        setSuccess(true);
      }
    } catch {
      setError(t('register.errorReg'));
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
              <UserPlus className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              {t('register.successTitle')}
            </h2>
            <p className="text-neutral-500 mb-6">{t('register.successDescription')}</p>
            <Button variant="primary" onClick={() => (window.location.href = '/auth/login')}>
              {t('register.toLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SharedOriginGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('register.title')}
            </h1>
            <p className="text-neutral-500 mt-2">{t('register.subtitle')}</p>
          </div>

          <Card variant="elevated" className="shadow-xl">
            <CardHeader>
              <CardTitle>{t('register.cardTitle')}</CardTitle>
              <CardDescription>{t('register.cardDescription')}</CardDescription>
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
                  label={t('register.nameLabel')}
                  type="text"
                  placeholder={t('register.namePlaceholder')}
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  autoFocus
                />

                <Input
                  label={t('login.emailLabel')}
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <div className="relative">
                  <Input
                    label={t('login.passwordLabel')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('register.passwordHint')}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    hint={t('register.passwordHint')}
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

                <Input
                  label={t('register.confirmPasswordLabel')}
                  type="password"
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  autoComplete="new-password"
                  error={
                    confirmPassword && password !== confirmPassword
                      ? t('register.errorMismatch')
                      : undefined
                  }
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  <UserPlus className="h-4 w-4" />
                  {t('register.submit')}
                </Button>

                <p className="text-center text-sm text-neutral-500">
                  {t('register.hasAccount')}{' '}
                  <a
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('register.login')}
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

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';
import { DocsStep } from '../components/DocsStep';

export function DocsI18nSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          🌐 Internationalization (i18n)
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Panduan penggunaan multi-bahasa (Indonesia, English, Arabic) di aplikasi Synapse MFE.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengantar i18n</CardTitle>
          <CardDescription>
            Platform Micro-Frontend Synapse MFE telah dilengkapi dengan konfigurasi{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">i18next</code> dan{' '}
            <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">react-i18next</code>{' '}
            yang terpusat pada library <strong>@synapse/shared-types</strong>. Anda tidak perlu
            melakukan konfigurasi ulang di setiap MFE.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocsStep title="1. Lokasi File Translasi (Kamus)" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Semua file bahasa (JSON) diatur secara terpusat agar konsisten antar-MFE. Anda bisa
              menemukan atau menambahkan keys baru di path berikut:
            </p>
            <CodeBlock
              language="bash"
              codeString={`libs/shared-types/src/locales/
├── id/           # Bahasa Indonesia (Default)
│   ├── common.json
│   └── auth.json
├── en/           # English
│   ├── common.json
│   └── auth.json
└── ar/           # Arabic
    ├── common.json
    └── auth.json`}
            />
          </DocsStep>

          <DocsStep title="2. Menggunakan Translasi di Komponen (React)" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Gunakan *hook*{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-emerald-700 dark:text-emerald-400">
                useTranslation
              </code>{' '}
              dari{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">react-i18next</code>{' '}
              untuk menerjemahkan teks di komponen Anda.
            </p>
            <CodeBlock
              language="tsx"
              codeString={`import { useTranslation } from 'react-i18next';

export function ComponentContoh() {
  // 'common' adalah nama namespace (file common.json)
  const { t } = useTranslation('common');

  return (
    <div>
      {/* Mengambil nilai dari "welcome" di common.json */}
      <h1>{t('welcome')}</h1>
      
      {/* Teks dengan default fallback jika key tidak ditemukan */}
      <button>{t('submit_button', 'Simpan')}</button>
    </div>
  );
}`}
            />
          </DocsStep>

          <DocsStep
            title="3. Menggunakan Translasi di Luar Komponen (Zustand / Axios)"
            color="slate"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jika Anda butuh memanggil fungsi translasi di dalam fungsi Reducer, Store Zustand,
              atau Interceptor Axios (di luar React lifecycle), Anda dapat meng-import *instance*
              `i18n` langsung.
            </p>
            <CodeBlock
              language="tsx"
              codeString={`import { i18n } from '@synapse/shared-types';

export const actionLuarReact = () => {
  // Gunakan i18n.t() alih-alih hook
  const pesanError = i18n.t('error_network', { ns: 'common' });
  console.log(pesanError);
};`}
            />
          </DocsStep>

          <DocsStep title="4. Mengganti Bahasa Dinamis (Language Switcher)" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Untuk mengganti bahasa secara *real-time* di seluruh aplikasi (semua MFE akan ikut
              berubah), gunakan fungsi{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                i18n.changeLanguage
              </code>
              .
            </p>
            <CodeBlock
              language="tsx"
              codeString={`import { useTranslation } from 'react-i18next';
import { Button } from '@synapse/ui-kit';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang);
    // lang options: 'id', 'en', 'ar'
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleLangChange('en')}>English</Button>
      <Button onClick={() => handleLangChange('id')}>Indonesia</Button>
      <Button onClick={() => handleLangChange('ar')}>العربية</Button>
    </div>
  );
}`}
            />
          </DocsStep>
        </CardContent>
      </Card>
    </div>
  );
}

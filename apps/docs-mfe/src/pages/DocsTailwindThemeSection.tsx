import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsTailwindThemeSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-400 text-sm font-bold">
              9a
            </span>
            Tailwind CSS v4
          </CardTitle>
          <CardDescription>Styling sudah terkonfigurasi otomatis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Semua MFE sudah support Tailwind v4. Token tema didefinisikan di file{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              src/theme.css
            </code>
            masing-masing aplikasi agar fleksibel per domain.
          </p>
          <CodeBlock
            language="tsx"
            codeString={`// Langsung pakai class Tailwind
<div className="text-primary-600 bg-primary-50">
  Teks Brand!
</div>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-400 text-sm font-bold">
              9b
            </span>
            Theme Customization
          </CardTitle>
          <CardDescription>Mengganti warna brand global</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Ubah token di app yang ingin disesuaikan (contoh shell), lalu sinkronkan ke app lain
            jika ingin konsisten global:
          </p>
          <CodeBlock
            language="css"
            codeString={`/* apps/shell/src/theme.css */
@theme {
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-900: #14532d;
}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

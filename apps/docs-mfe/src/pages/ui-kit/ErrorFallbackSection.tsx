import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  ErrorFallback,
  type ErrorFallbackVariant,
} from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

const demoError = new Error('GET /api/users gagal (500 Internal Server Error)');

const variantCode = `import { ErrorFallback } from '@synapse/ui-kit';

<ErrorFallback
  title="Gagal Memuat Data"
  description="Terjadi gangguan saat mengambil data dari server."
  error={new Error('GET /api/users gagal (500)')}
  variant="default" // compact | default | full
  actionLabel="Coba Lagi"
  resetErrorBoundary={() => window.location.reload()}
/>;
`;

const boundaryCode = `import { ErrorFallback, type ErrorFallbackProps } from '@synapse/ui-kit';
import { ErrorBoundary } from 'react-error-boundary';

const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <ErrorFallback
    error={error}
    resetErrorBoundary={resetErrorBoundary}
    title="Widget Bermasalah"
    description="Silakan coba lagi atau muat ulang halaman."
    variant="default"
  />
);

<ErrorBoundary FallbackComponent={Fallback}>
  <SomeComponent />
</ErrorBoundary>;`;

export function ErrorFallbackSection() {
  const [variant, setVariant] = useState<ErrorFallbackVariant>('default');
  const [resetCount, setResetCount] = useState(0);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="ErrorFallback"
          description="Fallback UI siap pakai untuk Error Boundary, dengan mode compact/default/full."
        />

        <PreviewCard title="Interactive Variants">
          <ExampleTabs
            preview={
              <div className="w-full max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(['compact', 'default', 'full'] as ErrorFallbackVariant[]).map((option) => (
                    <Button
                      key={option}
                      size="sm"
                      variant={variant === option ? 'primary' : 'outline'}
                      onClick={() => setVariant(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                <ErrorFallback
                  title="Gagal Memuat Data"
                  description="Terjadi gangguan saat mengambil data dari server."
                  error={demoError}
                  variant={variant}
                  actionLabel={variant === 'full' ? 'Muat Ulang Modul' : 'Coba Lagi'}
                  resetErrorBoundary={() => setResetCount((count) => count + 1)}
                />

                <p className="text-xs text-neutral-500">
                  Simulasi klik reset: <strong>{resetCount}</strong> kali
                </p>
              </div>
            }
            code={variantCode}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>

        <PreviewCard title="Usage di ErrorBoundary" className="mb-0">
          <ExampleTabs
            preview={
              <ErrorFallback
                title="Widget Bermasalah"
                description="Silakan coba lagi atau muat ulang halaman."
                error={demoError}
                variant="default"
                showErrorMessage={false}
              />
            }
            code={boundaryCode}
          />
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['error', 'Error', '—'],
            ['resetErrorBoundary', '() => void', '—'],
            ['title', 'string', '"Terjadi Kesalahan"'],
            ['description', 'string', '"Modul tidak dapat dimuat..."'],
            ['variant', '"compact" | "default" | "full"', '"default"'],
            ['actionLabel', 'string', '"Coba Lagi"'],
            ['showErrorMessage', 'boolean', 'true'],
            ['className', 'string', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

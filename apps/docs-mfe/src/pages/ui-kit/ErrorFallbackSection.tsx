import { Button, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock } from './shared';

export function ErrorFallbackSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="ErrorFallback"
          description="Fallback UI untuk React Error Boundary."
        />
        <PreviewCard>
          <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <p className="text-4xl mb-3">⚠️</p>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Terjadi Kesalahan
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Komponen ini ditangkap oleh ErrorBoundary
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Coba Lagi
            </Button>
          </div>
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { ErrorFallback } from '@synapse/ui-kit';
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <SomeComponent />
</ErrorBoundary>`}</CodeBlock>
      </CardContent>
    </Card>
  );
}

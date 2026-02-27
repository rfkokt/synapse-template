import { useState } from 'react';
import { Button, Card, CardContent, ComponentBoundary } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

function RiskyWidget({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error('Simulasi crash dari widget');
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
      Widget berjalan normal.
    </div>
  );
}

export function ComponentBoundarySection() {
  const [crash, setCrash] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="ComponentBoundary"
          description="Isolasi error per-komponen supaya crash lokal tidak menjatuhkan halaman/MFE."
        />

        <PreviewCard title="Try it">
          <ExampleTabs
            preview={
              <div className="w-full max-w-lg space-y-4">
                <ComponentBoundary
                  fallbackTitle="Widget Error"
                  fallbackDescription="Hanya widget ini yang gagal, area lain tetap aman."
                >
                  <RiskyWidget shouldCrash={crash} />
                </ComponentBoundary>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCrash(true)}>
                    Trigger Error
                  </Button>
                  <Button variant="ghost" onClick={() => setCrash(false)}>
                    Reset Demo
                  </Button>
                </div>
              </div>
            }
            code={`import { ComponentBoundary } from '@synapse/ui-kit';

function RiskyWidget() {
  throw new Error('Simulasi crash');
}

<ComponentBoundary
  fallbackTitle="Widget Error"
  fallbackDescription="Widget gagal, halaman tetap jalan."
>
  <RiskyWidget />
</ComponentBoundary>`}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['children', 'ReactNode', '(required)'],
            ['fallback', 'ReactNode', 'Default ErrorFallback'],
            ['fallbackTitle', 'string', 'Terjadi Kesalahan'],
            ['fallbackDescription', 'string', 'Modul tidak dapat dimuat...'],
            ['onError', '(error, errorInfo) => void', 'undefined'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

import { Button, Card, CardContent } from '@synapse/ui-kit';
import { useNotificationStore } from '@synapse/shared-types';
import { SectionHeader, PreviewCard, CodeBlock } from './shared';

export function ToastSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Toast / Notification"
          description="Toast via useNotificationStore. 4 variant."
        />
        <PreviewCard title="Try it">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().success('Data berhasil disimpan!')}
            >
              ✅ Success
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().error('Gagal menyimpan data')}
            >
              ❌ Error
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().warning('Sesi hampir habis')}
            >
              ⚠️ Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().info('Update tersedia')}
            >
              ℹ️ Info
            </Button>
          </div>
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { useNotificationStore } from '@synapse/shared-types';

useNotificationStore.getState().success('Berhasil!');
useNotificationStore.getState().error('Gagal!');`}</CodeBlock>
      </CardContent>
    </Card>
  );
}

import { Badge, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

export function BadgeSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader title="Badge" description="Label status dengan 6 variants." />
        <PreviewCard title="Variants">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </PreviewCard>
        <PreviewCard title="Use Cases">
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">✓ Aktif</Badge>
            <Badge variant="warning">⏳ Pending</Badge>
            <Badge variant="error">✕ Ditolak</Badge>
            <Badge variant="info">3 Baru</Badge>
          </div>
        </PreviewCard>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">Aktif</Badge>
                <Badge variant="error">Ditolak</Badge>
              </div>
            }
            code={`import { Badge } from '@synapse/ui-kit';

<Badge variant="success">Aktif</Badge>
<Badge variant="error">Ditolak</Badge>`}
          />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['variant', 'default | success | warning | error | info | outline', 'default'],
            ['className', 'string', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

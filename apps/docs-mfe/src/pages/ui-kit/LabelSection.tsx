import { Card, CardContent, Label, Input } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

export function LabelSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Label"
          description="Label aksesibel berbasis Radix UI untuk form input."
        />
        <PreviewCard title="Dengan Input">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" placeholder="Masukkan nama..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2 group" data-disabled="true">
              <Label htmlFor="disabled">Disabled Label</Label>
              <Input id="disabled" disabled value="Tidak bisa diedit" />
            </div>
          </div>
        </PreviewCard>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="usage-email">Email</Label>
                <Input id="usage-email" type="email" placeholder="email@example.com" />
              </div>
            }
            code={`import { Label, Input } from '@synapse/ui-kit';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@example.com" />
</div>`}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['htmlFor', 'string', '—'],
            ['className', 'string', '—'],
            ['children', 'ReactNode', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

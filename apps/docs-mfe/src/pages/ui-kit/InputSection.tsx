import { useState } from 'react';
import { Input, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

export function InputSection() {
  const [val, setVal] = useState('');
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Input"
          description="Text input dengan label, error state, dan hint."
        />
        <PreviewCard>
          <div className="space-y-4 max-w-md">
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              hint="Kami tidak akan share email Anda."
            />
            <Input
              label="Password"
              type="password"
              error="Password minimal 8 karakter"
              placeholder="••••••••"
            />
            <Input label="Disabled" disabled value="Tidak bisa diedit" />
          </div>
        </PreviewCard>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full max-w-md space-y-3">
                <Input label="Email" type="email" placeholder="email@example.com" />
                <Input label="Password" error="Minimal 8 karakter" />
                <Input label="Catatan" hint="Opsional" />
              </div>
            }
            code={`import { Input } from '@synapse/ui-kit';

<Input label="Email" type="email" placeholder="email@example.com" />
<Input label="Password" error="Minimal 8 karakter" />
<Input label="Catatan" hint="Opsional" />`}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['label', 'string', '—'],
            ['error', 'string', '—'],
            ['hint', 'string', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

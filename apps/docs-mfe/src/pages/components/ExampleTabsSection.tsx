import { useState } from 'react';
import { Button, Card, CardContent } from '@synapse/ui-kit';
import { ExampleTabs, InfoBox } from '@synapse/shared-components';
import { PropsTable } from '../ui-kit/shared';

const basicCode = `import { ExampleTabs } from '@synapse/shared-components';

<ExampleTabs
  preview={<Button variant="primary">Run Action</Button>}
  code={\`<Button variant="primary">Run Action</Button>\`}
/>;`;

export function ExampleTabsSection() {
  const [count, setCount] = useState(0);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            ExampleTabs
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Wrapper reusable untuk dokumentasi: menampilkan tab <code>Preview</code> dan{' '}
            <code>Code</code> dalam satu komponen.
          </p>
        </div>

        <InfoBox variant="amber" title="Aturan Penggunaan">
          Gunakan <code>ExampleTabs</code> hanya saat ada preview UI/interaksi komponen. Untuk
          snippet setup seperti create file, edit package.json, export index, atau command
          verifikasi, gunakan <code>CodeBlock</code> biasa.
        </InfoBox>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Default (Preview First)
        </h3>
        <ExampleTabs
          preview={
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={() => setCount((prev) => prev + 1)}>
                Click Me
              </Button>
              <span className="text-sm text-neutral-500">Count: {count}</span>
            </div>
          }
          code={`const [count, setCount] = useState(0);

<Button variant="primary" onClick={() => setCount((prev) => prev + 1)}>
  Click Me
</Button>;`}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Open at Code Tab
        </h3>
        <ExampleTabs
          defaultTab="code"
          preview={<Button variant="outline">Secondary Action</Button>}
          code={`<Button variant="outline">Secondary Action</Button>;`}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <ExampleTabs preview={<Button variant="primary">Run Action</Button>} code={basicCode} />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['preview', 'ReactNode', '(required)'],
            ['code', 'string', '(required)'],
            ['language', 'string', '"tsx"'],
            ['defaultTab', '"preview" | "code"', '"preview"'],
            ['className', 'string', '""'],
            ['previewClassName', 'string', '""'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

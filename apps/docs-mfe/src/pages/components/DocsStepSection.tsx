import { Badge, Card, CardContent } from '@synapse/ui-kit';
import { ExampleTabs, DocsStep } from '@synapse/shared-components';

export function DocsStepSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
            DocsStep
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            DocsStep provides a visually distinct container for outlining steps or sequential
            information, marked with a colored left border.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 border-b pb-2">
            Variants (Colors)
          </h2>
          <DocsStep title="1. Emerald Variant" color="emerald">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This is the default variant. It uses an emerald green border to signify positive steps
              like "Membuat MFE Baru".
            </p>
          </DocsStep>
          <DocsStep title="2. Indigo Variant" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The indigo variant is commonly used for secondary steps, like those found in "Menambah
              Package Baru".
            </p>
          </DocsStep>
          <DocsStep title="3. Slate Variant" color="slate">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              A neutral option for steps that don't need to stand out as much.
            </p>
          </DocsStep>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 border-b pb-2">
            Usage
          </h2>
          <ExampleTabs
            preview={
              <div className="w-full max-w-2xl">
                <DocsStep title="Step 1: Installation" color="emerald">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Run <code>pnpm install</code> to get started.
                  </p>
                </DocsStep>
              </div>
            }
            code={`import { DocsStep } from '@synapse/shared-components';

<DocsStep title="Step 1: Installation" color="emerald">
  <p className="text-sm text-neutral-600">
    Run <code>pnpm install</code> to get started.
  </p>
 </DocsStep>`}
            previewClassName="w-full items-start justify-center"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 border-b pb-2">
            Props
          </h2>
          <div className="rounded-md border bg-white dark:bg-neutral-900 overflow-hidden">
            <table className="w-full text-sm text-left text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-medium">
                <tr>
                  <th className="px-4 py-3">Prop</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr>
                  <td className="px-4 py-3 font-mono">title</td>
                  <td className="px-4 py-3 text-neutral-500">ReactNode</td>
                  <td className="px-4 py-3">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono">color</td>
                  <td className="px-4 py-3 text-neutral-500">
                    <Badge variant="outline">'emerald' | 'indigo' | 'slate'</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-500">'emerald'</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono">className</td>
                  <td className="px-4 py-3 text-neutral-500">string</td>
                  <td className="px-4 py-3">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono">children</td>
                  <td className="px-4 py-3 text-neutral-500">ReactNode</td>
                  <td className="px-4 py-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

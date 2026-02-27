import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock, ExampleTabs } from '@synapse/shared-components';
import { SectionHeader, PreviewCard, PropsTable } from '../../pages/ui-kit/shared';

const codeStringExample = `import { CodeBlock } from '@synapse/shared-components';

const tsxSnippet = \`import { Button } from '@synapse/ui-kit';

export function SaveButton() {
  return <Button variant="default">Simpan</Button>;
}\`;

<CodeBlock language="tsx" codeString={tsxSnippet} />;`;

const childrenExample = `import { CodeBlock } from '@synapse/shared-components';

<CodeBlock language="bash">
{\\\`pnpm install
pnpm -C apps/docs-mfe run typecheck\\\`}
</CodeBlock>;`;

export default function CodeBlockSection() {
  const tsxSnippet = `import { Button } from '@synapse/ui-kit';

export function SaveButton() {
  return <Button variant="default">Simpan</Button>;
}`;

  const bashSnippet = `pnpm install
pnpm -C apps/docs-mfe run typecheck`;

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <SectionHeader
          title="CodeBlock"
          description="Komponen untuk menampilkan snippet code dengan header language + tombol copy."
        />

        <section>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Usage</h3>

          <PreviewCard title="USING codeString PROP">
            <ExampleTabs
              preview={
                <div className="w-full max-w-3xl">
                  <CodeBlock language="tsx" codeString={tsxSnippet} />
                </div>
              }
              code={codeStringExample}
            />
          </PreviewCard>

          <PreviewCard title="USING STRING CHILDREN" className="mb-0">
            <ExampleTabs
              preview={
                <div className="w-full max-w-3xl">
                  <CodeBlock language="bash">{bashSnippet}</CodeBlock>
                </div>
              }
              code={childrenExample}
            />
          </PreviewCard>
        </section>

        <section>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Props</h3>
          <PropsTable
            rows={[
              ['codeString', 'string', 'undefined'],
              ['language', 'string', '"bash"'],
              ['children', 'ReactNode', 'undefined'],
            ]}
          />
        </section>
      </CardContent>
    </Card>
  );
}

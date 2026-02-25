import { Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, PropsTable } from '../../pages/ui-kit/shared';
import { CodeBlockTable } from '../../components/CodeBlockTable';
import { CodeBlock } from '../../components/CodeBlock';

const stringExampleCode = `import { CodeBlockTable } from '../../components/CodeBlockTable';

const exampleCode = \`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count is: {count}
    </button>
  );
}\`;

export function MyComponent() {
  return (
    <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-neutral-800">
      <CodeBlockTable codeString={exampleCode} />
    </div>
  );
}`;

const arrayExampleCode = `import { CodeBlockTable } from '../../components/CodeBlockTable';

const arrayCodeLines = [
  "// Instead of passing a single string",
  "// You can also pass an array of strings",
  "const data = ['Apples', 'Oranges', 'Bananas'];",
  "console.log('Fruits:', data);"
];

export function MyComponent() {
  return (
    <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-neutral-800">
      <CodeBlockTable lines={arrayCodeLines} />
    </div>
  );
}`;

export default function CodeBlockTableSection() {
  const exampleCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count is: {count}
    </button>
  );
}`;

  const arrayCodeLines = [
    '// Instead of passing a single string',
    '// You can also pass an array of strings',
    "const data = ['Apples', 'Oranges', 'Bananas'];",
    "console.log('Fruits:', data);",
  ];

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <SectionHeader
          title="CodeBlockTable"
          description="A reusable table component specifically designed for rendering lines of code with line numbers and syntax highlighting. It's used internally by the CodeBlock component but can be used standalone."
        />

        <section>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Usage</h3>

          <PreviewCard title="USING CODE STRING">
            <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-neutral-800">
              <CodeBlockTable codeString={exampleCode} />
            </div>
          </PreviewCard>

          <CodeBlock codeString={stringExampleCode} language="tsx" />
        </section>

        <section>
          <PreviewCard title="USING PRE-SPLIT LINES ARRAY">
            <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-neutral-800">
              <CodeBlockTable lines={arrayCodeLines} />
            </div>
          </PreviewCard>

          <CodeBlock codeString={arrayExampleCode} language="tsx" />
        </section>

        <section>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Props</h3>
          <PropsTable
            rows={[
              ['codeString', 'string', 'undefined'],
              ['lines', 'string[]', 'undefined'],
              ['className', 'string', '""'],
            ]}
          />
          <p className="text-neutral-500 text-sm mt-4">
            Provide either <code>codeString</code> or <code>lines</code>. If both are provided,{' '}
            <code>lines</code> will take precedence.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

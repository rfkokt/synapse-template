import type React from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@synapse/ui-kit';
import { CodeBlock } from '../../components/CodeBlock';

export { CodeBlock };

export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
    </div>
  );
}

export function PreviewCard({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 mb-4 ${className}`}
    >
      {title && (
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function PropsTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Prop</th>
            <th className="text-left px-4 py-2 font-medium">Type</th>
            <th className="text-left px-4 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map(([prop, type, def]) => (
            <tr key={prop}>
              <td className="px-4 py-2">
                <code>{prop}</code>
              </td>
              <td className="px-4 py-2 text-neutral-500">{type}</td>
              <td className="px-4 py-2 text-neutral-400">{def}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExampleTabs({
  preview,
  code,
  language = 'tsx',
  defaultTab = 'preview',
  className = '',
  previewClassName = '',
}: {
  preview: React.ReactNode;
  code: string;
  language?: string;
  defaultTab?: 'preview' | 'code';
  className?: string;
  previewClassName?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="border-b border-neutral-200 bg-neutral-50 px-3 pt-3 dark:border-neutral-800 dark:bg-neutral-950/60">
          <TabList className="border-0 gap-1">
            <Tab value="preview" className="rounded-md rounded-b-none px-3 py-1.5 text-xs">
              Preview
            </Tab>
            <Tab value="code" className="rounded-md rounded-b-none px-3 py-1.5 text-xs">
              Code
            </Tab>
          </TabList>
        </div>

        <TabPanel value="preview" className="rounded-none focus-visible:ring-0">
          <div
            className={`flex min-h-[180px] items-center justify-center p-6 bg-white dark:bg-neutral-900 ${previewClassName}`}
          >
            {preview}
          </div>
        </TabPanel>

        <TabPanel value="code" className="rounded-none focus-visible:ring-0">
          <div className="p-3">
            <CodeBlock codeString={code} language={language} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

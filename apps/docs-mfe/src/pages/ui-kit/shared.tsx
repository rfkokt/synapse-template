import type React from 'react';

export { CodeBlock } from '../../components/CodeBlock';

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

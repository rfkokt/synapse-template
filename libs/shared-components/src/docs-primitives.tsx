import type { ReactNode } from 'react';
import { Tabs, TabList, Tab, TabPanel, ComponentBoundary } from '@synapse/ui-kit';
import { CodeBlock } from './CodeBlock';

/* ═══════════════════════════════════════════════════════
   Reusable Docs Components
   Shared UI primitives for documentation pages.
   Import from '@/components/docs' in any docs page.
   ═══════════════════════════════════════════════════════ */

/* ─── 1. InfoBox ──────────────────────────────────────
   Colored callout box for tips, warnings, errors, etc.
   ──────────────────────────────────────────────────── */
const infoBoxStyles = {
  emerald: {
    container: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    title: 'text-emerald-800 dark:text-emerald-300',
    body: 'text-emerald-700 dark:text-emerald-400',
    code: 'bg-emerald-100 dark:bg-emerald-800',
  },
  blue: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    title: 'text-blue-800 dark:text-blue-300',
    body: 'text-blue-700 dark:text-blue-400',
    code: 'bg-blue-100 dark:bg-blue-800',
  },
  amber: {
    container: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800',
    title: 'text-amber-800 dark:text-amber-300',
    body: 'text-amber-700 dark:text-amber-400',
    code: 'bg-amber-100 dark:bg-amber-800',
  },
  red: {
    container: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
    title: 'text-red-800 dark:text-red-300',
    body: 'text-red-700 dark:text-red-400',
    code: 'bg-red-100 dark:bg-red-800',
  },
  purple: {
    container: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    title: 'text-purple-800 dark:text-purple-300',
    body: 'text-purple-700 dark:text-purple-400',
    code: 'bg-purple-100 dark:bg-purple-800',
  },
  orange: {
    container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    title: 'text-orange-800 dark:text-orange-300',
    body: 'text-orange-700 dark:text-orange-400',
    code: 'bg-orange-100 dark:bg-orange-800',
  },
  neutral: {
    container: 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800',
    title: 'text-neutral-900 dark:text-neutral-100',
    body: 'text-neutral-600 dark:text-neutral-400',
    code: 'bg-neutral-200 dark:bg-neutral-700',
  },
} as const;

export type InfoBoxVariant = keyof typeof infoBoxStyles;

export function InfoBox({
  variant = 'blue',
  title,
  children,
  className = '',
}: {
  variant?: InfoBoxVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const s = infoBoxStyles[variant];
  return (
    <div className={`border rounded-xl p-4 ${s.container} ${className}`}>
      {title && <h4 className={`font-semibold ${s.title} mb-1`}>{title}</h4>}
      <div className={`text-sm ${s.body}`}>{children}</div>
    </div>
  );
}

/* ─── 2. ComparisonTable ──────────────────────────────
   Table with optional highlighted column for the chosen option.
   ────────────────────────────────────────────────────── */
export interface ComparisonColumn {
  header: string;
  /** Mark this column as the "chosen" option (green highlight) */
  highlight?: boolean;
}

export interface ComparisonRow {
  criteria: string;
  values: string[];
}

export function ComparisonTable({
  columns,
  rows,
  className = '',
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-left">
            <th className="px-4 py-3 font-medium">Kriteria</th>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {col.highlight ? (
                  <span className="inline-flex items-center gap-1">
                    {col.header} <span className="text-emerald-500 text-xs">(✓ Dipilih)</span>
                  </span>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-neutral-600 dark:text-neutral-400">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-neutral-200 dark:border-neutral-800">
              <td className="px-4 py-2.5 font-medium text-neutral-900 dark:text-neutral-100">
                {row.criteria}
              </td>
              {row.values.map((val, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 ${columns[j]?.highlight ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── 3. FeatureGrid ──────────────────────────────────
   Grid of icon + title + description cards.
   ───────────────────────────────────────────────────── */
export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export function FeatureGrid({
  items,
  columns = 2,
  className = '',
}: {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridCols =
    columns === 3 ? 'sm:grid-cols-3' : columns === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';
  return (
    <div className={`grid ${gridCols} gap-3 ${className}`}>
      {items.map((item) => (
        <div
          key={item.title}
          className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800"
        >
          <span className="text-2xl">{item.icon}</span>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
            {item.title}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── 4. SectionTitle ─────────────────────────────
   Page title + description (used at top of every docs page).
   ──────────────────────────────────────────────────── */
export function SectionTitle({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {icon && <>{icon} </>}
        {title}
      </h2>
      {description && <p className="text-neutral-500 dark:text-neutral-400">{description}</p>}
    </div>
  );
}

/* ─── 5. KeyValueCard ─────────────────────────────
   ADR-style key-value display box.
   ──────────────────────────────────────────────────── */
export interface KeyValueEntry {
  label: string;
  value: ReactNode;
  /** Optional color for the value text */
  valueColor?: string;
}

export function KeyValueCard({
  entries,
  className = '',
}: {
  entries: KeyValueEntry[];
  className?: string;
}) {
  return (
    <div
      className={`bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 text-sm space-y-2 ${className}`}
    >
      {entries.map((entry) => (
        <div key={entry.label}>
          <strong className="text-neutral-900 dark:text-neutral-100">{entry.label}:</strong>{' '}
          <span className={entry.valueColor || 'text-neutral-600 dark:text-neutral-400'}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── 6. StepList ─────────────────────────────────
   Numbered step-by-step instructions.
   ──────────────────────────────────────────────────── */
export function StepList({
  steps,
  className = '',
}: {
  steps: { title: string; content?: ReactNode }[];
  className?: string;
}) {
  return (
    <ol className={`space-y-4 ${className}`}>
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{step.title}</h4>
            {step.content && (
              <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {step.content}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─── 7. ExampleTabs ──────────────────────────────
   Reusable Preview/Code switcher for docs examples.
   ──────────────────────────────────────────────────── */
export function ExampleTabs({
  preview,
  code,
  language = 'tsx',
  defaultTab = 'preview',
  className = '',
  previewClassName = '',
}: {
  preview: ReactNode;
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
            <ComponentBoundary
              fallbackTitle="Preview Gagal Dirender"
              fallbackDescription="Code tetap tersedia di tab Code."
            >
              {preview}
            </ComponentBoundary>
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

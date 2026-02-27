import { Link } from 'react-router-dom';
import { Card, CardContent } from '@synapse/ui-kit';

const COMPONENT_MAP: Record<string, { name: string; description: string; icon: string }> = {
  reusableguide: {
    name: 'Build Reusable Component',
    description: 'Panduan step-by-step membuat komponen baru agar bisa dipakai lintas MFE',
    icon: '🛠️',
  },
  infobox: {
    name: 'InfoBox',
    description: 'Callout berwarna — 7 varian (emerald, blue, amber, red, purple, orange, neutral)',
    icon: '📦',
  },
  comparisontable: {
    name: 'ComparisonTable',
    description: 'Tabel perbandingan dengan kolom highlighted',
    icon: '📊',
  },
  featuregrid: {
    name: 'FeatureGrid',
    description: 'Grid kartu icon + title + desc (2/3/4 kolom)',
    icon: '🧱',
  },
  utilities: { name: 'Utilities', description: 'SectionTitle, KeyValueCard, StepList', icon: '🔧' },
  exampletabs: {
    name: 'ExampleTabs',
    description: 'Wrapper tab Preview/Code untuk contoh komponen yang reusable',
    icon: '🗂️',
  },
};

export function ComponentsOverviewSection({ sectionMap }: { sectionMap: Record<string, unknown> }) {
  const documented = Object.keys(sectionMap);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            🧩 Reusable Components
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Komponen bersama untuk halaman dokumentasi. Import dari{' '}
            <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
              @synapse/shared-components
            </code>
            .
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            <strong>💡 Import:</strong>{' '}
            <code className="text-xs bg-blue-100 dark:bg-blue-800 px-1 rounded">
              {"import { InfoBox, ComparisonTable, ... } from '@synapse/shared-components';"}
            </code>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(COMPONENT_MAP).map(([slug, comp]) => {
            const isDocumented = documented.includes(slug);
            return (
              <Link
                key={slug}
                to={`/docs/components/${slug}`}
                className="group block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{comp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                        {comp.name}
                      </h3>
                      {isDocumented && (
                        <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                          ✓ Docs
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

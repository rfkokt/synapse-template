import { ExampleTabs, FeatureGrid } from '@synapse/shared-components';
import { Card, CardContent } from '@synapse/ui-kit';
import {
  LuUsers as Users,
  LuRocket as Rocket,
  LuLock as Lock,
  LuZap as Zap,
  LuPalette as Palette,
  LuRefreshCw as RefreshCw,
  LuPackage as Package,
} from 'react-icons/lu';

export function FeatureGridSection() {
  const iconClass = 'h-5 w-5';
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            FeatureGrid
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Grid kartu icon + title + deskripsi. Mendukung 2, 3, atau 4 kolom.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          2 Kolom (default)
        </h3>
        <FeatureGrid
          items={[
            {
              icon: <Users className={iconClass} />,
              title: 'Tim Paralel',
              desc: 'Beberapa tim bekerja bersamaan',
            },
            {
              icon: <Rocket className={iconClass} />,
              title: 'Deploy Independen',
              desc: 'Deploy tanpa rebuild keseluruhan',
            },
            {
              icon: <Lock className={iconClass} />,
              title: 'Isolasi',
              desc: 'Kegagalan satu modul tidak menyebar',
            },
            { icon: <Zap className={iconClass} />, title: 'Performa', desc: 'Build time cepat' },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">3 Kolom</h3>
        <FeatureGrid
          columns={3}
          items={[
            {
              icon: <Palette className={iconClass} />,
              title: 'Design System',
              desc: 'Shared UI kit',
            },
            {
              icon: <RefreshCw className={iconClass} />,
              title: 'Hot Reload',
              desc: 'Instant feedback',
            },
            {
              icon: <Package className={iconClass} />,
              title: 'Lazy Load',
              desc: 'Remote on-demand',
            },
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <ExampleTabs
          preview={
            <div className="w-full max-w-3xl">
              <FeatureGrid
                columns={3}
                items={[
                  {
                    icon: <Palette className={iconClass} />,
                    title: 'Design System',
                    desc: 'Shared UI kit',
                  },
                  {
                    icon: <RefreshCw className={iconClass} />,
                    title: 'Hot Reload',
                    desc: 'Instant feedback',
                  },
                ]}
              />
            </div>
          }
          code={`import { FeatureGrid } from '@synapse/shared-components';
import { LuPalette as Palette, LuRefreshCw as RefreshCw } from 'react-icons/lu';

<FeatureGrid
  columns={3}  // 2 | 3 | 4
  items={[
    { icon: <Palette className="h-5 w-5" />, title: 'Design System', desc: 'Shared UI kit' },
    { icon: <RefreshCw className="h-5 w-5" />, title: 'Hot Reload', desc: 'Instant feedback' },
  ]}
/>`}
          previewClassName="w-full items-start justify-center"
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-800">
                <th className="px-4 py-2 text-left font-medium">Prop</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  items
                </td>
                <td className="px-4 py-2">{'FeatureItem[]'}</td>
                <td className="px-4 py-2">—</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  columns
                </td>
                <td className="px-4 py-2">2 | 3 | 4</td>
                <td className="px-4 py-2">2</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  className
                </td>
                <td className="px-4 py-2">string</td>
                <td className="px-4 py-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

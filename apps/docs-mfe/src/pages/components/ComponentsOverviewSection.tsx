import { Card, CardContent } from '@synapse/ui-kit';
import type { ReactNode } from 'react';
import {
  LuWrench as Wrench,
  LuSettings2 as Settings2,
  LuFileCode as FileCode,
  LuTable as Table,
  LuListOrdered as ListOrdered,
  LuMessageSquare as MessageSquare,
  LuLayoutGrid as LayoutGrid,
  LuHeading1 as Heading1,
  LuKey as Key,
  LuListChecks as ListChecks,
  LuLayoutPanelTop as LayoutPanelTop,
  LuPuzzle as Puzzle,
  LuLightbulb as Lightbulb,
} from 'react-icons/lu';
import { Link } from 'react-router-dom';
import type { DiscoveredSharedComponent } from '../../utils/shared-component-discovery';

type CardMeta = {
  name: string;
  description: string;
  icon: ReactNode;
};

const PINNED_COMPONENTS: Array<{ slug: string } & CardMeta> = [
  {
    slug: 'reusableguide',
    name: 'Build Reusable Component',
    description: 'Panduan step-by-step membuat komponen baru agar bisa dipakai lintas MFE',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    description: 'Dokumentasi gabungan untuk SectionTitle, KeyValueCard, dan StepList',
    icon: <Settings2 className="h-5 w-5" />,
  },
];

const COMPONENT_META: Record<string, CardMeta> = {
  codeblock: {
    name: 'CodeBlock',
    description: 'Syntax highlighted code block untuk dokumentasi',
    icon: <FileCode className="h-5 w-5" />,
  },
  codeblocktable: {
    name: 'CodeBlockTable',
    description: 'Renderer line-numbered code table (base dari CodeBlock)',
    icon: <Table className="h-5 w-5" />,
  },
  docsstep: {
    name: 'DocsStep',
    description: 'Komponen step untuk panduan bertahap',
    icon: <ListOrdered className="h-5 w-5" />,
  },
  infobox: {
    name: 'InfoBox',
    description: 'Callout berwarna untuk tips/warning/success',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  comparisontable: {
    name: 'ComparisonTable',
    description: 'Tabel perbandingan dengan dukungan highlighted column',
    icon: <Table className="h-5 w-5" />,
  },
  featuregrid: {
    name: 'FeatureGrid',
    description: 'Grid kartu icon + title + description',
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  sectiontitle: {
    name: 'SectionTitle',
    description: 'Utility heading section untuk halaman docs',
    icon: <Heading1 className="h-5 w-5" />,
  },
  keyvaluecard: {
    name: 'KeyValueCard',
    description: 'Utility card untuk metadata key-value',
    icon: <Key className="h-5 w-5" />,
  },
  steplist: {
    name: 'StepList',
    description: 'List langkah bernomor untuk tutorial',
    icon: <ListChecks className="h-5 w-5" />,
  },
  exampletabs: {
    name: 'ExampleTabs',
    description: 'Wrapper tab Preview/Code untuk contoh komponen',
    icon: <LayoutPanelTop className="h-5 w-5" />,
  },
};

function getCardMeta(component: DiscoveredSharedComponent): { slug: string } & CardMeta {
  const meta = COMPONENT_META[component.slug];
  if (meta) {
    return { slug: component.slug, ...meta };
  }

  return {
    slug: component.slug,
    name: component.name,
    description: 'Komponen reusable di @synapse/shared-components',
    icon: <Puzzle className="h-5 w-5" />,
  };
}

export function ComponentsOverviewSection({
  sectionMap,
  discoveredComponents,
}: {
  sectionMap: Record<string, unknown>;
  discoveredComponents: DiscoveredSharedComponent[];
}) {
  const documented = new Set(Object.keys(sectionMap));

  const cardsMap = new Map<string, { slug: string } & CardMeta>();
  for (const pinned of PINNED_COMPONENTS) {
    cardsMap.set(pinned.slug, pinned);
  }
  for (const component of discoveredComponents) {
    cardsMap.set(component.slug, getCardMeta(component));
  }

  const pinnedOrder = new Map(PINNED_COMPONENTS.map((c, index) => [c.slug, index]));
  const cards = Array.from(cardsMap.values()).sort((a, b) => {
    const aPinned = pinnedOrder.get(a.slug);
    const bPinned = pinnedOrder.get(b.slug);
    if (aPinned !== undefined || bPinned !== undefined) {
      return (aPinned ?? Number.MAX_SAFE_INTEGER) - (bPinned ?? Number.MAX_SAFE_INTEGER);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            <span className="inline-flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Reusable Components
            </span>
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
            <span className="inline-flex items-center gap-2 font-semibold">
              <Lightbulb className="h-4 w-4" />
              Import:
            </span>{' '}
            <code className="text-xs bg-blue-100 dark:bg-blue-800 px-1 rounded">
              {"import { InfoBox, ComparisonTable, ... } from '@synapse/shared-components';"}
            </code>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => {
            const isDocumented = documented.has(card.slug);
            return (
              <Link
                key={card.slug}
                to={`/docs/components/${card.slug}`}
                className="group block rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center text-neutral-700 dark:text-neutral-300 [&>svg]:h-6 [&>svg]:w-6">
                    {card.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                        {card.name}
                      </h3>
                      {isDocumented ? (
                        <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                          Docs
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                          Tidak ada dokumentasi
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {card.description}
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

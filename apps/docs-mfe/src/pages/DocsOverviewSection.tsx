import { Card, CardContent } from '@synapse/ui-kit';
import { Link } from 'react-router';

export function DocsOverviewSection({
  sectionMap,
}: {
  sectionMap: Record<string, { component: React.FC; title: string; category: string }>;
}) {
  const categories = [
    '🚀 Getting Started',
    '🏗️ Arsitektur',
    '🎨 UI & Styling',
    '📚 Panduan Lanjutan',
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          📖 Buku Panduan Platform MFE
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Dokumentasi dan Standar Arsitektur Micro-Frontend Synapse MFE
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 text-lg border-b border-neutral-100 dark:border-neutral-800 pb-2">
            📑 Daftar Isi
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{category}</p>
                <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 ml-1">
                  {Object.entries(sectionMap)
                    .filter(([_, data]) => data.category === category)
                    .map(([slug, data]) => (
                      <Link
                        key={slug}
                        to={`/docs/${slug}`}
                        className="text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {data.title}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

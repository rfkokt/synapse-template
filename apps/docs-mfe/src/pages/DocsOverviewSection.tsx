import { Card, CardContent } from '@synapse/ui-kit';
import { Link } from 'react-router-dom';

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
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
            🚨 Update Penting (Wajib Dibaca)
          </h3>
          <ul className="list-disc ml-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Access token sekarang memory-only, tidak lagi disimpan di Web Storage.</li>
            <li>
              Semua parameter <code>redirect</code> wajib divalidasi dengan allowlist untuk mencegah
              open redirect.
            </li>
            <li>
              Standalone mode tidak menerima injeksi token via query param; login dev bersifat
              eksplisit di origin MFE itu sendiri.
            </li>
            <li>
              Sinkronisasi event auth di shell menjaga field user (name/email/role) agar tidak
              tertimpa string kosong.
            </li>
            <li>Dependency routing sudah diseragamkan ke `react-router-dom` v7.</li>
          </ul>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Baca detail teknis di{' '}
            <Link to="/docs/security" className="text-primary-600 hover:underline font-medium">
              Security
            </Link>
            ,{' '}
            <Link to="/docs/token-auth" className="text-primary-600 hover:underline font-medium">
              Token & Auth
            </Link>
            , dan{' '}
            <Link
              to="/docs/api-interceptors"
              className="text-primary-600 hover:underline font-medium"
            >
              API Interceptors
            </Link>
            .
          </p>
        </CardContent>
      </Card>

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

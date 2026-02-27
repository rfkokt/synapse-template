import { Card, CardContent } from '@synapse/ui-kit';
import { ExampleTabs, KeyValueCard, StepList, SectionTitle } from '@synapse/shared-components';

export function UtilitiesSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Utilities
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Komponen utility kecil: SectionTitle, KeyValueCard, dan StepList.
          </p>
        </div>

        {/* ── SectionTitle ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            SectionTitle
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Header halaman dengan emoji + judul + deskripsi opsional.
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <SectionTitle
              icon="📄"
              title="Contoh Judul Halaman"
              description="Ini deskripsi singkat halaman."
            />
          </div>
          <ExampleTabs
            preview={
              <div className="w-full max-w-xl rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <SectionTitle
                  icon="🏗️"
                  title="Kenapa Module Federation?"
                  description="Penjelasan singkat..."
                />
              </div>
            }
            code={`import { SectionTitle } from '@synapse/shared-components';

<SectionTitle
  icon="🏗️"
  title="Kenapa Module Federation?"
  description="Penjelasan singkat..."
/>`}
            previewClassName="w-full items-start justify-center"
          />
        </section>

        {/* ── KeyValueCard ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            KeyValueCard
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Box key-value untuk ADR, metadata, atau ringkasan.
          </p>
          <KeyValueCard
            entries={[
              { label: 'Status', value: 'Accepted', valueColor: 'text-emerald-600' },
              { label: 'Context', value: 'Deskripsi konteks proyek...' },
              { label: 'Decision', value: 'Keputusan yang diambil...' },
              { label: 'Team', value: 'Synapse' },
            ]}
          />
          <ExampleTabs
            preview={
              <div className="w-full max-w-xl">
                <KeyValueCard
                  entries={[
                    { label: 'Status', value: 'Active', valueColor: 'text-emerald-600' },
                    { label: 'Version', value: '3.0' },
                    { label: 'Team', value: 'Synapse' },
                  ]}
                />
              </div>
            }
            code={`import { KeyValueCard } from '@synapse/shared-components';

<KeyValueCard entries={[
  { label: 'Status', value: 'Active', valueColor: 'text-emerald-600' },
  { label: 'Version', value: '3.0' },
  { label: 'Team', value: 'Synapse' },
]} />`}
            previewClassName="w-full items-start justify-center"
          />
        </section>

        {/* ── StepList ── */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
            StepList
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Langkah-langkah bernomor dengan badge bulat.
          </p>
          <StepList
            steps={[
              {
                title: 'Install dependencies',
                content: (
                  <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                    pnpm install
                  </code>
                ),
              },
              {
                title: 'Jalankan dev server',
                content: (
                  <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                    pnpm run dev
                  </code>
                ),
              },
              { title: 'Buka browser', content: 'Akses http://localhost:4000' },
            ]}
          />
          <ExampleTabs
            preview={
              <div className="w-full max-w-xl">
                <StepList
                  steps={[
                    { title: 'Step 1', content: 'Deskripsi...' },
                    {
                      title: 'Step 2',
                      content: (
                        <code className="text-xs bg-neutral-200 dark:bg-neutral-700 px-1 rounded">
                          command
                        </code>
                      ),
                    },
                    { title: 'Step 3' },
                  ]}
                />
              </div>
            }
            code={`import { StepList } from '@synapse/shared-components';

<StepList steps={[
  { title: 'Step 1', content: 'Deskripsi...' },
  { title: 'Step 2', content: <code>command</code> },
  { title: 'Step 3' }, // tanpa content
]} />`}
            previewClassName="w-full items-start justify-center"
          />
        </section>
      </CardContent>
    </Card>
  );
}

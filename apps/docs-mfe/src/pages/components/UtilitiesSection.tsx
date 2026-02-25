import { Card, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../../components/CodeBlock';
import { KeyValueCard, StepList, SectionTitle } from '../../components/docs-primitives';

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
          <CodeBlock
            codeString={`import { SectionTitle } from '../components/docs-primitives';

<SectionTitle
  icon="🏗️"
  title="Kenapa Module Federation?"
  description="Penjelasan singkat..."
/>`}
            language="tsx"
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
          <CodeBlock
            codeString={`import { KeyValueCard } from '../components/docs-primitives';

<KeyValueCard entries={[
  { label: 'Status', value: 'Active', valueColor: 'text-emerald-600' },
  { label: 'Version', value: '3.0' },
  { label: 'Team', value: 'Synapse' },
]} />`}
            language="tsx"
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
          <CodeBlock
            codeString={`import { StepList } from '../components/docs-primitives';

<StepList steps={[
  { title: 'Step 1', content: 'Deskripsi...' },
  { title: 'Step 2', content: <code>command</code> },
  { title: 'Step 3' }, // tanpa content
]} />`}
            language="tsx"
          />
        </section>
      </CardContent>
    </Card>
  );
}

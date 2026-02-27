import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock, InfoBox, StepList } from '@synapse/shared-components';

const libsTable = [
  ['@synapse/ui-kit', 'Komponen UI bersama (Button, Input, Table, Select, dll).'],
  [
    '@synapse/shared-components',
    'Primitives dokumentasi reusable (InfoBox, ExampleTabs, CodeBlock).',
  ],
  ['@synapse/shared-types', 'Contract TS lintas MFE + store auth/notification.'],
  ['@synapse/shared-api', 'HTTP client terstandar + interceptor auth/error.'],
  ['@synapse/shared-monitoring', 'Monitoring, telemetry, dan error boundary global.'],
  ['@synapse/mock-api', 'Mock API berbasis MSW untuk local development/testing.'],
];

export function DocsLibsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-400 text-sm font-bold">
            17
          </span>
          @libs Workspace (Shared Packages)
        </CardTitle>
        <CardDescription>
          Standar membuat dan memakai library lintas MFE tanpa saling merusak.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          Semua package reusable disimpan di folder <code>libs/</code> dan diakses lewat namespace{' '}
          <code>@synapse/*</code>. Tujuannya: kode konsisten, upgrade lebih mudah, dan minim
          duplikasi antar MFE.
        </p>

        <InfoBox variant="blue" title="Prinsip Wajib">
          Jangan import antar app dengan path relatif. Selalu import lewat package workspace,
          contoh: <code>@synapse/ui-kit</code> atau <code>@synapse/shared-api</code>.
        </InfoBox>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-800 text-left">
                <th className="px-4 py-2 font-medium">Package</th>
                <th className="px-4 py-2 font-medium">Fungsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {libsTable.map(([pkg, desc]) => (
                <tr key={pkg}>
                  <td className="px-4 py-2">
                    <code>{pkg}</code>
                  </td>
                  <td className="px-4 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Cara Pakai Library di MFE
        </h3>
        <CodeBlock
          language="json"
          codeString={`// apps/<mfe>/package.json
{
  "dependencies": {
    "@synapse/mock-api": "workspace:*",
    "@synapse/ui-kit": "workspace:*",
    "@synapse/shared-components": "workspace:*",
    "@synapse/shared-monitoring": "workspace:*",
    "@synapse/shared-types": "workspace:*",
    "@synapse/shared-api": "workspace:*"
  }
}`}
        />
        <InfoBox variant="emerald" title="Generator Default">
          Generator <code>@synapse/tools:mfe</code> sekarang otomatis menambahkan semua dependency
          shared di atas, jadi MFE baru langsung bisa memakai seluruh package `@synapse/*`.
        </InfoBox>
        <InfoBox variant="amber" title="Standar Dokumentasi ExampleTabs">
          Pakai <code>ExampleTabs</code> hanya untuk demo komponen yang punya preview UI nyata.
          Untuk dokumentasi file/setup (mis. create file, edit <code>package.json</code>, export
          index, command build/typecheck), wajib pakai <code>CodeBlock</code>.
        </InfoBox>
        <CodeBlock
          language="tsx"
          codeString={`import { Button, Table } from '@synapse/ui-kit';
import { apiClient } from '@synapse/shared-api';
import { useAuthStore } from '@synapse/shared-types';
import { InfoBox } from '@synapse/shared-components';`}
        />
        <CodeBlock
          language="tsx"
          codeString={`import { initMonitoring } from '@synapse/shared-monitoring';
import { initMsw } from '@synapse/mock-api';

initMonitoring();
await initMsw(); // jalankan saat development/mock mode`}
        />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Cara Membuat @libs Baru
        </h3>
        <StepList
          steps={[
            {
              title: 'Buat package di libs/',
              content: <code>libs/shared-foo/package.json</code>,
            },
            {
              title: 'Set nama package',
              content: <code>"name": "@synapse/shared-foo"</code>,
            },
            {
              title: 'Export API publik dari src/index.ts',
            },
            {
              title: 'Daftarkan alias di tsconfig.base.json',
              content: <code>@synapse/shared-foo dan @synapse/shared-foo/*</code>,
            },
            {
              title: 'Tambahkan dependency ke MFE pemakai + generator',
              content: <code>tools/src/generators/mfe/generator.ts</code>,
            },
            {
              title: 'Verifikasi typecheck/build',
            },
          ]}
        />

        <CodeBlock
          language="bash"
          codeString={`pnpm install
pnpm -C apps/<mfe> run typecheck
pnpm -C apps/<mfe> run build`}
        />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Safety: Satu Komponen Error Tidak Boleh Menjatuhkan Semuanya
        </h3>
        <CodeBlock
          language="tsx"
          codeString={`import { ComponentBoundary } from '@synapse/ui-kit';
import { ProfileCard } from '@synapse/shared-foo';

<ComponentBoundary
  fallbackTitle="Widget Error"
  fallbackDescription="Widget ini gagal, tetapi halaman tetap jalan."
>
  <ProfileCard />
</ComponentBoundary>;`}
        />
        <p>
          Di level Shell, setiap remote MFE juga sudah dibungkus <code>RemoteLoader</code> + error
          boundary, jadi crash di satu remote tidak otomatis merusak remote lain.
        </p>
      </CardContent>
    </Card>
  );
}

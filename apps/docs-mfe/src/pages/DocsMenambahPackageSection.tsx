import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';
import { DocsStep } from '../components/DocsStep';

export function DocsMenambahPackageSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400 text-sm font-bold">
              4
            </span>
            Aturan Menambah Package Baru
          </CardTitle>
          <CardDescription>
            Panduan dan aturan (berdasarkan PRD) cara menambah library pihak ketiga ke dalam Micro
            Frontend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DocsStep title="1. Format Command Instalasi" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Karena kita menggunakan{' '}
              <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                pnpm workspace
              </strong>{' '}
              dalam mode{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                isolated
              </code>
              , <strong>JANGAN</strong> pernah masuk ke sub-folder lalu menjalankan{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                pnpm install
              </code>{' '}
              secara langsung. Gunakan flag{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                --filter
              </code>{' '}
              dari root folder monorepo.
            </p>
            <CodeBlock
              language="bash"
              codeString={`# Tambah package ke MFE spesifik
pnpm add date-fns --filter business-mfe
pnpm add zod --filter shared-types

# Tambah sebagai devDependency
pnpm add -D uuid --filter auth-mfe`}
            />
          </DocsStep>

          <DocsStep title="2. Pengecekan Module Federation" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Jika library yang Anda instal menggunakan <strong>React Context</strong> atau
              bergantung pada state global singleton (contoh:{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                react-query
              </code>
              ,{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                zustand
              </code>
              , dsb), package tersebut <strong>wajib didaftarkan</strong> di bagian{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                shared
              </code>{' '}
              pada{' '}
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                vite.config.ts
              </code>{' '}
              agar tidak terjadi konflik instance antara Host dan Remote.
            </p>
            <CodeBlock
              language="typescript"
              codeString={`// vite.config.ts
export default defineConfig({
  plugins: [
    federation({
      // ...
      shared: {
        'library-berbasis-context': { singleton: true, requiredVersion: '^1.0.0' },
      }
    })
  ]
})`}
            />
          </DocsStep>

          <DocsStep title="3. Batasan Performance & Bundle Size" color="indigo">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Setiap kali Anda menambah package baru, pastikan ukurannya tidak membebani aplikasi.
              Sesuai <strong>PRD Bagian 18</strong>:
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-400 space-y-1 mt-2">
              <li>
                Initial JS bundle per Remote MFE dibatasi{' '}
                <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                  &lt; 100KB
                </strong>{' '}
                (gzipped).
              </li>
              <li>
                Jika package yang Anda tambahkan terlalu besar, pipeline CI (
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  pnpm budget:check
                </code>
                ) akan otomatis gagal.
              </li>
              <li>
                Pastikan package mendukung{' '}
                <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Tree-Shaking
                </strong>
                . Jika library-nya sangat besar (misal lodash), import fungsionalitasnya satu per
                satu saja (
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  import debounce from 'lodash/debounce'
                </code>
                ).
              </li>
            </ul>
          </DocsStep>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
            <h4 className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <span>🛡️</span> Zero-Vulnerability Policy
            </h4>
            <p className="text-sm text-rose-700 dark:text-rose-400 mt-1">
              Sesuai PRD Bagian 8.1, kita tidak mentoleransi package dengan celah keamanan level{' '}
              <strong>High</strong> atau <strong>Critical</strong>. Pipeline CI akan menjalankan{' '}
              <code className="text-xs bg-rose-100 dark:bg-rose-900/50 px-1 rounded">
                pnpm audit
              </code>
              . Jika Anda menambahkan package yang rentan secara keamanan, <em>Pull Request</em>{' '}
              Anda tidak akan bisa di-merge ke branch utama.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

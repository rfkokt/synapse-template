import { Card, CardContent } from '@synapse/ui-kit';
import {
  LuRocket as Rocket,
  LuFolder as Folder,
  LuLayoutList as LayoutList,
  LuFileText as FileText,
  LuWrench as Wrench,
  LuTriangleAlert as AlertTriangle,
  LuFolderTree as FolderTree,
} from 'react-icons/lu';
import { SectionHeader, CodeBlock } from './shared';

export function TutorialSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Tutorial: Menambah Komponen"
          description="2 cara menambah komponen ke UI Kit — via shadcn CLI atau manual."
        />

        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
          <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
            <span className="inline-flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Cara A: Shadcn CLI (Recommended)
            </span>
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            Cukup jalankan 1 command — komponen ter-install, import di-fix, auto-export ke barrel,
            dan muncul di sidebar!
          </p>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          1. Jalankan command
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Dari root project, jalankan:
        </p>
        <CodeBlock>{`# Install satu komponen
pnpm add:ui accordion

# Install beberapa sekaligus
pnpm add:ui accordion tabs dialog dropdown-menu

# Lihat daftar komponen yang tersedia
npx shadcn@latest search shadcn`}</CodeBlock>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          2. Otomatis terjadi
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <Folder className="h-6 w-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              File ter-install
            </p>
            <p className="text-xs text-neutral-500 mt-1">di libs/ui-kit/src/components/</p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <LayoutList className="h-6 w-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Muncul di sidebar
            </p>
            <p className="text-xs text-neutral-500 mt-1">auto-discovery scan file baru</p>
          </div>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <FileText className="h-6 w-6 text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Placeholder docs
            </p>
            <p className="text-xs text-neutral-500 mt-1">dengan panduan isi dokumentasi</p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          3. Selesai! Langsung pakai di MFE
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Script otomatis export ke barrel — langsung bisa import:
        </p>
        <CodeBlock>{`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@synapse/ui-kit';`}</CodeBlock>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          4. Hapus komponen (jika tidak dipakai)
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Gunakan script ini untuk menghapus file komponen dan export di barrel secara otomatis.
        </p>
        <CodeBlock>{`# Hapus satu komponen
pnpm remove:ui accordion

# Hapus beberapa komponen sekaligus
pnpm remove:ui accordion calendar`}</CodeBlock>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          5. (Opsional) Tambah dokumentasi
        </h3>
        <CodeBlock>{`// Di apps/shell/src/pages/ui-kit/AccordionSection.tsx

function AccordionSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader title="Accordion" description="..." />
        <PreviewCard>
          {/* Demo komponen */}
        </PreviewCard>
      </CardContent>
    </Card>
  );
}

// Lalu register di UIKit.tsx SECTION_MAP
const SECTION_MAP = {
  ...
  accordion: AccordionSection,
};`}</CodeBlock>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            <span className="inline-flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Cara B: Buat Manual
            </span>
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Untuk komponen custom yang tidak ada di shadcn registry.
          </p>
        </div>

        <CodeBlock>{`// libs/ui-kit/src/components/Chip.tsx
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ChipProps {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'neutral';
  onRemove?: () => void;
}

export function Chip({ children, color = 'primary', onRemove }: ChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm', ...)}>
      {children}
      {onRemove && <button onClick={onRemove}>×</button>}
    </span>
  );
}`}</CodeBlock>

        <CodeBlock>{`// libs/ui-kit/src/index.ts — WAJIB export
export { Chip } from './components/Chip';
export type { ChipProps } from './components/Chip';`}</CodeBlock>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="text-base font-semibold text-amber-800 dark:text-amber-300 mb-2">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Rules
            </span>
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-amber-700 dark:text-amber-400">
            <li>
              Selalu pake <strong>shadcn CLI</strong> kalau komponen tersedia di registry
            </li>
            <li>
              Wajib <strong>export dari index.ts</strong>
            </li>
            <li>
              Wajib punya <strong>TypeScript interface</strong> (Props)
            </li>
            <li>
              Gunakan <strong>cn()</strong> untuk merge Tailwind classes
            </li>
            <li>
              Selalu support <strong>dark mode</strong>
            </li>
            <li>
              Jangan import <code className="text-xs">@synapse/shared-types</code> di ui-kit
              (circular)
            </li>
          </ul>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          <span className="inline-flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Struktur Folder
          </span>
        </h3>
        <CodeBlock>{`project-root/
├── components.json          ← shadcn CLI config
└── libs/ui-kit/
    ├── src/
    │   ├── components/      ← shadcn + custom
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── FormField.tsx
    │   │   └── ...
    │   ├── hooks/
    │   │   └── useFormValidation.ts
    │   ├── utils/
    │   │   └── cn.ts
    │   └── index.ts         ← WAJIB register
    └── package.json`}</CodeBlock>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
            <h3 className="text-base font-semibold text-teal-800 dark:text-teal-300 mb-2">
              <span className="inline-flex items-center gap-2">
                🔄 Multi-Repo? Publish via Verdaccio!
              </span>
            </h3>
            <p className="text-sm text-teal-700 dark:text-teal-400">
              Setelah menambah atau mengubah komponen di{' '}
              <code className="text-xs bg-teal-100 dark:bg-teal-900/50 px-1 rounded">
                @synapse/ui-kit
              </code>
              , MFE standalone (multi-repo) perlu mendapatkan versi terbaru:
            </p>
            <ol className="list-decimal ml-4 mt-2 space-y-1 text-sm text-teal-700 dark:text-teal-400">
              <li>
                Jalankan{' '}
                <code className="text-xs bg-teal-100 dark:bg-teal-900/50 px-1 rounded">
                  pnpm run libs:publish:local
                </code>{' '}
                dari monorepo
              </li>
              <li>
                Jalankan{' '}
                <code className="text-xs bg-teal-100 dark:bg-teal-900/50 px-1 rounded">
                  pnpm install
                </code>{' '}
                di MFE standalone
              </li>
            </ol>
            <p className="text-sm text-teal-700 dark:text-teal-400 mt-2">
              Lihat panduan lengkap di <strong>/docs/verdaccio-registry</strong>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

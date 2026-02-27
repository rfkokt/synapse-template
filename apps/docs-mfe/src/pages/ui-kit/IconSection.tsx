import { Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, CodeBlock } from './shared';
import {
  LuUser as UserIcon,
  LuSettings as SettingsIcon,
  LuBell as BellIcon,
  LuSearch as SearchIcon,
  LuCircleCheck as CheckCircleIcon,
} from 'react-icons/lu';

export function IconSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Icons"
          description="Panduan penggunaan Icon di dalam project Synapse MFE menggunakan react-icons."
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <h3 className="text-base font-semibold text-blue-800 dark:text-blue-300 mb-1">
            📦 Paket yang Digunakan
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Project ini menggunakan <code>react-icons</code>, dan menyarankan penggunaan sub-paket{' '}
            <code>react-icons/lu</code> (Lucide icons) untuk menjaga konsistensi desain yang clean
            dan profesional.
          </p>
        </div>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-6">
          1. Cara Import
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Untuk menggunakan icon, import dari <code>react-icons/lu</code>. Jangan sampai lupa
          memberikan prefix <code>Lu</code> dan memberikan alias jika diperlukan.
        </p>
        <CodeBlock language="tsx">{`import { 
  LuUser as UserIcon,
  LuSettings as SettingsIcon,
  LuLogOut as LogOutIcon 
} from 'react-icons/lu';

export function UserProfile() {
  return (
    <Button variant="outline" className="gap-2">
      <UserIcon className="h-4 w-4" />
      Profile Saya
    </Button>
  );
}`}</CodeBlock>

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-6 md:mt-8">
          2. Contoh Penggunaan
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Berikut beberapa contoh integrasi icon beserta style color dan sizing melalui class
          Tailwind:
        </p>

        <div className="mt-8 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900/50">
          <div className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Preview
            </span>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-8 justify-center">
              {/* Primary/Active Icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
                  <UserIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-neutral-500 font-medium">Primary</span>
              </div>

              {/* Default Icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-full">
                  <SettingsIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-neutral-500 font-medium">Default</span>
              </div>

              {/* Notification Icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-full relative">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
                </div>
                <span className="text-xs text-neutral-500 font-medium">Alert</span>
              </div>

              {/* Success Icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-neutral-500 font-medium">Success</span>
              </div>

              {/* Outline Form Icon */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center border border-neutral-300 rounded-md px-3 py-2 bg-white text-neutral-600 w-32 shadow-sm">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm text-neutral-400">Cari...</span>
                </div>
                <span className="text-xs text-neutral-500 font-medium">Input Prefix</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

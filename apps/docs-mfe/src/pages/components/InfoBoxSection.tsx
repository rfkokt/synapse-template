import { ExampleTabs, InfoBox } from '@synapse/shared-components';
import { Card, CardContent } from '@synapse/ui-kit';
import type { ElementType } from 'react';
import {
  LuCircleCheck as CircleCheck,
  LuInfo as Info,
  LuTriangleAlert as AlertTriangle,
  LuCircleX as CircleX,
  LuSparkles as Sparkles,
  LuFlame as Flame,
  LuClipboardList as ClipboardList,
} from 'react-icons/lu';

export function InfoBoxSection() {
  const iconClass = 'h-4 w-4';
  const withIcon = (Icon: ElementType, label: string) => (
    <span className="inline-flex items-center gap-2">
      <Icon className={iconClass} />
      {label}
    </span>
  );

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            InfoBox
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Callout box berwarna untuk tips, peringatan, error, dan informasi tambahan. Tersedia 7
            varian warna.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Semua Varian
        </h3>
        <div className="space-y-3">
          <InfoBox variant="emerald" title={withIcon(CircleCheck, 'Emerald (success/tip)')}>
            Contoh pesan berhasil atau tips pengembangan.
          </InfoBox>
          <InfoBox variant="blue" title={withIcon(Info, 'Blue (info)')}>
            Konteks atau informasi tambahan yang berguna.
          </InfoBox>
          <InfoBox variant="amber" title={withIcon(AlertTriangle, 'Amber (warning)')}>
            Peringatan yang perlu diperhatikan developer.
          </InfoBox>
          <InfoBox variant="red" title={withIcon(CircleX, 'Red (error/danger)')}>
            Error, keputusan yang ditolak, atau hal berbahaya.
          </InfoBox>
          <InfoBox variant="purple" title={withIcon(Sparkles, 'Purple (special)')}>
            Catatan khusus atau fitur lanjutan.
          </InfoBox>
          <InfoBox variant="orange" title={withIcon(Flame, 'Orange (highlight)')}>
            Poin penting yang perlu disorot.
          </InfoBox>
          <InfoBox variant="neutral" title={withIcon(ClipboardList, 'Neutral')}>
            Informasi umum tanpa penekanan warna.
          </InfoBox>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Tanpa Title
        </h3>
        <InfoBox variant="blue">InfoBox juga bisa tanpa title, hanya konten saja.</InfoBox>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Dengan Children Kompleks
        </h3>
        <InfoBox variant="emerald" title="Dengan List">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Item pertama</li>
            <li>Item kedua</li>
            <li>
              <strong>Item bold</strong> dengan <code>inline code</code>
            </li>
          </ul>
        </InfoBox>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <ExampleTabs
          preview={
            <div className="w-full max-w-xl space-y-3">
              <InfoBox variant="emerald" title={withIcon(CircleCheck, 'Success')}>
                Konten pesan...
              </InfoBox>
              <InfoBox variant="blue">Informasi tambahan...</InfoBox>
              <InfoBox variant="amber" title={withIcon(AlertTriangle, 'Warning')}>
                <ul className="list-disc list-inside">
                  <li>Poin 1</li>
                  <li>Poin 2</li>
                </ul>
              </InfoBox>
            </div>
          }
          code={`import { InfoBox } from '@synapse/shared-components';
import { LuCircleCheck as CircleCheck, LuTriangleAlert as AlertTriangle } from 'react-icons/lu';

// Basic
<InfoBox
  variant="emerald"
  title={
    <span className="inline-flex items-center gap-2">
      <CircleCheck className="h-4 w-4" />
      Success
    </span>
  }
>
  Konten pesan...
</InfoBox>

// Tanpa title
<InfoBox variant="blue">
  Informasi tambahan...
</InfoBox>

// Dengan list
<InfoBox
  variant="amber"
  title={
    <span className="inline-flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      Warning
    </span>
  }
>
  <ul className="list-disc list-inside">
    <li>Poin 1</li>
    <li>Poin 2</li>
  </ul>
 </InfoBox>`}
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
                  variant
                </td>
                <td className="px-4 py-2">
                  emerald | blue | amber | red | purple | orange | neutral
                </td>
                <td className="px-4 py-2">blue</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  title
                </td>
                <td className="px-4 py-2">ReactNode</td>
                <td className="px-4 py-2">—</td>
              </tr>
              <tr className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                  children
                </td>
                <td className="px-4 py-2">ReactNode</td>
                <td className="px-4 py-2">—</td>
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

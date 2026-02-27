import { Button, Card, CardContent } from '@synapse/ui-kit';
import { useNotificationStore } from '@synapse/shared-types';
import { SectionHeader, PreviewCard, ExampleTabs } from './shared';

export function ToastSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Toast / Notification"
          description="Toast via useNotificationStore. 4 variant."
        />
        <PreviewCard title="Try it">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().success('Data berhasil disimpan!')}
            >
              ✅ Success
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().error('Gagal menyimpan data')}
            >
              ❌ Error
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().warning('Sesi hampir habis')}
            >
              ⚠️ Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().info('Update tersedia')}
            >
              ℹ️ Info
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
              onClick={() =>
                useNotificationStore.getState().error({
                  title: 'Validasi Gagal',
                  message: 'Mohon periksa kembali form Anda:',
                  list: [
                    'Nama tidak boleh kosong',
                    'Format email salah',
                    'Password kurang dari 8 karakter',
                  ],
                  duration: 6000,
                })
              }
            >
              ❌ Error (List)
            </Button>
          </div>
        </PreviewCard>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <Button
                variant="outline"
                onClick={() => useNotificationStore.getState().success('Data berhasil disimpan!')}
              >
                Trigger Success Toast
              </Button>
            }
            code={`import { useNotificationStore } from '@synapse/shared-types';

useNotificationStore.getState().success('Data berhasil disimpan!');

// Advanced Error with Title & List
useNotificationStore.getState().error({
  title: 'Validasi Gagal',
  message: 'Mohon periksa kembali form Anda:',
  list: [
    'Nama tidak boleh kosong', 
    'Format email salah'
  ],
  duration: 8000
});`}
          />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-6 md:mt-8">
          Customization / Mengubah Tampilan
        </h3>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 text-sm text-neutral-600 dark:text-neutral-400">
          <p className="mb-3">
            Komponen UI Toast bersifat <strong>dumb component</strong> dan source code aslinya
            sepenuhnya menjadi kendali Anda di dalam project ini.
          </p>
          <p>
            Jika Anda ingin mengubah warna, radius, padding, ikon, tata letak, atau menambahkan
            animasi *entry/exit* kustom:
          </p>
          <ol className="list-decimal ml-5 mt-2 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>
              Buka file <code>libs/ui-kit/src/components/Toast.tsx</code>.
            </li>
            <li>
              Cari konstan <code>variantStyles</code>, <code>variantText</code>, maupun{' '}
              <code>variantIconColor</code> untuk mengganti *color palette* bawaan (sukses, error,
              info, peringatan).
            </li>
            <li>
              Modifikasi struktur atau class <i>Tailwind</i> langsung pada komponen{' '}
              <code>&lt;ToastItem&gt;</code>. Perubahan Anda akan otomatis terefleksi ke seluruh MFE
              yang menggunakan UI Kit ini!
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

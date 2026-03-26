import { useNotificationStore } from '@synapse/shared-types';
import { Button, Card, CardContent } from '@synapse/ui-kit';
import {
  LuCircleCheck as CircleCheck,
  LuCircleX as CircleX,
  LuTriangleAlert as AlertTriangle,
  LuInfo as Info,
} from 'react-icons/lu';
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
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="h-4 w-4" />
                Success
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().error('Gagal menyimpan data')}
            >
              <span className="inline-flex items-center gap-2">
                <CircleX className="h-4 w-4" />
                Error
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().warning('Sesi hampir habis')}
            >
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warning
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => useNotificationStore.getState().info('Update tersedia')}
            >
              <span className="inline-flex items-center gap-2">
                <Info className="h-4 w-4" />
                Info
              </span>
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
              <span className="inline-flex items-center gap-2">
                <CircleX className="h-4 w-4" />
                Error (List)
              </span>
            </Button>
          </div>
        </PreviewCard>
        <PreviewCard title="Usage dengan Button" className="mb-0">
          <ExampleTabs
            preview={
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => useNotificationStore.getState().success('Data berhasil disimpan!')}
                >
                  Simpan Data
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    useNotificationStore.getState().error({
                      title: 'Validasi Gagal',
                      message: 'Mohon periksa kembali form Anda:',
                      list: ['Nama tidak boleh kosong', 'Format email salah'],
                      duration: 6000,
                    })
                  }
                >
                  Submit (Error)
                </Button>
              </div>
            }
            code={`import { Button } from '@synapse/ui-kit';
import { useNotificationStore } from '@synapse/shared-types';

// ✅ Simpel — trigger langsung di onClick
<Button
  variant="primary"
  onClick={() => useNotificationStore.getState().success('Data berhasil disimpan!')}
>
  Simpan Data
</Button>

// ✅ Dalam handler / async function
const handleSubmit = async () => {
  try {
    await apiClient.post('/api/v1/data', payload);
    useNotificationStore.getState().success('Data berhasil dikirim!');
  } catch (err) {
    useNotificationStore.getState().error('Gagal mengirim data');
  }
};

<Button variant="primary" onClick={handleSubmit}>Submit</Button>

// ✅ Advanced Error — dengan title, message, dan list
useNotificationStore.getState().error({
  title: 'Validasi Gagal',
  message: 'Mohon periksa kembali form Anda:',
  list: [
    'Nama tidak boleh kosong',
    'Format email salah',
  ],
  duration: 8000,
});

// ✅ Semua variant yang tersedia:
useNotificationStore.getState().success('...');  // hijau
useNotificationStore.getState().error('...');    // merah
useNotificationStore.getState().warning('...');  // kuning
useNotificationStore.getState().info('...');     // biru`}
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

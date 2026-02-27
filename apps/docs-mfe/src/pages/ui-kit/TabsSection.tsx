import { Card, CardContent, Tabs, TabList, Tab, TabPanel } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

export function TabsSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Tabs"
          description="Navigasi tab horizontal & vertikal dengan keyboard accessible."
        />

        <PreviewCard title="Horizontal (default)">
          <Tabs defaultValue="profil">
            <TabList>
              <Tab value="profil">Profil</Tab>
              <Tab value="alamat">Alamat</Tab>
              <Tab value="riwayat">Riwayat</Tab>
              <Tab value="disabled" disabled>
                Nonaktif
              </Tab>
            </TabList>
            <TabPanel value="profil" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Informasi profil jamaah: nama, KTP, passport, dll.
              </p>
            </TabPanel>
            <TabPanel value="alamat" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Alamat lengkap, kota, provinsi, kode pos.
              </p>
            </TabPanel>
            <TabPanel value="riwayat" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Riwayat keberangkatan haji/umroh sebelumnya.
              </p>
            </TabPanel>
          </Tabs>
        </PreviewCard>

        <PreviewCard title="Vertical">
          <Tabs defaultValue="umum" orientation="vertical">
            <TabList>
              <Tab value="umum">Umum</Tab>
              <Tab value="keamanan">Keamanan</Tab>
              <Tab value="notifikasi">Notifikasi</Tab>
            </TabList>
            <TabPanel value="umum" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pengaturan umum aplikasi seperti bahasa, tema, dan timezone.
              </p>
            </TabPanel>
            <TabPanel value="keamanan" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Ubah password, 2FA, dan manajemen sesi.
              </p>
            </TabPanel>
            <TabPanel value="notifikasi" className="p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pengaturan notifikasi email, push, dan SMS.
              </p>
            </TabPanel>
          </Tabs>
        </PreviewCard>

        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full max-w-lg">
                <Tabs defaultValue="tab1">
                  <TabList>
                    <Tab value="tab1">Tab 1</Tab>
                    <Tab value="tab2">Tab 2</Tab>
                  </TabList>
                  <TabPanel value="tab1" className="p-4">
                    Konten tab 1
                  </TabPanel>
                  <TabPanel value="tab2" className="p-4">
                    Konten tab 2
                  </TabPanel>
                </Tabs>
              </div>
            }
            code={`import { Tabs, TabList, Tab, TabPanel } from '@synapse/ui-kit';

<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel value="tab1">Konten tab 1</TabPanel>
  <TabPanel value="tab2">Konten tab 2</TabPanel>
</Tabs>

// Vertical
<Tabs defaultValue="tab1" orientation="vertical">
  ...
</Tabs>

// Controlled
const [tab, setTab] = useState('tab1');
<Tabs value={tab} onChange={setTab}>
  ...
</Tabs>`}
            previewClassName="w-full items-start justify-center"
          />
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tabs Props</h3>
        <PropsTable
          rows={[
            ['defaultValue', 'string', '—'],
            ['value', 'string (controlled)', '—'],
            ['onChange', '(value: string) => void', '—'],
            ['orientation', 'horizontal | vertical', 'horizontal'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tab Props</h3>
        <PropsTable
          rows={[
            ['value', 'string (required)', '—'],
            ['disabled', 'boolean', 'false'],
          ]}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="text-base font-semibold text-blue-800 dark:text-blue-300 mb-2">
            ⌨️ Keyboard Navigation
          </h3>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li>
              <strong>← →</strong> (horizontal) / <strong>↑ ↓</strong> (vertical) — pindah tab
            </li>
            <li>
              <strong>Home</strong> — tab pertama
            </li>
            <li>
              <strong>End</strong> — tab terakhir
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

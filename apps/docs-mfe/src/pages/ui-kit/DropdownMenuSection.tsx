import { Card, CardContent, DropdownMenu, Button } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';
import { Settings, LogOut, User, Bell } from 'lucide-react';

export function DropdownMenuSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Dropdown Menu"
          description="Menampilkan menu item dalam sebuah panel overlay, dengan dukungan item divider dan item danger."
        />

        <PreviewCard title="Basic (Trigger Default)">
          <div className="flex justify-center py-4">
            <DropdownMenu
              items={[
                { label: 'Profil Saya', icon: <User className="h-4 w-4" /> },
                { label: 'Pengaturan', icon: <Settings className="h-4 w-4" /> },
                { divider: true },
                { label: 'Keluar', icon: <LogOut className="h-4 w-4" />, danger: true },
              ]}
            />
          </div>
        </PreviewCard>

        <PreviewCard title="With Custom Trigger & Align Left">
          <div className="flex justify-center py-4">
            <DropdownMenu
              align="left"
              trigger={
                <Button variant="outline" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifikasi
                </Button>
              }
              items={[
                { label: 'Ada pembaruan baru' },
                { label: 'Pesan dari admin' },
                { divider: true },
                { label: 'Tandai semua dibaca' },
              ]}
            />
          </div>
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { DropdownMenu } from '@synapse/ui-kit';
import { Settings, LogOut } from 'lucide-react';

<DropdownMenu
  align="right"
  items={[
    { label: 'Setelan', icon: <Settings className="h-4 w-4" />, onClick: () => console.log('Settings clicked') },
    { divider: true },
    { label: 'Keluar', icon: <LogOut className="h-4 w-4" />, danger: true, onClick: () => alert('Logout') },
  ]}
/>

// Dengan custom trigger
<DropdownMenu
  trigger={<Button>Aksi</Button>}
  items={[
    { label: 'Aksi 1' },
    { label: 'Aksi 2' },
  ]}
/>`}</CodeBlock>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          DropdownMenu Props
        </h3>
        <PropsTable
          rows={[
            ['items', 'DropdownMenuItem[]', '—'],
            ['trigger', 'ReactNode', '<MoreHorizontal />'],
            ['align', '"left" | "right"', '"right"'],
            ['width', 'string', '"w-44"'],
            ['className', 'string', '""'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-6">
          DropdownMenuItem Type
        </h3>
        <PropsTable
          rows={[
            ['label', 'string', '—'],
            ['icon', 'ReactNode', '—'],
            ['onClick', '() => void', '—'],
            ['danger', 'boolean', 'false'],
            ['divider', 'boolean', 'false'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

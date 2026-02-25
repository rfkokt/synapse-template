import { Card, CardContent, Breadcrumb } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';

export function BreadcrumbSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Breadcrumb"
          description="Navigasi hierarki halaman dengan separator chevron."
        />
        <PreviewCard title="Default">
          <Breadcrumb
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Manajemen Paket', href: '/paket' },
              { label: 'Detail Paket' },
            ]}
            onNavigate={(href) => alert(`Navigate to ${href}`)}
          />
        </PreviewCard>
        <PreviewCard title="Single Item">
          <Breadcrumb items={[{ label: 'Dashboard' }]} />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { Breadcrumb } from '@synapse/ui-kit';

<Breadcrumb
  items={[
    { label: 'Beranda', href: '/' },
    { label: 'Paket', href: '/paket' },
    { label: 'Detail' },
  ]}
  onNavigate={(href) => navigate(href)}
/>`}</CodeBlock>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['items', 'BreadcrumbItem[]', '—'],
            ['className', 'string', '—'],
            ['onNavigate', '(href: string) => void', '—'],
          ]}
        />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          BreadcrumbItem
        </h3>
        <PropsTable
          rows={[
            ['label', 'string', '—'],
            ['href', 'string (optional)', '—'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

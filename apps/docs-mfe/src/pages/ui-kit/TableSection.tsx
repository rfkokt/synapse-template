import { Card, CardContent, Button, Table, DropdownMenu } from '@synapse/ui-kit';
import type { Column } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';
import {
  LuPencil as Pencil,
  LuTrash2 as Trash2,
  LuPlus as Plus,
  LuEye as Eye,
} from 'react-icons/lu';

interface Paket {
  id: number;
  nama: string;
  kategori: string;
  vendor: string;
  deskripsi: string;
  rilis: string;
  status: string;
}

const sampleData: Paket[] = [
  {
    id: 1,
    nama: 'Starter CRM Bundle',
    kategori: 'Starter',
    vendor: 'Synapse Labs',
    deskripsi: 'Lead tracking dasar\nPipeline management',
    rilis: '28 Feb 2026',
    status: 'Belum Aktif',
  },
  {
    id: 2,
    nama: 'Growth CRM Bundle',
    kategori: 'Growth',
    vendor: 'Synapse Labs',
    deskripsi: 'Workflow automation\nTeam dashboard',
    rilis: '27 Mar 2026',
    status: 'Kadaluwarsa',
  },
  {
    id: 3,
    nama: 'Operations Suite 2026',
    kategori: 'Enterprise',
    vendor: 'Northwind Tech',
    deskripsi: 'Order orchestration\nSLA monitoring',
    rilis: '15 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 4,
    nama: 'Analytics Starter',
    kategori: 'Standard',
    vendor: 'DataWorks',
    deskripsi: 'Dashboard KPI\nScheduled report',
    rilis: '10 Jan 2026',
    status: 'Aktif',
  },
  {
    id: 5,
    nama: 'Support Automation Pack',
    kategori: 'Starter',
    vendor: 'Helpgrid',
    deskripsi: 'Auto ticket routing\nKnowledge snippets',
    rilis: '20 Jul 2026',
    status: 'Belum Aktif',
  },
  {
    id: 6,
    nama: 'Omnichannel Premium',
    kategori: 'Premium',
    vendor: 'Connext',
    deskripsi: 'Email, WA, push integration\nUnified inbox',
    rilis: '15 Dec 2026',
    status: 'Aktif',
  },
  {
    id: 7,
    nama: 'Security Compliance Pack',
    kategori: 'Enterprise',
    vendor: 'SecureOps',
    deskripsi: 'Audit log lengkap\nPolicy enforcement',
    rilis: '1 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 8,
    nama: 'Commerce Pro Suite',
    kategori: 'Growth',
    vendor: 'Mercato',
    deskripsi: 'Catalog manager\nPromo engine',
    rilis: '5 Apr 2026',
    status: 'Belum Aktif',
  },
  {
    id: 9,
    nama: 'HR Essentials',
    kategori: 'Standard',
    vendor: 'PeopleFlow',
    deskripsi: 'Leave management\nAttendance sync',
    rilis: '1 Aug 2026',
    status: 'Kadaluwarsa',
  },
  {
    id: 10,
    nama: 'Finance Core Bundle',
    kategori: 'Growth',
    vendor: 'Ledgerly',
    deskripsi: 'Invoicing\nCashflow tracking',
    rilis: '10 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 11,
    nama: 'Project Delivery Lite',
    kategori: 'Starter',
    vendor: 'Sprintline',
    deskripsi: 'Board Kanban\nMilestone tracker',
    rilis: '15 Feb 2026',
    status: 'Belum Aktif',
  },
  {
    id: 12,
    nama: 'Executive Insights',
    kategori: 'Premium',
    vendor: 'Boardview',
    deskripsi: 'Strategic dashboard\nCustom KPI alert',
    rilis: '20 Nov 2026',
    status: 'Aktif',
  },
];

const statusColor: Record<string, string> = {
  Aktif: 'text-emerald-600',
  'Belum Aktif': 'text-neutral-500',
  Kadaluwarsa: 'text-red-500',
};

const columns: Column<Paket>[] = [
  { key: 'nama', header: 'Nama Paket', sortable: true },
  { key: 'kategori', header: 'Kategori', sortable: true },
  { key: 'vendor', header: 'Vendor', sortable: true },
  {
    key: 'deskripsi',
    header: 'Deskripsi',
    sortable: true,
    render: (row) => <span className="whitespace-pre-line text-sm">{row.deskripsi}</span>,
  },
  { key: 'rilis', header: 'Tanggal Rilis', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span className={`font-medium text-sm ${statusColor[row.status] || 'text-neutral-500'}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'aksi',
    header: 'Aksi',
    align: 'center',
    width: 'w-24',
    render: () => (
      <DropdownMenu
        items={[
          { label: 'Lihat Detail', icon: <Eye className="h-4 w-4" /> },
          { label: 'Tambah Item', icon: <Plus className="h-4 w-4" /> },
          { label: 'Edit', icon: <Pencil className="h-4 w-4" />, divider: true },
          { label: 'Hapus', icon: <Trash2 className="h-4 w-4" />, danger: true },
        ]}
      />
    ),
  },
];

export function TableSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Table"
          description="Data table dengan toolbar, search, sorting kolom, dan pagination."
        />

        <PreviewCard title="Full Featured">
          <Table<Paket>
            title="Daftar Paket"
            columns={columns}
            data={sampleData}
            rowKey={(row) => row.id}
            defaultPageSize={10}
            showRowNumbers
            searchable
            searchPlaceholder="Cari paket"
            searchKeys={['nama', 'kategori', 'vendor', 'status']}
            toolbarActions={
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            }
          />
        </PreviewCard>

        <PreviewCard title="Minimal (tanpa toolbar)">
          <Table<Paket>
            columns={columns.filter((c) => ['nama', 'kategori', 'status'].includes(c.key))}
            data={sampleData.slice(0, 3)}
            rowKey={(row) => row.id}
            paginated={false}
          />
        </PreviewCard>

        <PreviewCard title="Empty State">
          <Table<Paket>
            title="Daftar Data"
            columns={columns.filter((c) => ['nama', 'kategori', 'status'].includes(c.key))}
            data={[]}
            rowKey={(row) => row.id}
            emptyMessage="Belum ada data."
            searchable
          />
        </PreviewCard>

        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full">
                <Table<Paket>
                  columns={columns.filter((c) => ['nama', 'kategori', 'status'].includes(c.key))}
                  data={sampleData.slice(0, 3)}
                  rowKey={(row) => row.id}
                  paginated={false}
                />
              </div>
            }
            code={`import { Table, Button } from '@synapse/ui-kit';
import type { Column } from '@synapse/ui-kit';
import {
  LuPlus as Plus,
  LuPencil as Pencil,
  LuTrash2 as Trash2
} from 'react-icons/lu';

const columns: Column<Paket>[] = [
  { key: 'nama', header: 'Nama', sortable: true },
  { key: 'status', header: 'Status', render: (row) => (
    <span className="text-emerald-600">{row.status}</span>
  )},
  { key: 'aksi', header: 'Aksi', align: 'center', render: () => (
    <DropdownMenu items={[
      { label: 'Edit', icon: <Pencil className="h-4 w-4" /> },
      { label: 'Hapus', icon: <Trash2 className="h-4 w-4" />, danger: true }
    ]} />
  )},
];

<Table<Paket>
  title="Daftar Paket"
  columns={columns}
  data={paketList}
  rowKey={(row) => row.id}
  showRowNumbers
  searchable
  searchPlaceholder="Cari paket"
  toolbarActions={<Button><Plus /> Tambah</Button>}
/>`}
            previewClassName="w-full items-start justify-start p-4"
          />
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Table Props
        </h3>
        <PropsTable
          rows={[
            ['columns', 'Column<T>[]', '—'],
            ['data', 'T[]', '—'],
            ['rowKey', '(row, i) => string | number', '—'],
            ['title', 'string', '—'],
            ['searchable', 'boolean', 'false'],
            ['searchPlaceholder', 'string', '"Cari..."'],
            ['searchKeys', 'string[]', 'all column keys'],
            ['toolbarActions', 'ReactNode', '—'],
            ['showRowNumbers', 'boolean', 'false'],
            ['paginated', 'boolean', 'true'],
            ['pageSizes', 'number[]', '[10, 20, 50]'],
            ['defaultPageSize', 'number', '10'],
            ['emptyMessage', 'string', '"Tidak ada data."'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Column&lt;T&gt;
        </h3>
        <PropsTable
          rows={[
            ['key', 'string', '—'],
            ['header', 'string', '—'],
            ['render', '(row, index) => ReactNode', 'row[key]'],
            ['sortable', 'boolean', 'false'],
            ['width', 'string (Tailwind)', '—'],
            ['align', 'left | center | right', 'left'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-8">
          DropdownMenu Props (Sering dipakai di kolom Aksi)
        </h3>
        <PropsTable
          rows={[
            ['items', 'DropdownMenuItem[]', '—'],
            ['trigger', 'ReactNode', '<MoreHorizontal />'],
            ['align', '"left" | "right"', '"right"'],
            ['width', 'string (Tailwind)', '"w-44"'],
          ]}
        />

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-4">
          DropdownMenuItem
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

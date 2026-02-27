import { Card, CardContent, Button, Table, DropdownMenu } from '@synapse/ui-kit';
import type { Column } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';
import {
  LuPencil as Pencil,
  LuTrash2 as Trash2,
  LuPlus as Plus,
  LuEye as Eye,
  LuUserPlus as UserPlus,
} from 'react-icons/lu';

interface Paket {
  id: number;
  nama: string;
  jenis: string;
  maskapai: string;
  hotel: string;
  keberangkatan: string;
  status: string;
}

const sampleData: Paket[] = [
  {
    id: 1,
    nama: 'Umroh Tengah Ramadhan',
    jenis: 'Umroh Bronze',
    maskapai: 'Garuda Indonesia',
    hotel: 'Al Shohada (Makkah)\nConcorde Dar Al Khair Hotel (Madinah)',
    keberangkatan: '28 Feb 2026',
    status: 'Belum Aktif',
  },
  {
    id: 2,
    nama: 'Umroh Akhir Ramadhan',
    jenis: 'Umroh Gold',
    maskapai: 'Garuda Indonesia',
    hotel: 'Anjum Hotel Makkah (Makkah)\nDeyar Al Eiman (Madinah)',
    keberangkatan: '27 Maret 2026',
    status: 'Kadaluwarsa',
  },
  {
    id: 3,
    nama: 'Haji Reguler 2026',
    jenis: 'Haji Plus',
    maskapai: 'Saudi Airlines',
    hotel: 'Hilton Suites (Makkah)\nOberoi Madinah (Madinah)',
    keberangkatan: '15 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 4,
    nama: 'Umroh Awal Tahun',
    jenis: 'Umroh Silver',
    maskapai: 'Garuda Indonesia',
    hotel: 'Swissotel Al Maqam (Makkah)\nPullman Madinah (Madinah)',
    keberangkatan: '10 Jan 2026',
    status: 'Aktif',
  },
  {
    id: 5,
    nama: 'Umroh Liburan Sekolah',
    jenis: 'Umroh Bronze',
    maskapai: 'Batik Air',
    hotel: 'Al Safwah Tower (Makkah)\nAnwar Al Madinah (Madinah)',
    keberangkatan: '20 Jul 2026',
    status: 'Belum Aktif',
  },
  {
    id: 6,
    nama: 'Umroh Premium Akhir Tahun',
    jenis: 'Umroh Platinum',
    maskapai: 'Emirates',
    hotel: 'Raffles Makkah Palace (Makkah)\nThe Oberoi Madinah (Madinah)',
    keberangkatan: '15 Des 2026',
    status: 'Aktif',
  },
  {
    id: 7,
    nama: 'Haji Furoda 2026',
    jenis: 'Haji Furoda',
    maskapai: 'Saudi Airlines',
    hotel: 'Conrad Makkah (Makkah)\nCrowne Plaza Madinah (Madinah)',
    keberangkatan: '1 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 8,
    nama: 'Umroh Syawal',
    jenis: 'Umroh Gold',
    maskapai: 'Garuda Indonesia',
    hotel: 'Makkah Hotel (Makkah)\nMarriott Madinah (Madinah)',
    keberangkatan: '5 Apr 2026',
    status: 'Belum Aktif',
  },
  {
    id: 9,
    nama: 'Umroh Musim Panas',
    jenis: 'Umroh Silver',
    maskapai: 'Batik Air',
    hotel: 'Le Meridien (Makkah)\nHilton Madinah (Madinah)',
    keberangkatan: '1 Aug 2026',
    status: 'Kadaluwarsa',
  },
  {
    id: 10,
    nama: 'Umroh Idul Adha',
    jenis: 'Umroh Gold',
    maskapai: 'Emirates',
    hotel: 'Fairmont Makkah (Makkah)\nRitz Carlton Madinah (Madinah)',
    keberangkatan: '10 Jun 2026',
    status: 'Aktif',
  },
  {
    id: 11,
    nama: 'Umroh Hemat Q1',
    jenis: 'Umroh Bronze',
    maskapai: 'Lion Air',
    hotel: 'Elaf Ajyad (Makkah)\nDar Al Iman (Madinah)',
    keberangkatan: '15 Feb 2026',
    status: 'Belum Aktif',
  },
  {
    id: 12,
    nama: 'Umroh VIP Exclusive',
    jenis: 'Umroh Platinum',
    maskapai: 'Qatar Airways',
    hotel: 'Four Seasons Makkah\nFour Seasons Madinah',
    keberangkatan: '20 Nov 2026',
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
  { key: 'jenis', header: 'Jenis Paket', sortable: true },
  { key: 'maskapai', header: 'Maskapai', sortable: true },
  {
    key: 'hotel',
    header: 'Hotel',
    sortable: true,
    render: (row) => <span className="whitespace-pre-line text-sm">{row.hotel}</span>,
  },
  { key: 'keberangkatan', header: 'Keberangkatan', sortable: true },
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
          { label: 'Tambah Jamaah', icon: <UserPlus className="h-4 w-4" /> },
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
            searchKeys={['nama', 'jenis', 'maskapai', 'status']}
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
            columns={columns.filter((c) => ['nama', 'jenis', 'status'].includes(c.key))}
            data={sampleData.slice(0, 3)}
            rowKey={(row) => row.id}
            paginated={false}
          />
        </PreviewCard>

        <PreviewCard title="Empty State">
          <Table<Paket>
            title="Daftar Jamaah"
            columns={columns.filter((c) => ['nama', 'jenis', 'status'].includes(c.key))}
            data={[]}
            rowKey={(row) => row.id}
            emptyMessage="Belum ada data jamaah."
            searchable
          />
        </PreviewCard>

        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <div className="w-full">
                <Table<Paket>
                  columns={columns.filter((c) => ['nama', 'jenis', 'status'].includes(c.key))}
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

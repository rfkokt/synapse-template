import { Card, CardContent, Table, DropdownMenu, type Column } from '@synapse/ui-kit';
import { TrendingUp, TrendingDown, UserPlus, Eye } from 'lucide-react';

/* ─── Stat Card Data ─── */
const stats = [
  {
    label: 'Total Jamaah',
    value: '4.4k',
    change: '8.5% Meningkat',
    trend: 'up' as const,
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon: '🏆',
  },
  {
    label: 'Terdaftar Hari Ini',
    value: '2',
    change: '1.3% Meningkat',
    trend: 'up' as const,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: '👥',
  },
  {
    label: 'Terdaftar Minggu Ini',
    value: '18',
    change: '8.5% Menurun',
    trend: 'down' as const,
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: '📈',
  },
  {
    label: 'Terdaftar Bulan Ini',
    value: '100',
    change: '1.8% Meningkat',
    trend: 'up' as const,
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: '🕐',
  },
];

/* ─── Paket Table Data ─── */
interface Paket {
  id: number;
  nama: string;
  jenis: string;
  maskapai: string;
  hotel: string;
  harga: string;
}

const paketData: Paket[] = [
  {
    id: 1,
    nama: 'Umroh Awal Ramadhan',
    jenis: 'Umroh Platinum',
    maskapai: 'Garuda Indonesia',
    hotel: 'Intercontinental Dar Al Tawhid Makkah (Makkah) · Madinah Hilton (Madinah)',
    harga: 'Rp. 27.400.000,-',
  },
  {
    id: 2,
    nama: 'Haji Reguler 2026',
    jenis: 'Haji Reguler',
    maskapai: 'Saudi Airlines',
    hotel: 'Pullman Zamzam Makkah · Oberoi Madinah',
    harga: 'Rp. 45.000.000,-',
  },
  {
    id: 3,
    nama: 'Umroh Plus Turki',
    jenis: 'Umroh Gold',
    maskapai: 'Turkish Airlines',
    hotel: 'Hilton Suites Makkah · Anwar Al Madinah Movenpick',
    harga: 'Rp. 32.500.000,-',
  },
  {
    id: 4,
    nama: 'Umroh Akhir Tahun',
    jenis: 'Umroh Silver',
    maskapai: 'Garuda Indonesia',
    hotel: 'Swissotel Al Maqam Makkah · Crowne Plaza Madinah',
    harga: 'Rp. 22.800.000,-',
  },
  {
    id: 5,
    nama: 'Haji Plus VIP',
    jenis: 'Haji Plus',
    maskapai: 'Emirates',
    hotel: 'Fairmont Makkah Clock Tower · The Oberoi Madinah',
    harga: 'Rp. 85.000.000,-',
  },
  {
    id: 6,
    nama: 'Umroh Idul Fitri',
    jenis: 'Umroh Platinum',
    maskapai: 'Garuda Indonesia',
    hotel: 'Conrad Makkah · Dar Al Taqwa Madinah',
    harga: 'Rp. 29.500.000,-',
  },
  {
    id: 7,
    nama: 'Umroh Ekonomi',
    jenis: 'Umroh Economy',
    maskapai: 'Lion Air',
    hotel: 'Elaf Al Mashaer Makkah · Grand Plaza Madinah',
    harga: 'Rp. 18.500.000,-',
  },
  {
    id: 8,
    nama: 'Umroh Plus Dubai',
    jenis: 'Umroh Gold',
    maskapai: 'Emirates',
    hotel: 'Raffles Makkah Palace · Shaza Al Madina',
    harga: 'Rp. 38.000.000,-',
  },
  {
    id: 9,
    nama: 'Umroh Keluarga',
    jenis: 'Umroh Silver',
    maskapai: 'Saudi Airlines',
    hotel: 'Le Meridien Makkah · Millennium Al Madinah',
    harga: 'Rp. 21.000.000,-',
  },
  {
    id: 10,
    nama: 'Haji Furoda',
    jenis: 'Haji Furoda',
    maskapai: 'Garuda Indonesia',
    hotel: 'Makkah Towers · Anwar Al Madinah Movenpick',
    harga: 'Rp. 120.000.000,-',
  },
];

/* ─── Column Definitions ─── */
const paketColumns: Column<Paket>[] = [
  {
    key: 'nama',
    header: 'Nama Paket',
    sortable: true,
    render: (row) => (
      <span className="font-medium text-neutral-900 dark:text-neutral-100">{row.nama}</span>
    ),
  },
  { key: 'jenis', header: 'Jenis Paket', sortable: true },
  { key: 'maskapai', header: 'Maskapai', sortable: true },
  { key: 'hotel', header: 'Hotel', sortable: true },
  {
    key: 'harga',
    header: 'Harga Paket',
    sortable: true,
    align: 'right' as const,
    render: (row) => <span className="font-medium whitespace-nowrap">{row.harga}</span>,
  },
  {
    key: 'aksi',
    header: 'Aksi',
    align: 'center' as const,
    width: 'w-16',
    render: () => (
      <DropdownMenu
        items={[
          {
            label: 'Tambah Jamaah',
            icon: <UserPlus className="h-4 w-4" />,
            onClick: () => console.log('Tambah Jamaah'),
          },
          {
            label: 'Lihat',
            icon: <Eye className="h-4 w-4" />,
            onClick: () => console.log('Lihat'),
          },
        ]}
      />
    ),
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-start justify-between pt-5">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </p>
                <p
                  className={`text-xs font-medium flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Daftar Paket — uses UI Kit Table ── */}
      <Table<Paket>
        title="Daftar Paket"
        columns={paketColumns}
        data={paketData}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Cari paket..."
        searchKeys={['nama', 'jenis', 'maskapai']}
        showRowNumbers
        paginated
        defaultPageSize={10}
        pageSizes={[10, 20, 50]}
      />
    </div>
  );
}

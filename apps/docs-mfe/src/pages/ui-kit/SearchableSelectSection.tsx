import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, SearchableSelect, type SearchableSelectOption } from '@synapse/ui-kit';
import { apiClient } from '@synapse/shared-api';
import { ExampleTabs, SectionHeader, PreviewCard, PropsTable } from './shared';

const fruitOptions: SearchableSelectOption[] = [
  { value: 'apel', label: '🍎 Apel', keywords: ['apple', 'merah'] },
  { value: 'pisang', label: '🍌 Pisang', keywords: ['banana', 'kuning'] },
  { value: 'jeruk', label: '🍊 Jeruk', keywords: ['orange', 'citrus'] },
  { value: 'mangga', label: '🥭 Mangga', keywords: ['mango', 'tropis'] },
  { value: 'semangka', label: '🍉 Semangka', keywords: ['watermelon'] },
  { value: 'anggur', label: '🍇 Anggur', keywords: ['grape', 'ungu'] },
];

const cityApiDataset: SearchableSelectOption[] = [
  { value: 'jakarta', label: 'Jakarta', group: 'Jawa' },
  { value: 'bandung', label: 'Bandung', group: 'Jawa' },
  { value: 'surabaya', label: 'Surabaya', group: 'Jawa' },
  { value: 'semarang', label: 'Semarang', group: 'Jawa' },
  { value: 'yogyakarta', label: 'Yogyakarta', group: 'Jawa' },
  { value: 'medan', label: 'Medan', group: 'Sumatera' },
  { value: 'palembang', label: 'Palembang', group: 'Sumatera' },
  { value: 'padang', label: 'Padang', group: 'Sumatera' },
  { value: 'makassar', label: 'Makassar', group: 'Sulawesi' },
  { value: 'manado', label: 'Manado', group: 'Sulawesi' },
  { value: 'balikpapan', label: 'Balikpapan', group: 'Kalimantan' },
  { value: 'pontianak', label: 'Pontianak', group: 'Kalimantan' },
];

const searchLocalExampleCode = `import {
  SearchableSelect,
  type SearchableSelectOption,
} from '@synapse/ui-kit';

const [value, setValue] = useState('');
const fruitOptions: SearchableSelectOption[] = [
  { value: 'apel', label: '🍎 Apel' },
  { value: 'pisang', label: '🍌 Pisang' },
  { value: 'jeruk', label: '🍊 Jeruk' },
  { value: 'mangga', label: '🥭 Mangga' },
];

<SearchableSelect
  value={value}
  onValueChange={setValue}
  options={fruitOptions}
  placeholder="Pilih buah..."
  searchPlaceholder="Cari buah..."
  triggerClassName="w-[240px]"
/>;
`;

const searchApiExampleCode = `import {
  SearchableSelect,
  type SearchableSelectOption,
} from '@synapse/ui-kit';
import { apiClient } from '@synapse/shared-api';

const [city, setCity] = useState('');

const fetchCities = async (query: string) => {
  const response = await apiClient.get('/api/users/me', {
    params: { q: query },
  });
  return (response.data?.data ?? response.data) as SearchableSelectOption[];
};

<SearchableSelect
  value={city}
  onValueChange={setCity}
  fetchOptions={fetchCities}
  minQueryLength={2}
  placeholder="Cari kota..."
  searchPlaceholder="Ketik nama kota..."
  triggerClassName="w-[240px]"
/>;
`;

export function SearchableSelectSection() {
  const [searchableFruit, setSearchableFruit] = useState('');
  const [searchableCity, setSearchableCity] = useState('');

  const selectedLocalFruitLabel = useMemo(
    () => fruitOptions.find((option) => option.value === searchableFruit)?.label ?? '',
    [searchableFruit]
  );

  const selectedApiCityLabel = useMemo(
    () => cityApiDataset.find((option) => option.value === searchableCity)?.label ?? '',
    [searchableCity]
  );

  const fetchCities = useCallback(async (query: string) => {
    const normalized = query.toLowerCase();

    try {
      const response = await apiClient.get('/api/users/me', {
        params: { q: query },
      });

      const payload = response.data as
        | SearchableSelectOption[]
        | { data?: SearchableSelectOption[] }
        | undefined;
      const apiOptions = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      if (apiOptions.length > 0) {
        return apiOptions.filter((option) => option.label.toLowerCase().includes(normalized));
      }
    } catch {
      // Fallback local dataset untuk demo docs agar tetap bisa di-preview.
    }

    return cityApiDataset
      .filter((option) => option.label.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Searchable Select"
          description="Select dengan input pencarian built-in, mendukung filtering lokal dan remote fetch API."
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PreviewCard title="Search (Local)" className="mb-0 h-full">
            <ExampleTabs
              preview={
                <div className="flex flex-wrap items-center gap-4">
                  <SearchableSelect
                    value={searchableFruit}
                    onValueChange={setSearchableFruit}
                    options={fruitOptions}
                    placeholder="Pilih buah..."
                    searchPlaceholder="Cari buah..."
                    triggerClassName="w-[240px]"
                  />
                  {searchableFruit && (
                    <span className="text-sm text-neutral-500">
                      Selected: {selectedLocalFruitLabel}
                    </span>
                  )}
                </div>
              }
              code={searchLocalExampleCode}
            />
          </PreviewCard>

          <PreviewCard title="Search (API)" className="mb-0 h-full">
            <ExampleTabs
              preview={
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <SearchableSelect
                      value={searchableCity}
                      onValueChange={setSearchableCity}
                      fetchOptions={fetchCities}
                      placeholder="Cari kota..."
                      searchPlaceholder="Ketik nama kota..."
                      minQueryLength={2}
                      triggerClassName="w-[240px]"
                      emptyText="Kota tidak ditemukan."
                    />
                    {searchableCity && (
                      <span className="text-sm text-neutral-500">
                        Selected: {selectedApiCityLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Ketik minimal 2 karakter untuk query API.
                  </p>
                </div>
              }
              code={searchApiExampleCode}
            />
          </PreviewCard>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['value', 'string', '(required)'],
            ['onValueChange', '(value: string) => void', '(required)'],
            ['options', 'SearchableSelectOption[]', '[]'],
            ['fetchOptions', '(query: string) => Promise<SearchableSelectOption[]>', '—'],
            ['placeholder', 'string', '"Pilih..."'],
            ['searchPlaceholder', 'string', '"Cari..."'],
            ['minQueryLength', 'number', '0'],
            ['debounceMs', 'number', '350'],
            ['emptyText', 'string', '"Tidak ada hasil."'],
            ['loadingText', 'string', '"Memuat..."'],
            ['errorText', 'string', '"Gagal memuat data."'],
            ['size', '"sm" | "default"', '"default"'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

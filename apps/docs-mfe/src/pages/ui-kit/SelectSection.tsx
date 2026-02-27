import { useCallback, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  SearchableSelect,
  type SearchableSelectOption,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@synapse/ui-kit';
import { apiClient } from '@synapse/shared-api';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';

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

export function SelectSection() {
  const [fruit, setFruit] = useState('');
  const [city, setCity] = useState('');
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
          title="Select"
          description="Dropdown select berbasis Radix UI dengan grouped items dan opsi searchable (local + API)."
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PreviewCard title="Basic" className="mb-0 h-full">
            <div className="flex flex-wrap gap-4 items-start">
              <Select value={fruit} onValueChange={setFruit}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih buah..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apel">🍎 Apel</SelectItem>
                  <SelectItem value="pisang">🍌 Pisang</SelectItem>
                  <SelectItem value="jeruk">🍊 Jeruk</SelectItem>
                  <SelectItem value="mangga">🥭 Mangga</SelectItem>
                </SelectContent>
              </Select>
              {fruit && (
                <span className="text-sm text-neutral-500 self-center">Selected: {fruit}</span>
              )}
            </div>
          </PreviewCard>

          <PreviewCard title="Grouped Items" className="mb-0 h-full">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Pilih kota..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Jawa</SelectLabel>
                  <SelectItem value="jakarta">Jakarta</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                  <SelectItem value="bandung">Bandung</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Sumatera</SelectLabel>
                  <SelectItem value="medan">Medan</SelectItem>
                  <SelectItem value="palembang">Palembang</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PreviewCard>

          <PreviewCard title="Search (Local)" className="mb-0 h-full">
            <div className="flex flex-wrap gap-4 items-start">
              <SearchableSelect
                value={searchableFruit}
                onValueChange={setSearchableFruit}
                options={fruitOptions}
                placeholder="Pilih buah..."
                searchPlaceholder="Cari buah..."
                triggerClassName="w-[240px]"
              />
              {searchableFruit && (
                <span className="text-sm text-neutral-500 self-center">
                  Selected: {selectedLocalFruitLabel}
                </span>
              )}
            </div>
          </PreviewCard>

          <PreviewCard title="Search (API)" className="mb-0 h-full">
            <div className="flex flex-wrap gap-4 items-start">
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
                <span className="text-sm text-neutral-500 self-center">
                  Selected: {selectedApiCityLabel}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Ketik minimal 2 karakter untuk query API.
            </p>
          </PreviewCard>

          <PreviewCard title="Sizes" className="mb-0 xl:col-span-2">
            <div className="flex flex-wrap gap-4 items-start">
              <Select>
                <SelectTrigger size="sm" className="w-[160px]">
                  <SelectValue placeholder="Size SM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger size="default" className="w-[160px]">
                  <SelectValue placeholder="Size Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PreviewCard>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Select (Basic + Grouped)
            </p>
            <CodeBlock>{`import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@synapse/ui-kit';

const [fruit, setFruit] = useState('');
const [city, setCity] = useState('');

<Select value={fruit} onValueChange={setFruit}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Pilih buah..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apel">🍎 Apel</SelectItem>
    <SelectItem value="pisang">🍌 Pisang</SelectItem>
    <SelectItem value="jeruk">🍊 Jeruk</SelectItem>
    <SelectItem value="mangga">🥭 Mangga</SelectItem>
  </SelectContent>
</Select>

<Select value={city} onValueChange={setCity}>
  <SelectTrigger className="w-[240px]">
    <SelectValue placeholder="Pilih kota..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Jawa</SelectLabel>
      <SelectItem value="jakarta">Jakarta</SelectItem>
      <SelectItem value="surabaya">Surabaya</SelectItem>
      <SelectItem value="bandung">Bandung</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Sumatera</SelectLabel>
      <SelectItem value="medan">Medan</SelectItem>
      <SelectItem value="palembang">Palembang</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</CodeBlock>
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              SearchableSelect (Local + API)
            </p>
            <CodeBlock>{`import {
  SearchableSelect,
  type SearchableSelectOption,
} from '@synapse/ui-kit';
import { apiClient } from '@synapse/shared-api';

const localOptions: SearchableSelectOption[] = [
  { value: 'apel', label: '🍎 Apel' },
  { value: 'pisang', label: '🍌 Pisang' },
];
const [searchableFruit, setSearchableFruit] = useState('');
const [searchableCity, setSearchableCity] = useState('');

const fetchCities = async (query: string) => {
  const response = await apiClient.get('/api/users/me', {
    params: { q: query },
  });
  return (response.data?.data ?? response.data) as SearchableSelectOption[];
};

<SearchableSelect
  value={searchableFruit}
  onValueChange={setSearchableFruit}
  options={localOptions}
  placeholder="Pilih buah..."
  searchPlaceholder="Cari buah..."
/>;

<SearchableSelect
  value={searchableCity}
  onValueChange={setSearchableCity}
  fetchOptions={fetchCities}
  minQueryLength={2}
  placeholder="Cari kota..."
/>;`}</CodeBlock>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Components</h3>
        <PropsTable
          rows={[
            ['Select', 'Root wrapper', 'value, onValueChange, defaultValue'],
            ['SelectTrigger', 'Trigger button', 'size: sm | default'],
            ['SelectValue', 'Display selected value', 'placeholder'],
            ['SelectContent', 'Dropdown content', 'position, align'],
            ['SelectItem', 'Option item', 'value (required)'],
            ['SelectGroup', 'Group wrapper', '—'],
            ['SelectLabel', 'Group label', '—'],
            ['SelectSeparator', 'Visual separator', '—'],
            ['SearchableSelect', 'Select with search input', 'options | fetchOptions'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

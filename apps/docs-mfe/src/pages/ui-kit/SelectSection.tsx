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

const basicExampleCode = `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@synapse/ui-kit';

const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Pilih buah..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apel">🍎 Apel</SelectItem>
    <SelectItem value="pisang">🍌 Pisang</SelectItem>
    <SelectItem value="jeruk">🍊 Jeruk</SelectItem>
    <SelectItem value="mangga">🥭 Mangga</SelectItem>
  </SelectContent>
</Select>;`;

const groupedExampleCode = `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@synapse/ui-kit';

const [city, setCity] = useState('');

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
</Select>;`;

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
/>;`;

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
/>;`;

const sizesExampleCode = `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@synapse/ui-kit';

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
</Select>;`;

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
            <ExampleTabs
              preview={
                <div className="flex flex-wrap items-center gap-4">
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
                  {fruit && <span className="text-sm text-neutral-500">Selected: {fruit}</span>}
                </div>
              }
              code={basicExampleCode}
            />
          </PreviewCard>

          <PreviewCard title="Grouped Items" className="mb-0 h-full">
            <ExampleTabs
              preview={
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
              }
              code={groupedExampleCode}
            />
          </PreviewCard>

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

          <PreviewCard title="Sizes" className="mb-0 xl:col-span-2">
            <ExampleTabs
              preview={
                <div className="flex flex-wrap items-center gap-4">
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
              }
              code={sizesExampleCode}
            />
          </PreviewCard>
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

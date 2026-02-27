import { useState } from 'react';
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@synapse/ui-kit';
import { ExampleTabs, SectionHeader, PreviewCard, PropsTable } from './shared';

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

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Select"
          description="Dropdown select berbasis Radix UI dengan grouped items dan ukuran trigger."
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
          ]}
        />
      </CardContent>
    </Card>
  );
}

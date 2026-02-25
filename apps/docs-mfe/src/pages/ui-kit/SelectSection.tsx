import { useState } from 'react';
import {
  Card,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';

export function SelectSection() {
  const [fruit, setFruit] = useState('');
  const [city, setCity] = useState('');

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Select"
          description="Dropdown select berbasis Radix UI dengan animasi dan grouped items."
        />

        <PreviewCard title="Basic">
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

        <PreviewCard title="Grouped Items">
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

        <PreviewCard title="Sizes">
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

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@synapse/ui-kit';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Pilih..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`}</CodeBlock>

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

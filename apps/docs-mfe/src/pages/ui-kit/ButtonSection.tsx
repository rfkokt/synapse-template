import { Button, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock, PropsTable } from './shared';

export function ButtonSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Button"
          description="Tombol interaktif dengan variant dan size berbeda."
        />
        <PreviewCard title="Variants">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </PreviewCard>
        <PreviewCard title="Sizes">
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </PreviewCard>
        <PreviewCard title="States">
          <div className="flex flex-wrap gap-3 items-center">
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { Button } from '@synapse/ui-kit';

<Button variant="primary" size="md">Click me</Button>
<Button variant="danger">Hapus</Button>
<Button isLoading>Menyimpan...</Button>`}</CodeBlock>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['variant', 'primary | secondary | outline | ghost | danger', 'primary'],
            ['size', 'sm | md | lg | icon', 'md'],
            ['isLoading', 'boolean', 'false'],
            ['disabled', 'boolean', 'false'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button, Modal, Card, CardContent } from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

export function ModalSection() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader title="Modal / Dialog" description="Native <dialog> element. 3 sizes." />
        <PreviewCard title="Try it">
          <div className="flex flex-wrap gap-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button
                key={s}
                variant="outline"
                onClick={() => {
                  setSize(s);
                  setOpen(true);
                }}
              >
                Open {s.toUpperCase()}
              </Button>
            ))}
          </div>
        </PreviewCard>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Contoh Modal"
          description={`Size: ${size}`}
          size={size}
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Konten modal.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => setOpen(false)}>Simpan</Button>
          </div>
        </Modal>
        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <Button
                variant="outline"
                onClick={() => {
                  setSize('md');
                  setOpen(true);
                }}
              >
                Open Modal
              </Button>
            }
            code={`import { Modal } from '@synapse/ui-kit';

const [open, setOpen] = useState(false);

<Modal open={open} onClose={() => setOpen(false)} title="Judul" size="md">
  <p>Konten</p>
</Modal>`}
          />
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['open', 'boolean', 'false'],
            ['onClose', '() => void', '—'],
            ['title', 'string', '—'],
            ['size', 'sm | md | lg | fullscreen', 'md'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

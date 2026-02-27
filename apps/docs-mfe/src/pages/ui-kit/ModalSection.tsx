import { useState } from 'react';
import {
  Button,
  Modal,
  Card,
  CardContent,
  type ModalPosition,
  type ModalSize,
} from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, ExampleTabs, PropsTable } from './shared';

const sizeOptions: Array<{ value: ModalSize; label: string }> = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'full', label: 'FULL WIDTH' },
  { value: 'fullscreen', label: 'FULLSCREEN' },
];

const positionOptions: Array<{ value: ModalPosition; label: string }> = [
  { value: 'top-left', label: 'Kiri Atas' },
  { value: 'top-center', label: 'Tengah Atas' },
  { value: 'top-right', label: 'Kanan Atas' },
  { value: 'center-left', label: 'Kiri Tengah' },
  { value: 'center', label: 'Tengah' },
  { value: 'center-right', label: 'Kanan Tengah' },
  { value: 'bottom-left', label: 'Kiri Bawah' },
  { value: 'bottom-center', label: 'Tengah Bawah' },
  { value: 'bottom-right', label: 'Kanan Bawah' },
];

const usageCode = `import { Modal } from '@synapse/ui-kit';

const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Update Profil"
  size="full"
  position="top-right"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setOpen(false)}>
        Batal
      </Button>
      <Button onClick={() => setOpen(false)}>Simpan</Button>
    </div>
  }
>
  <p>Konten modal panjang bisa di-scroll, footer tetap terlihat.</p>
</Modal>;`;

export function ModalSection() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>('md');
  const [position, setPosition] = useState<ModalPosition>('center');

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Modal / Dialog"
          description="Native <dialog> element dengan size (sm, md, lg, full, fullscreen) dan posisi fleksibel."
        />

        <PreviewCard title="Try Size & Position">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={size === option.value ? 'primary' : 'outline'}
                    onClick={() => setSize(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Position
              </p>
              <div className="flex flex-wrap gap-2">
                {positionOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={position === option.value ? 'primary' : 'outline'}
                    onClick={() => setPosition(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="primary" onClick={() => setOpen(true)}>
              Open ({size} • {position})
            </Button>
          </div>
        </PreviewCard>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Contoh Modal"
          description={`Size: ${size} • Position: ${position}`}
          size={size}
          position={position}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setOpen(false)}>Simpan</Button>
            </div>
          }
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            Konten modal dengan pengaturan size/position. Footer di bawah tetap terlihat meskipun
            isi konten panjang dan di-scroll.
          </p>
          <div className="space-y-2">
            {Array.from({ length: 18 }).map((_, index) => (
              <p key={index} className="text-sm text-neutral-500 dark:text-neutral-400">
                Item konten panjang #{index + 1} - ini simulasi isi modal agar area body bisa
                di-scroll.
              </p>
            ))}
          </div>
        </Modal>

        <PreviewCard title="Usage" className="mb-0">
          <ExampleTabs
            preview={
              <Button
                variant="outline"
                onClick={() => {
                  setSize('full');
                  setPosition('top-right');
                  setOpen(true);
                }}
              >
                Open Full Width Top Right
              </Button>
            }
            code={usageCode}
          />
        </PreviewCard>

        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Props</h3>
        <PropsTable
          rows={[
            ['open', 'boolean', 'false'],
            ['onClose', '() => void', '—'],
            ['title', 'string', '—'],
            ['description', 'string', '—'],
            ['size', 'sm | md | lg | full | fullscreen', 'md'],
            [
              'position',
              'center | top-left | top-center | top-right | center-left | center-right | bottom-left | bottom-center | bottom-right',
              'center',
            ],
            ['footer', 'ReactNode', '—'],
            ['showClose', 'boolean', 'true'],
          ]}
        />
      </CardContent>
    </Card>
  );
}

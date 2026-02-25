import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@synapse/ui-kit';
import { SectionHeader, PreviewCard, CodeBlock } from './shared';

export function CardSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <SectionHeader
          title="Card"
          description="Kontainer konten dengan Header, Title, Description, Content, Footer."
        />
        <PreviewCard>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Deskripsi singkat</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Konten utama card.</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm">Simpan</Button>
                <Button size="sm" variant="outline">
                  Batal
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,234</div>
                <p className="text-sm text-emerald-600">+12.5%</p>
              </CardContent>
            </Card>
          </div>
        </PreviewCard>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Usage</h3>
        <CodeBlock>{`import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@synapse/ui-kit';

<Card>
  <CardHeader>
    <CardTitle>Judul</CardTitle>
  </CardHeader>
  <CardContent>Isi konten</CardContent>
  <CardFooter><Button>Aksi</Button></CardFooter>
</Card>`}</CodeBlock>
      </CardContent>
    </Card>
  );
}

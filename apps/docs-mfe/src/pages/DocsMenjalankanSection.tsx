import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';

export function DocsMenjalankanSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 text-sm font-bold">
            2
          </span>
          Menjalankan Aplikasi
        </CardTitle>
        <CardDescription>Perintah CLI untuk pengembangan lokal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <CodeBlock
          language="bash"
          codeString={`# Install dependencies (jika baru pertama kali clone)
pnpm install

# Jalankan SEMUA modul sekaligus + Clear NX Cache (Sangat Direkomendasikan)
pnpm run dev:new

# Atau jalankan secara spesifik tanpa clear cache
pnpm nx run-many --target=serve --projects=shell,auth-mfe --parallel

# Buka di browser
# Shell:         http://localhost:4000
# Auth MFE:      http://localhost:4001
# Pendaftaran:   http://localhost:4002
# Docs MFE:      http://localhost:4003`}
        />
      </CardContent>
    </Card>
  );
}

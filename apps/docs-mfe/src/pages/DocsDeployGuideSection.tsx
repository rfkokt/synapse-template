import { SectionTitle, CodeBlock, InfoBox, DocsStep, StepList } from '@synapse/shared-components';
import { Card, CardContent } from '@synapse/ui-kit';
import { LuRocket as Rocket, LuCloud as Cloud, LuLink as Link } from 'react-icons/lu';

export function DocsDeployGuideSection() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <SectionTitle
          icon={<Rocket className="h-5 w-5" />}
          title="Deploy & CI/CD (GitHub Actions)"
          description="Panduan implementasi pipeline CI/CD menggunakan GitHub Actions di arsitektur Nx Monorepo dan cara menyambungkan MFE lokal ke remote yang sudah ter-publish."
        />

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            1. Pipeline CI/CD: GitHub Actions
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Di dalam Nx Monorepo, kita tidak perlu mem-build ulang semua aplikasi ketika ada
            perubahan kecil di salah satu aplikasi. Kita menggunakan fitur <code>nx affected</code>{' '}
            untuk mem-build dan men-deploy <strong>hanya aplikasi yang terdampak (affected)</strong>{' '}
            oleh perubahan di PR tersebut.
          </p>

          <DocsStep title="Contoh Workflow GitHub Actions (.github/workflows/ci.yml)">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Workflow ini mengecek affected apps dan menjalankan lint, test, serta build.
            </p>
            <CodeBlock
              language="yaml"
              codeString={`name: CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Menggunakan pnpm
      - uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Konfigurasi Nx SHAs untuk affected commands
      - uses: nrwl/nx-set-shas@v4

      - name: Run checks & build on affected apps
        run: |
          pnpm exec nx affected -t lint
          pnpm exec nx affected -t test
          pnpm exec nx affected -t build

      # Opsional: Upload hasil build (dist/apps/*) untuk di-deploy ke S3/Vercel/dll
      - name: Upload dist artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-outputs
          path: dist/apps/`}
            />
          </DocsStep>

          <InfoBox variant="blue" title="Deploy ke Cloud" className="mt-4">
            Secara spesifik, setiap folder di dalam <code>dist/apps/[mfe-name]</code> berisi file
            statis HTML, JS, CSS, dan <code>mf-manifest.json</code>. Folder ini dapat di-serve
            sebagai static web hosting dengan mengunggahnya ke Vercel, AWS S3 / CloudFront, Netlify,
            atau Nginx.
          </InfoBox>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 mt-12">
            <Link className="h-5 w-5" />
            2. Menyambung Host Lokal ke Published Remote
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Seringkali Anda bekerja secara lokal di aplikasi Shell / Host, tapi Anda tidak ingin
            mem-build dan menjalankan semua aplikasi Remote (MFE lain) di lokal komputer Anda. Modul
            Federation membuat Anda sangat mudah untuk menarik Remote yang sudah di-deploy ke
            Staging/Production.
          </p>

          <StepList
            steps={[
              {
                title: 'Buka File remotes.json',
                content:
                  'Aplikasi Shell dalam template ini menggunakan dynamic discovery untuk remote. File ini terletak di `apps/shell/public/remotes.json`.',
              },
              {
                title: 'Ubah URL Manifest ke URL Staging/Prod',
                content:
                  'Ganti URL `http://localhost:xxxx/mf-manifest.json` menjadi URL Production (misalnya Vercel, S3 atau yang lainnya).',
              },
              {
                title: 'Restart Vite Shell (Hot-reload)',
                content:
                  'Vite akan memanggil module MFE secara remote (melalui network request) langsung ke environment Staging.',
              },
            ]}
          />

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
            Contoh <code>remotes.json</code> Lokal
          </h4>
          <CodeBlock
            language="json"
            codeString={`{
  "remotes": {
    "authMfe": {
      "name": "authMfe",
      "entry": "http://localhost:4001/mf-manifest.json",
      "activeWhenPath": "/auth"
    },
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "http://localhost:4003/mf-manifest.json",
      "activeWhenPath": "/docs"
    }
  }
}`}
          />

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
            Contoh <code>remotes.json</code> Hybrid (Local Auth, Production Docs)
          </h4>
          <CodeBlock
            language="json"
            codeString={`{
  "remotes": {
    "authMfe": {
      "name": "authMfe",
      "entry": "http://localhost:4001/mf-manifest.json",
      "activeWhenPath": "/auth"
    },
    "docs-mfe": {
      "name": "docsmfe",
      "entry": "https://docs.stg.synapse.id/mf-manifest.json",
      "activeWhenPath": "/docs"
    }
  }
}`}
          />

          <InfoBox variant="emerald" title="Keuntungan" className="mt-4">
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>
                <strong>Hemat RAM & CPU lokal:</strong> Tidak perlu menjalankan 10+ MFE dan Nx
                Server sekaligus.
              </li>
              <li>
                <strong>Fokus pada konteks pengembangan:</strong> Kembangkan MFE A sambil
                berinteraksi dengan MFE B versi Production.
              </li>
              <li>
                <strong>Hot-Reload Tetap Jalan:</strong> Vite hot-module-replacement (HMR) tetap
                berfungsi sempurna di MFE yang sedang di-serve lokal.
              </li>
            </ul>
          </InfoBox>

          <InfoBox variant="amber" title="Catatan tentang CORS" className="mt-4">
            Pastikan server Production (S3, Vercel, dll) tempat Anda menghosting MFE mengizinkan
            header CORS: <code>Access-Control-Allow-Origin: *</code>. Module Federation membutuhkan
            CORS yang terbuka untuk bisa me-load file <code>mf-manifest.json</code> secara dinamis
            ke <code>http://localhost:4000</code>.
          </InfoBox>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 mt-12">
            <Cloud className="h-5 w-5" />
            3. Deploy dengan Docker & Nginx
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Jika Anda ingin men-deploy MFE ini ke VPS, Kubernetes, atau lingkungan containerized
            yang menggunakan Docker, Anda bisa menggunakan Nginx untuk meng-host file statis hasil
            build.
          </p>

          <StepList
            steps={[
              {
                title: 'Buat file Dockerfile',
                content: 'Taruh Dockerfile ini di root proyek.',
              },
              {
                title: 'Build Image',
                content:
                  'Jalankan perintah `docker build -t synapse-app --build-arg APP_NAME=shell .` untuk membangun Docker image berisi file statis MFE yang sudah di-compile.',
              },
              {
                title: 'Run Container',
                content:
                  'Jalankan aplikasi MFE dengan port yang Anda tentukan: `docker run -d -p 8080:80 synapse-app`',
              },
            ]}
          />

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
            Contoh <code>Dockerfile</code> Multi-stage Build (Nginx)
          </h4>
          <CodeBlock
            language="dockerfile"
            codeString={`# 1. Tahap Build
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Salin dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Salin seluruh kode sumber
COPY . .

# Argument untuk fleksibilitas deploy MFE berbeda menggunakan Dockerfile yang sama
ARG APP_NAME=shell
RUN npx nx build \${APP_NAME}

# 2. Tahap Production (Nginx)
FROM nginx:alpine

# Konfigurasi nginx untuk menangani React Router SPA
RUN echo "server { \\
    listen 80; \\
    location / { \\
        root /usr/share/nginx/html; \\
        index index.html index.htm; \\
        try_files \\$uri \\$uri/ /index.html; \\
        \\
        # Menambahkan CORS untuk Module Federation \\
        add_header 'Access-Control-Allow-Origin' '*'; \\
    } \\
}" > /etc/nginx/conf.d/default.conf

ARG APP_NAME=shell
# Salin hasil build dari tahap builder ke folder nginx
COPY --from=builder /app/dist/apps/\${APP_NAME} /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`}
          />

          <InfoBox variant="blue" title="Penting tentang CORS di Nginx" className="mt-4">
            Sangat penting untuk menyisipkan{' '}
            <code>add_header 'Access-Control-Allow-Origin' '*';</code> pada konfigurasi Nginx jika
            container ini melayani aplikasi MFE Remotes. Karena Module Federation membutuhkan CORS
            untuk me-load manifest jarak jauh.
          </InfoBox>

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
            Pipelining Docker di GitHub Actions
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Sangat bisa! Anda bisa menyambungkan tahapan Build Docker di atas ke dalam pipeline
            GitHub Actions. Anda bisa menambahkan <em>job</em> spesifik untuk build image dan
            mendorongnya ke registry seperti GitHub Container Registry (GHCR) atau Docker Hub.
          </p>
          <CodeBlock
            language="yaml"
            codeString={`name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Login ke Docker Hub atau GHCR
      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

          # Build & Push otomatis ke Registry
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}/synapse-shell:latest
          build-args: |
            APP_NAME=shell

      # Opsional: Jika Anda menggunakan VPS, Anda bisa meminta VPS untuk pull image terbaru menggunakan SSH
      - name: Deploy to VPS Server via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}       # IP Address Server (Misal: 101.202.x.x)
          username: \${{ secrets.VPS_USERNAME }} # User SSH Server (Misal: root atau ubuntu)
          key: \${{ secrets.VPS_SSH_KEY }}       # Private Key Server untuk akses SSH
          script: |
            docker login ghcr.io -u \${{ github.actor }} -p \${{ secrets.GITHUB_TOKEN }}
            docker pull ghcr.io/\${{ github.repository }}/synapse-shell:latest
            
            # Hentikan container lama jika ada
            docker stop synapse-shell || true
            docker rm synapse-shell || true
            
            # Jalankan container baru
            docker run -d -p 8080:80 --name synapse-shell ghcr.io/\${{ github.repository }}/synapse-shell:latest`}
          />

          <InfoBox
            variant="emerald"
            title="Konfigurasi Variabel & Secrets (GitHub Actions)"
            className="mt-4"
          >
            <p className="mb-2">
              Untuk membuat pipeline Docker di atas berjalan, perhatikan Variabel dan Secrets
              berikut:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>
                  <code>{`\${{ github.actor }}`}</code> & <code>{`\${{ github.repository }}`}</code>
                  :
                </strong>{' '}
                Ini adalah variabel bawaan GitHub (default). Anda tidak perlu mensetup apapun.
              </li>
              <li>
                <strong>
                  <code>{`\${{ secrets.GITHUB_TOKEN }}`}</code>:
                </strong>{' '}
                Token rahasia bawaan GitHub untuk autentikasi ke GHCR (GitHub Container Registry).
                Otomatis tersedia, <strong>tetapi</strong> pastikan Anda memberikan akses{' '}
                <em>Read and write permissions</em> di menu{' '}
                <strong>Settings &gt; Actions &gt; General &gt; Workflow permissions</strong> pada
                repositori Anda.
              </li>
              <li>
                <strong>Bagaimana jika menggunakan Docker Hub atau Cloud provider lain?</strong>
                <br />
                Ganti <em>registry</em> menjadi server tujuan Anda (misal docker.io). Lalu tambahkan
                kredensial login (seperti username dan password/token) secara manual ke dalam menu{' '}
                <strong>
                  Settings &gt; Secrets and variables &gt; Actions &gt; New repository secret
                </strong>
                . Ubah konfigurasi workflow menjadi: <br />
                <code>username: {`\${{ secrets.DOCKER_USERNAME }}`}</code>
                <br />
                <code>password: {`\${{ secrets.DOCKER_PASSWORD }}`}</code>
              </li>
            </ul>
          </InfoBox>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            4. Multi-Repo: Publish Shared Libs ke Verdaccio Server
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 mt-12">
            <Cloud className="h-5 w-5" />
            4. Multi-Repo: Publish Shared Libs ke Verdaccio Server
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Pada arsitektur multi-repo, setiap MFE standalone mengkonsumsi shared libs (
            <code>@synapse/ui-kit</code>, <code>@synapse/shared-types</code>, dll.) dari{' '}
            <strong>Verdaccio Server</strong> — bukan <code>workspace:*</code>. Oleh karena itu,
            setiap kali ada perubahan di shared libs, libs harus di-publish ke server registry.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-4 space-y-2">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
              🔀 Kapan Publish ke Verdaccio Server?
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-purple-100 dark:border-purple-900">
                <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">
                  🔄 Otomatis (CI/CD)
                </p>
                <p className="text-purple-600 dark:text-purple-400 text-xs">
                  Setiap merge ke{' '}
                  <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">main</code>{' '}
                  yang mengubah folder{' '}
                  <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">libs/</code>,
                  pipeline otomatis build & publish ke Verdaccio Server.
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-purple-100 dark:border-purple-900">
                <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">
                  💻 Manual (Lokal)
                </p>
                <p className="text-purple-600 dark:text-purple-400 text-xs">
                  Hanya saat develop komponen baru & test di MFE standalone{' '}
                  <strong>sebelum merge</strong>. Pakai Verdaccio lokal:{' '}
                  <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">
                    pnpm run libs:publish:local
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>

          <DocsStep title="Pipeline: Auto-Publish Shared Libs ke Verdaccio Server">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Workflow ini hanya berjalan jika ada perubahan di folder <code>libs/</code>. Publish
              ke self-hosted Verdaccio server agar semua MFE standalone mendapatkan versi terbaru.
            </p>
            <CodeBlock
              language="yaml"
              codeString={`name: Publish Shared Libs to Verdaccio

on:
  push:
    branches: [main]
    paths:
      - 'libs/**'

jobs:
  publish-libs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Setup .npmrc untuk publish ke Verdaccio Server
      - name: Configure Verdaccio registry
        run: |
          echo "@synapse:registry=\${{ secrets.VERDACCIO_URL }}" >> .npmrc
          echo "//\${{ secrets.VERDACCIO_HOST }}/:_authToken=\${{ secrets.VERDACCIO_TOKEN }}" >> .npmrc

      # Build & Publish semua shared libs
      - name: Build & Publish libs
        run: |
          pnpm run libs:build
          pnpm -r --filter './libs/*' publish --no-git-checks`}
            />
          </DocsStep>

          <InfoBox variant="amber" title="Secrets yang Diperlukan" className="mt-4">
            <ul className="list-disc list-inside space-y-1 mt-1 text-sm">
              <li>
                <code>VERDACCIO_URL</code> — URL registry server, contoh:{' '}
                <code>https://registry.synapse.id</code>
              </li>
              <li>
                <code>VERDACCIO_HOST</code> — Hostname saja (tanpa protocol), contoh:{' '}
                <code>registry.synapse.id</code>
              </li>
              <li>
                <code>VERDACCIO_TOKEN</code> — Token autentikasi dari{' '}
                <code>npm adduser --registry=URL</code>
              </li>
            </ul>
          </InfoBox>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            5. Multi-Repo: CI/CD untuk MFE Standalone
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2 mt-12">
            <Rocket className="h-5 w-5" />
            5. Multi-Repo: CI/CD untuk MFE Standalone
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            MFE standalone di-maintain di repo terpisah oleh tim independen. Pipeline CI/CD di repo
            ini hanya perlu: install libs dari Verdaccio Server → build → deploy.
          </p>

          <DocsStep title="Pipeline: Build & Deploy MFE Standalone">
            <CodeBlock
              language="yaml"
              codeString={`name: Build & Deploy Standalone MFE

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      # Setup .npmrc — arahkan ke Verdaccio Server
      - name: Configure registry
        run: |
          echo "@synapse:registry=\${{ secrets.VERDACCIO_URL }}" >> .npmrc
          echo "//\${{ secrets.VERDACCIO_HOST }}/:_authToken=\${{ secrets.VERDACCIO_TOKEN }}" >> .npmrc
          echo "auto-install-peers=true" >> .npmrc

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build MFE
        run: pnpm run build

      # Deploy ke hosting (contoh: S3/CloudFront)
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: \${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: dist`}
            />
          </DocsStep>

          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
            Dockerfile untuk MFE Standalone
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Berbeda dari monorepo, MFE standalone tidak memerlukan Nx. Dockerfile lebih sederhana:
          </p>
          <CodeBlock
            language="dockerfile"
            codeString={`FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm

# .npmrc harus sudah berisi registry Verdaccio
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Production — Nginx
FROM nginx:alpine
RUN echo "server { \\\\
    listen 80; \\\\
    location / { \\\\
        root /usr/share/nginx/html; \\\\
        index index.html; \\\\
        try_files \\\\$uri \\\\$uri/ /index.html; \\\\
        add_header 'Access-Control-Allow-Origin' '*'; \\\\
    } \\\\
}" > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
          />

          <InfoBox variant="emerald" title="Alur Lengkap Multi-Repo" className="mt-4">
            <ol className="list-decimal list-inside space-y-1 mt-1 text-sm">
              <li>
                <strong>Monorepo CI:</strong> Merge ke main → auto-publish libs ke Verdaccio Server
              </li>
              <li>
                <strong>MFE Repo CI:</strong> Merge ke main → install libs dari Verdaccio Server →
                build → deploy
              </li>
              <li>
                <strong>Shell:</strong> Update <code>remotes.json</code> entry ke URL production MFE
                → deploy Shell
              </li>
            </ol>
          </InfoBox>

          <InfoBox variant="blue" title="Multi-Repo? Publish via Verdaccio!" className="mt-4">
            Lihat panduan detail setup registry dan access control di{' '}
            <strong>/docs/verdaccio-registry</strong>.
          </InfoBox>
        </section>
      </CardContent>
    </Card>
  );
}

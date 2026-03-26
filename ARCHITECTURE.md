# Micro-Frontend Architecture Documentation

Selamat datang di platform _Micro-Frontend_ (MFE) Synapse MFE. Proyek ini menggunakan arsitektur monorepo dengan **Nx**, **Vite**, dan **Webpack Module Federation** (_melalui `@module-federation/vite`_).

## Struktur Proyek

Monorepo ini memisahkan aplikasi (MFE) dan pustaka (_libraries_) yang bisa digunakan ulang:

### `apps/` (Micro-Frontends)

1. **`shell` (Host Application):**
   - Merupakan cangkang utama aplikasi yang berjalan di Port `4000`.
   - Mengelola _layout_ utama (Sidebar, Header), _routing_ utama, dan pemeriksaan otentikasi global.
   - Memuat aplikasi _remote_ (MFE lain) secara dinamis sesuai rute URL.
2. **`auth-mfe` (Remote Application):**
   - Bertanggung jawab penuh terhadap domain otentikasi (Halaman Login, Register, Lupa Password).
   - Berjalan mandiri (standalone) di Port `4001` untuk testing, dan diekspos ke `shell` di bawah rute `/auth/*`.
3. **`docs-mfe` (Remote Application):**
   - Modul dokumentasi interaktif yang menampilkan seluruh panduan developer.
   - Berjalan mandiri di Port `4003`.
4. **`external-mfe` (Standalone Sandbox):**
   - Contoh MFE yang dirancang untuk diekstrak ke luar monorepo sebagai demonstrasi multi-repo.
   - Berjalan mandiri di Port `4005`.

### `libs/` (Shared Libraries)

1. **`ui-kit`:** Komponen UI dasar (Button, Input, Card, Modal, dll.) berbasis React, Tailwind CSS v4, dan Radix UI.
2. **`shared-types`:** Antarmuka TypeScript, `enums`, serta state global (Zustand store untuk `useAuthStore`).
3. **`shared-api`:** Konfigurasi Axios (`apiClient`) dengan fungsi intersepsi token.
4. **`shared-components`:** Komponen dokumentasi reusable (CodeBlock, InfoBox, StepList, dll.).
5. **`shared-monitoring`:** Helper untuk integrasi Sentry dan monitoring.
6. **`mock-api`:** MSW (Mock Service Worker) handlers untuk development.

---

## Cara Menjalankan Proyek secara Lokal

Gunakan perintah `nx run-many` untuk menjalankan semua atau beberapa MFE secara paralel.

**1. Menjalankan semua aplikasi sekaligus (Bersihkan cache terlebih dahulu):**

```bash
pnpm run dev:new
```

**2. Menjalankan aplikasi tertentu:**

```bash
pnpm nx run-many --target=serve --projects=shell,auth-mfe --parallel
```

**3. Menjalankan satu aplikasi secara Standalone:**

```bash
pnpm nx serve auth-mfe
```

---

## Cara Menambahkan MFE Baru

Kami telah menyediakan **Nx Generator Kustom** agar proses pembuatan MFE baru berjalan instan.

### 1. Jalankan Generator

```bash
pnpm nx g @synapse/tools:mfe <nama-mfe> --port=<port-kosong>
```

_Contoh:_

```bash
pnpm nx g @synapse/tools:mfe reporting-mfe --port=4004
```

### 2. Apa yang Terjadi Otomatis?

Generator akan:

- Membuat aplikasi React+Vite+Module Federation+Tailwind v4 di `apps/<nama-mfe>`.
- Menginjeksi konfigurasi Module Federation ke `vite.config.ts` (termasuk `isMonorepo` auto-detect).
- Membuat `tsconfig.standalone.json` dan `standalone.env.example` untuk multi-repo support.
- Mendaftarkan remote ke `apps/shell/vite.config.ts`, `router.tsx`, dan `vite-env.d.ts` secara otomatis.
- Mengonfigurasi `zustand` dan `@synapse/shared-types` sebagai `singleton: true` di Module Federation shared.

### 3. Restart dan Jalankan

```bash
pnpm run dev:new
```

---

## Multi-Repo Separation & Verdaccio

Arsitektur ini dirancang agar setiap MFE **bisa dipisah ke repository independen** kapan saja.

### Fitur Multi-Repo yang Sudah Tersedia:

- **Shared libs publishable:** Semua 6 libs punya `publishConfig`, `exports`, `files`, dan build script (`tsup`).
- **Vite auto-detect:** `isMonorepo` flag di `vite.config.ts` otomatis switch antara local alias dan `node_modules`.
- **tsconfig.standalone.json:** Config TypeScript mandiri tanpa depend ke `../../tsconfig.base.json`.
- **Re-branding otomatis:** `pnpm run setup:brand @namakantor` mengganti seluruh scope `@synapse` sekaligus.

### Testing Multi-Repo dengan Verdaccio (Tanpa Internet!)

Verdaccio adalah NPM registry lokal yang sudah terbundel di template ini:

```bash
# Terminal 1: Start Verdaccio
pnpm run verdaccio:start

# Terminal 2: Build & publish ke registry lokal
pnpm run libs:publish:local

# Terminal 3: Jalankan MFE standalone
cd <folder-mfe-terpisah>
pnpm install && pnpm run serve
```

Lihat dokumentasi lengkap di `/docs/multi-repo`.

---

## Pengembangan Komponen di Shared UI-Kit

1. Buat komponen baru di `libs/ui-kit/src/components/`.
2. Ekspos melalui `libs/ui-kit/src/index.ts`.
3. Gunakan di MFE manapun:

```tsx
import { Datepicker } from '@synapse/ui-kit';
```

---

## Performance Budget & Bundle Analysis

### 1. Bundle Visualizer

Saat menjalankan `pnpm build`, plugin `rollup-plugin-visualizer` menghasilkan grafik interaktif di `dist/apps/<nama-mfe>/stats.html`.

### 2. Automated Budget Checks

Script `tools/bundle-budget.ts` memvalidasi ukuran bundle:

- **JS Maximum:** 250 KB (gzipped)
- **CSS Maximum:** 50 KB (gzipped)

```bash
pnpm budget:check
```

Script ini juga terintegrasi di CI/CD pipeline — build akan gagal jika melebihi batas.

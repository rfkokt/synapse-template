# Micro-Frontend Architecture Documentation

Selamat datang di platform *Micro-Frontend* (MFE) Synapse MFE. Proyek ini menggunakan arsitektur monorepo dengan **Nx**, **Vite**, dan **Webpack Module Federation** (_melalui `@module-federation/vite`_).

## 📂 Struktur Proyek

Monorepo ini memisahkan aplikasi (MFE) dan pustaka (*libraries*) yang bisa digunakan ulang:

### `apps/` (Micro-Frontends)
1. **`shell` (Host Application):**
   - Merupakan cangkang utama aplikasi yang berjalan di Port `4000`.
   - Mengelola _layout_ utama (Sidebar, Header), *routing* utama, dan pemeriksaan otentikasi global.
   - Memuat aplikasi *remote* (MFE lain) secara dinamis sesuai rute URL.
2. **`auth-mfe` (Remote Application):**
   - Bertanggung jawab penuh terhadap domain otentikasi (Halaman Login, Register, Lupa Password).
   - Berjalan mandiri (standalone) di Port `4001` untuk testing, dan diekspos ke `shell` di bawah rute `/auth/*`.
3. **`business-mfe` (Remote Application):**
   - Contoh fitur domain bisnis yang kita *generate* menggunakan CLI.
   - Berjalan mandiri di Port `4002`.

### `libs/` (Shared Libraries)
1. **`ui-kit`:**
   - Menyimpan seluruh komponen UI dasar (Button, Input, Card, Modal, dll.) berbasis **React**, **Tailwind CSS v4**, dan **Radix UI**.
   - Setiap MFE (Shell, Auth, Business) bebas mengimpor komponen dari sini sehingga desain konsisten se-platform.
2. **`shared-types`:**
   - Menyimpan antarmuka TypeScript (`interfaces`), `enums`, serta state global (seperti `Zustand` store untuk `useAuthStore`).
   - MFE dapat mendengarkan atau memperbarui status (e.g., status *login*).
3. **`shared-api`:**
   - Menyimpan konfigurasi Axios atau pemanggilan fetch (`apiClient`) untuk menghubungi *backend*, lengkap dengan fungsi intersepsi token.

---

## 🚀 Cara Menjalankan Proyek secara Lokal

Gunakan perintah `nx run-many` untuk menjalankan semua atau beberapa MFE secara paralel.

**1. Menjalankan semua aplikasi sekaligus:**
```bash
pnpm nx run-many --target=serve --all --parallel
```

**2. Menjalankan aplikasi tertentu:**
Jika Anda hanya fokus pada Shell dan Auth:
```bash
pnpm nx run-many --target=serve --projects=shell,auth-mfe --parallel
```

**3. Menjalankan satu aplikasi secara Standalone (Development):**
Anda bisa langsung masuk ke foldernya dan menjalankan skrip bawaan:
```bash
cd apps/auth-mfe
pnpm run serve
```
Atau menggunakan perintah global Nx:
```bash
pnpm nx serve auth-mfe
```

---

## 🛠️ Cara Menambahkan MFE Baru

Kami telah menyediakan **Nx Generator Kustom** agar proses pembuatan MFE baru berjalan instan (kurang dari 1 menit) tanpa perlu menyalin konfigurasi Vite dan Module Federation secara manual.

### 1. Jalankan Generator
Gunakan perintah berikut dari *root* folder:

```bash
pnpm nx g @synapse/tools:mfe <nama-mfe> --port=<port-kosong>
```
*Contoh:*
```bash
pnpm nx g @synapse/tools:mfe docs-mfe --port=4003
```

### 2. Apa yang Terjadi di Latar Belakang?
Generator akan secara otomatis:
- Membuat aplikasi React berbasis Vite di folder `apps/docs-mfe` (berdasarkan contoh di atas).
- Menginjeksi konfigurasi `@module-federation/vite` ke dalam `vite.config.ts`.
- Mengonfigurasi referensi impor untuk `Tailwind CSS v4`.
- Membuat `package.json` ber-tipe `module` agar sinkron dengan Vite build.
- Menambahkan dependensi internal MFE beserta dependensi *React Router* dan dependensi `@synapse/ui-kit` juga `@synapse/shared-types`.
- **Mendaftarkan Rute ke Shell:** Menambahkan konfigurasi remote MFE Anda ke `apps/shell/vite.config.ts` dan meregistrasikan deklarasi TypeScript ke file definisi `vite-env.d.ts` Shell *secara otomatis*.

### 3. Tambahkan Route di Shell (Manual Step)
Walaupun manifestnya sudah otomatis diregister, Anda perlu menambahkan komponen *Lazy* tersebut ke dalam *router* Shell agar modul bisa dipanggil jika URL tertentu diakses:

Buka `apps/shell/src/router.tsx`, lalu tambahkan referensi komponen Anda:

```tsx
// 1. Tambahkan Impor Lazy untuk MFE baru dengan path '/App'
const RemoteDocs = lazy(() => import('docsmfe/App'));

// 2. Tambahkan Route baru di dalam <Layout />
<Route 
  path="docs/*" 
  element={
    <RemoteLoader>
      <RemoteDocs />
    </RemoteLoader>
  } 
/>
```

### 4. Jalankan MFE Baru
Setelah selesai, jalankan terminal MFE secara Standalone untuk mencoba:
```bash
pnpm nx serve docs-mfe
```
Lalu pastikan komponen sudah dirender dengan baik tanpa *error*.

---

## 🎨 Pengembangan Komponen di Shared UI-Kit

Apabila Anda butuh membuat komponen baru yang bisa dipakai MFE lain (Misal: `Datepicker`):

1. Buat folder dan komponen baru di dalam direktori `libs/ui-kit/src/components/`, misalnya `Datepicker.tsx`.
2. Ekspos (*export*) komponen tersebut melalui file utama UI Kit: `libs/ui-kit/src/index.ts`.
3. Gunakan langsung di MFE manapun:
```tsx
import { Datepicker } from '@synapse/ui-kit';

export function MyFeature() {
  return <Datepicker />;
}
```

**Catatan Tailwind:** Karena kita menggunakan Tailwind CSS v4, seluruh konfigurasi kelas utilitas UI sudah ditarik secara global *(hoisted)* melalui file CSS masing-masing MFE yang mengimpor `theme.css` bawaan `ui-kit`. Anda hanya tinggal menambahkan kelas nama utility standar di komponen MFE Anda, ia akan otomatis menyesuaikan desain sistem monorepo (seperti warna primer, radius, *shadow* dll).

---

## 📊 Performance Budget & Bundle Analysis

Agar ukuran bundel setiap Micro-Frontend tetap ringan dan performanya tinggi, kami menerapkan mekanisme **Performance Budget** di *build pipeline*.

### 1. Bundle Visualizer
Saat menjalankan `pnpm build`, *plugin* `rollup-plugin-visualizer` secara otomatis membuat file laporan visual bernama `stats.html` di dalam folder `dist/apps/<nama-mfe>/`. Anda dapat membuka file HTML tersebut di *browser* untuk menganalisis ukuran setiap *library* atau berkas yang di-_bundle_.

### 2. Automated Budget Checks
Kami telah menyediakan skrip automasi `tools/bundle-budget.ts`. Skrip ini akan melakukan kalkulasi ukuran terkompresi (brotli) dari semua *file* Javascript dan CSS yang dihasilkan di dalam folder `dist`.

Skrip memvalidasi bahwa setiap bundel MFE berada di bawah ambang batas (*threshold*) yang ditentukan, yakni:
- **JS Maximum:** 250 KB
- **CSS Maximum:** 50 KB

Untuk memverifikasinya secara manual:
```bash
pnpm budget:check
```
*Script* ini juga diintegrasikan secara otomatis ke dalam **CI/CD Pipeline**. Jika bundel aplikasi MFE Anda melebihi batas performa, proses *build deployment* akan digagalkan hingga dilakukan optimasi kode/pemangkasan dependensi berlebihan.

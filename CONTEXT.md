# Synapse MFE Template — Agent Context

> **Tujuan file ini:** Memberikan konteks cepat agar agent AI (atau developer baru) bisa langsung paham arsitektur, lokasi file penting, dan status pekerjaan terakhir.

---

## Arsitektur

**Micro-Frontend (MFE)** berbasis **Vite + Module Federation** dengan model hybrid:

- **Monorepo** (pnpm workspace) untuk development cepat
- **Multi-repo** (standalone) untuk autonomi tim — shared libs via **Verdaccio** (local NPM registry)

```
synapse-template/
├── apps/
│   ├── shell/              # Host/container (port 4000)
│   ├── auth-mfe/           # Login & auth (port 4001)
│   ├── docs-mfe/           # Documentation (port 4002)
│   └── sandbox-mfe/        # Sandbox testing (port 4003)
├── libs/                   # 6 shared libraries
│   ├── ui-kit/             # Shadcn UI components (@synapse/ui-kit)
│   ├── shared-types/       # TS types, Zustand stores, events, i18n (@synapse/shared-types)
│   ├── shared-api/         # Axios client + interceptors (@synapse/shared-api)
│   ├── shared-components/  # Docs components: CodeBlock, InfoBox, StepList (@synapse/shared-components)
│   ├── shared-monitoring/  # Sentry integration (@synapse/shared-monitoring)
│   └── mock-api/           # MSW handlers (@synapse/mock-api)
├── tools/
│   ├── src/generators/mfe/ # MFE generator (pnpm generate:mfe)
│   └── verdaccio/          # Verdaccio config + storage
└── package.json            # Root scripts
```

## File Penting yang Wajib Dibaca

| Konteks                        | File                                                     |
| ------------------------------ | -------------------------------------------------------- |
| Routing Shell & registrasi MFE | `apps/shell/public/remotes.json`                         |
| Module Federation config       | `apps/*/rsbuild.config.ts`                               |
| MFE Generator                  | `tools/src/generators/mfe/generator.ts`                  |
| Origin whitelist (403 guard)   | `libs/shared-types/src/origin.ts`                        |
| SharedOriginGuard component    | `libs/shared-types/src/components/SharedOriginGuard.tsx` |
| Verdaccio config               | `tools/verdaccio/config.yaml`                            |
| Docs routing & section map     | `apps/docs-mfe/src/App.tsx`                              |
| Architecture overview          | `ARCHITECTURE.md`                                        |

## Key Scripts (package.json)

| Command                       | Fungsi                                 |
| ----------------------------- | -------------------------------------- |
| `pnpm run dev:new`            | Start Shell + semua MFE                |
| `pnpm run verdaccio:start`    | Start Verdaccio (port 4873)            |
| `pnpm run libs:build`         | Build semua 6 shared libs              |
| `pnpm run libs:publish:local` | Build + publish ke Verdaccio lokal     |
| `pnpm run libs:publish`       | Build + publish ke registry production |
| `pnpm generate:mfe`           | Generate MFE baru                      |
| `pnpm add:ui <component>`     | Tambah Shadcn component ke ui-kit      |
| `pnpm remove:ui <component>`  | Hapus Shadcn component dari ui-kit     |

## Shared Libs — Singleton Rules

Library berikut **WAJIB** di-shared sebagai singleton di Module Federation:

- `zustand` — global auth/theme/menu state
- `@synapse/shared-types` — stores, events, i18n
- `react`, `react-dom` — single React instance

## 403 Forbidden: MFE Access Denied

Jika MFE menampilkan halaman 403:

- **Penyebab:** `SharedOriginGuard` menolak origin yang tidak di-whitelist
- **Default whitelist:** `http://localhost:4000`
- **Konfigurasi:**
  - `libs/shared-types/src/origin.ts` — default origins
  - `.env` MFE: `VITE_SHELL_URL=http://localhost:4000`
  - `.env` MFE: `VITE_ALLOWED_ORIGINS=http://localhost:4001,http://localhost:4002`

## Verdaccio Workflow (Multi-Repo)

```
Monorepo → pnpm run libs:publish:local → Verdaccio (:4873) ← pnpm install ← MFE Standalone
```

MFE standalone butuh `.npmrc`:

```
@synapse:registry=http://localhost:4873/
//localhost:4873/:_authToken="anonymous"
```

## Dokumentasi (apps/docs-mfe)

24 halaman docs di `apps/docs-mfe/src/pages/`. Routing ada di `App.tsx` object `DOCS_SECTION_MAP`.

Halaman yang baru ditambah/diubah:

- `DocsVerdaccioSection.tsx` — Panduan Verdaccio lengkap (termasuk deploy ke server & troubleshooting)
- `DocsMembuatMfeSection.tsx` — Tambah MFE baru (monorepo & multi-repo)
- `DocsSharedUiKitSection.tsx` — UI Kit + share ke standalone via Verdaccio
- `DocsSecuritySection.tsx` — Security + 403 troubleshooting

7 halaman docs sudah ditambahi **InfoBox "Multi-Repo? Publish via Verdaccio!"** yang merujuk ke `/docs/verdaccio-registry`.

## Status Pekerjaan Terakhir

### ✅ Selesai

- Verdaccio infrastructure (config, scripts, .gitignore)
- MFE generator includes zustand singleton
- DocsVerdaccioSection (Quick Start, Architecture, Update Workflow, Deploy ke Server, Troubleshooting)
- Verdaccio cross-reference InfoBox di 8 docs pages
- DocsSharedUiKitSection — share komponen ke standalone
- DocsSecuritySection — 403 troubleshooting card
- DocsMembuatMfeSection — multi-repo add/remove guide

### ⚠️ Belum Di-commit

Semua perubahan masih local, belum di-push.

### 📋 Sisa / Follow-up

- End-to-end test multi-repo extraction flow
- Verifikasi semua docs pages render tanpa error di browser

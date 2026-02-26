# create-synapse-mfe 🚀

A lightning-fast, zero-dependency CLI scaffolding tool for bootstrapping a modern, scalable **Micro-Frontend (MFE)** architecture using **Vite**, **React**, and **Module Federation**.

## 🌟 Features

- **Zero Dependencies**: Built with native Node.js (`child_process`, `fs`) for instant execution.
- **Vite & Module Federation**: Pre-configured for high-performance React applications.
- **Enterprise Ready**: Includes a Host (Shell) app, Remote apps, and shared libraries out of the box.
- **Nx Monorepo Style**: Organized for scalable development.

## 📦 Usage

You do not need to install this package globally. Simply run it directly using `npx`:

```bash
npx create-synapse-mfe@latest
```

The CLI will interactively ask for your project name (default: `synapse-workspace`).

### Example

```bash
npx create-synapse-mfe@latest my-awesome-mfe
```

## 🛠️ Next Steps After Scaffolding

Once your project is generated, follow these simple steps to spin up the entire Micro-Frontend ecosystem:

```bash
# 1. Navigate into your new project
cd my-awesome-mfe

# 2. Install dependencies (pnpm is highly recommended)
pnpm install

# 3. Start the entire MFE network (Shell + Remotes) in parallel
pnpm run dev:new
```

## 🔐 Default Mock Credentials (Development)

Saat `MSW` aktif di mode development, gunakan akun berikut untuk login cepat:

- `auth-mfe` (`/auth/login`)
  - `admin@Synapse.com` / `password123`
  - `user@Synapse.com` / `password123`
- Standalone MFE generated (isolated port, mis. `:4003`)
  - `dev@synapse.local` / `password123`

Catatan:

- `auth-mfe` menampilkan kredensial mock otomatis di bawah form login (dev + MSW).
- Dokumentasi detail tersedia di `/docs/api-mocking`, `/docs/api-interceptors`, dan `/docs/security`.

## 🏗️ Architecture Blueprint

The generated workspace pulls from a clean-slate boilerplate that includes:

- `apps/shell`: The main host application router.
- `apps/auth-mfe`: A remote micro-frontend handling authentication.
- `apps/docs-mfe`: A remote documentation micro-frontend.
- `libs/`: Shared libraries holding UI components, types, and API logic.

## 📄 License

MIT

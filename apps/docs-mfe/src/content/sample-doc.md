# Menulis Dokumentasi dengan Markdown

Panduan ini menunjukkan cara menulis dokumentasi baru dalam format **Markdown** untuk platform Synapse MFE.

## Keuntungan Markdown

- **Mudah ditulis** — tidak perlu menulis JSX/TSX
- **Mudah dibaca** — format plain text yang familiar
- **Version control friendly** — diff yang bersih di Git
- **Portable** — bisa di-render di GitHub, VS Code, dll.

## Cara Membuat Dokumentasi Baru

### 1. Buat File Markdown

Buat file `.md` di folder `apps/docs-mfe/src/content/`:

```
apps/docs-mfe/src/content/
├── sample-doc.md
└── my-new-doc.md     ← file baru Anda
```

### 2. Import dengan Vite Raw

Di file section TSX, import file markdown menggunakan `?raw` suffix:

```tsx
import content from '../content/my-new-doc.md?raw';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export function MyNewDocSection() {
  return <MarkdownRenderer content={content} />;
}
```

### 3. Register di Section Map

Tambahkan section baru di `App.tsx`:

```tsx
'my-new-doc': {
  component: MyNewDocSection,
  title: '19. Judul Dokumen Baru',
  category: '📚 Panduan Lanjutan',
},
```

## Fitur yang Didukung

| Fitur                          | Status       |
| ------------------------------ | ------------ |
| Headings (h1-h6)               | ✅ Supported |
| Bold / Italic                  | ✅ Supported |
| Links                          | ✅ Supported |
| Code blocks + syntax highlight | ✅ Supported |
| GFM Tables                     | ✅ Supported |
| Task lists                     | ✅ Supported |
| Blockquotes                    | ✅ Supported |
| Images                         | ✅ Supported |
| Strikethrough                  | ✅ Supported |

## Contoh Sintaks

### Code Block

```typescript
import { apiClient } from '@synapse/shared-api';

const response = await apiClient.get('/api/v1/users');
console.log(response.data);
```

### Blockquote

> **Catatan:** Markdown renderer otomatis menerapkan styling yang konsisten
> dengan design system Synapse MFE.

### Task List

- [x] Install dependencies
- [x] Buat file .md
- [ ] Register di section map
- [ ] Test di browser

---

Selamat menulis dokumentasi! 🎉

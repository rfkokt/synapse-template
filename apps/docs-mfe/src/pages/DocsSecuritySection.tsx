import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';
export function DocsSecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 text-sm font-bold">
            13
          </span>
          Security Best Practices
        </CardTitle>
        <CardDescription>Standar keamanan wajib untuk semua MFE</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">✅ WAJIB</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Access token HANYA di memory (Zustand)</li>
              <li>Gunakan HttpOnly refresh cookie dari backend (bukan JS-readable cookie)</li>
              <li>
                Gunakan{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  apiClient
                </code>{' '}
                dari shared-api
              </li>
              <li>
                Validasi semua query{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  redirect
                </code>{' '}
                dengan helper{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  getSafeRedirectTarget()
                </code>
              </li>
              <li>Form validasi pakai schema (Yup/Zod)</li>
              <li>
                Internal packages pakai scope{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  @synapse/
                </code>
              </li>
              <li>
                Jalankan{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  pnpm audit
                </code>{' '}
                — 0 High/Critical
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ DILARANG</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Simpan access token di localStorage/sessionStorage/non-HttpOnly cookie</li>
              <li>Buat Axios instance sendiri</li>
              <li>
                Gunakan{' '}
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  dangerouslySetInnerHTML
                </code>
              </li>
              <li>Kirim token/session lewat query params (contoh: ?standaloneAuth=...)</li>
              <li>Hardcode URL remote di config</li>
              <li>Redirect tanpa validasi allowlist</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            🛡️ Mencegah Akses MFE dari Domain Sembarangan
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Karena MFE berupa file JavaScript statis (<code>remoteEntry.js</code>), kita harus
            melindungi aset ini di level infrastruktur/server (seperti Cloudflare, Nginx, atau S3)
            menggunakan dua lapis pertahanan utama:
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                1. Batasi CORS (Cross-Origin Resource Sharing)
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Pastikan server yang meng-host MFE (misalnya <code>auth.Synapse.com</code>) hanya
                memberikan header{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  Access-Control-Allow-Origin
                </code>{' '}
                ke domain-domain yang kita izinkan (misalnya <code>Synapse.com</code>).
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                    ❌ JANGAN PERNAH gunakan wildcard:{' '}
                    <code className="font-mono">Access-Control-Allow-Origin: *</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                2. Implementasi CSP (Content Security Policy) di Shell
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Untuk mencegah injeksi Script berbahaya (XSS) via MFE palsu, pastikan Shell kita
                membatasi dari mana saja eksekusi script <em>(script-src)</em> diperbolehkan:
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <CodeBlock
                  language="http"
                  codeString={`Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://auth.Synapse.com https://docs.Synapse.com;`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                3. Validasi Origin di Level Kode MFE (Client-Side)
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Selain pembatasan server, MFE juga bisa melindungi dirinya sendiri lewat kode
                JavaScript. Komponen utama MFE mengecek lokasi (URL) host tempat ia dieksekusi
                sebelum melakukan perenderan data sensitif menggunakan{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  &lt;SharedOriginGuard /&gt;
                </code>
                .
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent mt-2">
                Origin diizinkan (<em>allowlist</em>) diambil{' '}
                <strong>secara otomatis dan dinamis</strong> melalui registri{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  apps/shell/public/remotes.json
                </code>
                , serta variabel{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  VITE_SHELL_URL
                </code>{' '}
                dan{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  VITE_ALLOWED_ORIGINS
                </code>{' '}
                (opsional, comma-separated) untuk environment production. Dengan begitu, kita cukup
                mendaftarkan URL MFE di satu tempat (shell) tanpa harus mengulangi deklarasinya di
                tiap aplikasi MFE anak.
              </p>
              <div className="pl-3 border-l-2 border-transparent mt-4">
                <CodeBlock
                  language="tsx"
                  codeString={`// Di dalam komponen App MFE (misal: auth-mfe/src/App.tsx)
import { SharedOriginGuard } from '@synapse/shared-types';

export function App() {
  return (
    {/* Guard akan otomatis mengecek window.location.origin dengan daftar remotes.json Shell */}
    <SharedOriginGuard>
       <div>MFE Berhasil Dimuat Valid!</div>
    </SharedOriginGuard>
  );
}`}
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                    💡 Standalone Mode & Local Isolated Login
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 mb-2">
                    Saat mode Standalone (Developer membuka port anak MFE langsung misalnya{' '}
                    <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                      localhost:4003
                    </code>
                    ), <code>StandaloneAuthGuard</code> secara spesifik di{' '}
                    <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">main.tsx</code>{' '}
                    akan merender layar Login Lokal terisolasi jika Anda tidak memiliki{' '}
                    <em>session</em>.
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Demi keamanan tingkat tinggi dan karena penghapusan metode SSO query params,{' '}
                    <code>StandaloneAuthGuard</code> tidak lagi mengizinkan *bypass* rahasia lintas
                    port. Developer diwajibkan login manual dengan username/password di layar port
                    MFE tersebut (mock auth explicit) agar sesi tetap terlindungi pada{' '}
                    <em>origin</em> yang sama, tanpa perlu melempar (redirect) <em>traffic</em>{' '}
                    secara tidak beralasan ke <em>Shell</em> secara bolak-balik.
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                    Contoh kredensial dev standalone:
                    <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded ml-1">
                      dev@synapse.local
                    </code>{' '}
                    /{' '}
                    <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                      password123
                    </code>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm border-l-2 border-primary-500 pl-3 text-neutral-800 dark:text-neutral-200">
                4. Redirect Validation (Open Redirect Mitigation)
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pl-3 border-l-2 border-transparent">
                Jangan pernah langsung mengeksekusi{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  window.location
                </code>{' '}
                dari query param mentah. Gunakan helper whitelist dari{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                  @synapse/shared-types
                </code>
                .
              </p>
              <div className="pl-3 border-l-2 border-transparent">
                <CodeBlock
                  language="tsx"
                  codeString={`import { getSafeRedirectTarget } from '@synapse/shared-types';

const raw = new URLSearchParams(window.location.search).get('redirect');
const safeTarget = getSafeRedirectTarget(raw);

if (safeTarget) {
  window.location.assign(safeTarget);
}`}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsTokenAuthSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400 text-sm font-bold">
            5
          </span>
          Token & Auth Management
        </CardTitle>
        <CardDescription>
          HttpOnly session cookie flow tanpa penyimpanan token di frontend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          Status login dan profil user dikelola tunggal via Zustand Store di{' '}
          <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
            @synapse/shared-types
          </code>
          .
        </p>
        <CodeBlock
          language="typescript"
          codeString={`import { useAuthStore } from '@synapse/shared-types';

// Di dalam React Component
const { user, isAuthenticated } = useAuthStore();`}
        />
        <p>
          <strong>Auth Flow Lengkap:</strong>
        </p>
        <ol className="list-decimal ml-4 space-y-1 text-sm">
          <li>
            User isi form login di <strong>auth-mfe</strong>
          </li>
          <li>
            POST{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              /api/v1/auth/login
            </code>{' '}
            → server set HttpOnly session cookie
          </li>
          <li>
            Server response:{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{`{ user }`}</code>
          </li>
          <li>
            auth-mfe update shared auth state + dispatch event integrasi{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              USER_LOGGED_IN
            </code>
          </li>
          <li>Shell sinkronisasi user ke Zustand (memory only, non-persistent)</li>
          <li>Session invalid? Interceptor mencoba refresh session via HttpOnly cookie</li>
          <li>
            Standalone mode tidak menerima token dari query param; login lokal dilakukan explicit di
            origin MFE.
          </li>
          <li>
            Logout: Shell clear Zustand + POST{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              /api/v1/auth/logout
            </code>
          </li>
        </ol>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400">
            Frontend tidak menyimpan access token di localStorage/sessionStorage/cookie.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            ℹ️ Catatan: “full” HttpOnly flow tetap membutuhkan backend endpoint refresh/profile yang
            konsisten.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

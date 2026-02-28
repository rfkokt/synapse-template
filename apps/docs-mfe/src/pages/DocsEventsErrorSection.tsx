import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsEventsErrorSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-400 text-sm font-bold">
              10a
            </span>
            Custom Event Contract
          </CardTitle>
          <CardDescription>Komunikasi antar MFE via Browser Events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Untuk source of truth state sinkron (session/user), prioritaskan store dari{' '}
            <code>@synapse/shared-types</code>. Browser Events tetap dipakai sebagai kontrak
            integrasi host-remote untuk sinyal auth (login/logout/refresh) dan event lintas app yang
            one-off.
          </p>
          <CodeBlock
            language="typescript"
            codeString={`// source of truth: shared store
useAuthStore.getState().setAuth(user);

// integration signal: host-remote contract
dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, {
  userId: user.id,
  user,
});`}
          />
          <p>
            <strong>Core Integration Events (aktif):</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.USER_LOGGED_IN
              </code>
            </li>
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.USER_LOGGED_OUT
              </code>
            </li>
            <li>
              <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
                AUTH.TOKEN_REFRESHED
              </code>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 text-sm font-bold">
              10b
            </span>
            Error Boundary & Resilience
          </CardTitle>
          <CardDescription>Jika MFE crash, Shell tetap jalan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Setiap remote import wajib dibungkus{' '}
            <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
              RemoteLoader
            </code>{' '}
            (Suspense + ErrorBoundary wrapper).
          </p>
          <CodeBlock
            language="tsx"
            codeString={`<RemoteLoader>
  <AuthApp />
</RemoteLoader>`}
          />
          <p>
            <strong>Fallback UI:</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>Loading:</strong> Skeleton shimmer (Suspense)
            </li>
            <li>
              <strong>Crash:</strong> Card error + tombol Retry
            </li>
            <li>
              <strong>Timeout:</strong> Pesan offline + Refresh
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

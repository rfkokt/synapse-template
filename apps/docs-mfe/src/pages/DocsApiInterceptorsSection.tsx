import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '@synapse/shared-components';

export function DocsApiInterceptorsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 text-sm font-bold">
            6
          </span>
          API Client & Interceptors
        </CardTitle>
        <CardDescription>Session cookie flow & error handling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          Wajib gunakan{' '}
          <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
            apiClient
          </code>{' '}
          dari{' '}
          <code className="text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-1 rounded">
            @synapse/shared-api
          </code>
          . Jangan buat Axios sendiri!
        </p>
        <CodeBlock
          language="typescript"
          codeString={`import { apiClient } from '@synapse/shared-api';

// Cookie session terkirim otomatis (withCredentials: true)
const res = await apiClient.get('/api/v1/user/profile');`}
        />
        <p>
          <strong>Jika session expired?</strong> Interceptor otomatis mencoba{' '}
          <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
            /api/v1/auth/refresh
          </code>{' '}
          lalu me-replay request yang gagal.
        </p>
        <ul className="list-disc ml-4 space-y-1">
          <li>
            Client default{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">
              withCredentials: true
            </code>{' '}
            untuk mendukung HttpOnly refresh cookie.
          </li>
          <li>Refresh request tidak di-retry berulang (anti refresh-loop) saat tetap 401.</li>
          <li>
            Untuk mode MSW lokal, base URL API direkomendasikan same-origin (
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">/</code>) agar
            request credentials tidak kena CORS lintas port.
          </li>
        </ul>

        <p>
          <strong>Error Format Standar:</strong>
        </p>
        <CodeBlock
          language="typescript"
          codeString={`interface AppError {
  code: string;        // 'AUTH_INVALID_CREDENTIALS'
  message: string;     // Human-readable
  statusCode: number;  // HTTP status
  details?: unknown;   // Validation errors
}

try {
  await apiClient.post('/api/v1/auth/login', data);
} catch (error) {
  const appError = error as AppError;
  toast.error(appError.message);
}`}
        />
      </CardContent>
    </Card>
  );
}

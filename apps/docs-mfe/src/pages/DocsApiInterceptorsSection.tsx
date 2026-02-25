import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';

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
        <CardDescription>Auto-inject token & error handling</CardDescription>
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

// Token otomatis disisipkan!
const res = await apiClient.get('/api/users/me');`}
        />
        <p>
          <strong>Jika Token expired?</strong> Interceptor otomatis: hit /refresh → simpan token
          baru → replay request gagal.
        </p>

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
  await apiClient.post('/api/login', data);
} catch (error) {
  const appError = error as AppError;
  toast.error(appError.message);
}`}
        />
      </CardContent>
    </Card>
  );
}

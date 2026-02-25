import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock } from '../components/CodeBlock';

export function DocsGitPerfSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-sm font-bold">
              12a
            </span>
            Git Workflow
          </CardTitle>
          <CardDescription>Commit convention & branch naming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <CodeBlock
            language="bash"
            codeString={`# Commit Convention
feat(auth-mfe): add forgot password flow
fix(shell): resolve token refresh race condition
chore(ui-kit): update Button component variants

# Branch Naming
feat/AUTH-123-forgot-password
fix/SHELL-456-token-race-condition`}
          />
          <p>
            Format:{' '}
            <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{`{type}/{TICKET-ID}-{short-description}`}</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-400 text-sm font-bold">
              12b
            </span>
            Performance Budget
          </CardTitle>
          <CardDescription>Batas ukuran JS/CSS per MFE</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>Max JS:</strong> 250 KB (Brotli)
            </li>
            <li>
              <strong>Max CSS:</strong> 50 KB (Brotli)
            </li>
          </ul>
          <CodeBlock
            language="bash"
            codeString={`# Check bundle size
pnpm budget:check

# Lihat stats.html
open dist/apps/*/stats.html`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

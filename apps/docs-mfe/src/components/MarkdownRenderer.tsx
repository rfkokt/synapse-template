import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

/**
 * Markdown renderer that outputs properly styled documentation.
 * Uses react-markdown with GFM support and CodeBlock for fenced code blocks.
 *
 * Usage:
 *   <MarkdownRenderer content={markdownString} />
 *
 * Or with Vite raw import:
 *   import content from './content/my-doc.md?raw';
 *   <MarkdownRenderer content={content} />
 */

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 mt-8 pb-2 border-b border-neutral-100 dark:border-neutral-800"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 mt-6"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="list-disc list-inside space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-4 ml-1"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-inside space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-4 ml-1"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, className, ...props }) => {
    const codeString = String(children ?? '').replace(/\n$/, '');
    const isBlock = Boolean(className) || codeString.includes('\n');
    if (!isBlock) {
      return (
        <code
          className="text-xs bg-neutral-100 dark:bg-neutral-800 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    const match = /language-([a-z0-9-]+)/i.exec(className ?? '');
    const language = match?.[1] ?? 'text';
    return <CodeBlock language={language} codeString={codeString} />;
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 pl-4 py-3 pr-4 rounded-r-lg mb-4 text-sm text-neutral-700 dark:text-neutral-300"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table
        className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-neutral-50 dark:bg-neutral-800" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-neutral-100 dark:border-neutral-800 last:border-0" {...props}>
      {children}
    </tr>
  ),
  hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-700" />,
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-neutral-900 dark:text-neutral-100" {...props}>
      {children}
    </strong>
  ),
  img: ({ src, alt, ...props }) => (
    <img src={src} alt={alt || ''} className="rounded-lg shadow-md max-w-full mb-4" {...props} />
  ),
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="docs-markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

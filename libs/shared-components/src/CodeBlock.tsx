import { useState, ReactNode } from 'react';
import { Button } from '@synapse/ui-kit';

import { CodeBlockTable } from './CodeBlockTable';

interface CodeBlockProps {
  codeString?: string;
  language?: string;
  children?: ReactNode;
}

/** Simple syntax highlighter — tokenizes TSX/JS code into colored spans */
export function highlightCode(code: string): ReactNode[] {
  const patterns: [RegExp, string][] = [
    [/\/\/.*$/gm, 'text-neutral-500 italic'],
    [/`[^`]*`/g, 'text-[#a5d6ff]'],
    [/"(?:[^"\\]|\\.)*"/g, 'text-[#a5d6ff]'],
    [/'(?:[^'\\]|\\.)*'/g, 'text-[#a5d6ff]'],
    [/<\/?[A-Z][A-Za-z0-9.]*/g, 'text-[#7ee787]'],
    [/<\/?[a-z][a-z0-9-]*/g, 'text-[#7ee787]'],
    [/\/>/g, 'text-[#7ee787]'],
    [
      /\b(import|export|from|const|let|var|function|return|if|else|new|typeof|type|interface|extends|implements|class|default|async|await|throw|try|catch|finally|for|while|do|switch|case|break|continue|void|null|undefined|true|false|as)\b/g,
      'text-[#ff7b72]',
    ],
    [
      /\b(React|useState|useEffect|useRef|useMemo|useCallback|ReactNode|FC|JSX|Record|Partial|Pick|Omit|Promise)\b/g,
      'text-[#d2a8ff]',
    ],
    [/\b([a-zA-Z-]+)(?==)/g, 'text-[#79c0ff]'],
    [/\b\d+\.?\d*\b/g, 'text-[#ffa657]'],
    [/=>/g, 'text-[#ff7b72]'],
  ];

  type Token = { start: number; end: number; className: string };
  const tokens: Token[] = [];

  for (const [regex, className] of patterns) {
    const r = new RegExp(regex.source, regex.flags);
    let match;
    while ((match = r.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = tokens.some((t) => start < t.end && end > t.start);
      if (!overlaps) {
        tokens.push({ start, end, className });
      }
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  const nodes: ReactNode[] = [];
  let cursor = 0;
  tokens.forEach((tok, i) => {
    if (tok.start > cursor) {
      nodes.push(<span key={`t-${i}`}>{code.slice(cursor, tok.start)}</span>);
    }
    nodes.push(
      <span key={`h-${i}`} className={tok.className}>
        {code.slice(tok.start, tok.end)}
      </span>
    );
    cursor = tok.end;
  });
  if (cursor < code.length) {
    nodes.push(<span key="rest">{code.slice(cursor)}</span>);
  }
  return nodes;
}

export function CodeBlock({ codeString, language = 'bash', children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const finalCodeString = codeString || (typeof children === 'string' ? children : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalCodeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-neutral-800 shadow-lg my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-neutral-800">
        <div className="flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          {language && (
            <span className="ml-3 text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
              {language}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleCopy}
          className="text-xs text-neutral-500 hover:text-white transition-colors h-7 px-2 py-1 rounded hover:bg-neutral-800 font-normal bg-transparent"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
      <div className="overflow-x-auto">
        {finalCodeString ? (
          <CodeBlockTable codeString={finalCodeString} />
        ) : (
          <div className="p-4 text-[13px] font-mono leading-relaxed text-[#c9d1d9]">{children}</div>
        )}
      </div>
    </div>
  );
}

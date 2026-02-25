import { highlightCode } from './CodeBlock';

interface CodeBlockTableProps {
  /**
   * String of code to be displayed in the table.
   * If provided, it will be automatically highlighted and split into lines.
   */
  codeString?: string;
  /**
   * Pre-split array of code lines. Use this if you already have the lines broken down.
   */
  lines?: string[];
  /**
   * Additional class names for the table wrapper.
   */
  className?: string;
}

/**
 * A reusable table component specifically for displaying code blocks with line numbers
 * and syntax highlighting.
 */
export function CodeBlockTable({ codeString, lines, className = '' }: CodeBlockTableProps) {
  // Use provided lines, or auto-split the codeString if provided
  const finalLines = lines || (codeString ? codeString.split('\n') : []);

  if (finalLines.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <tbody>
          {finalLines.map((line, i) => (
            <tr key={i} className="hover:bg-[#161b22]">
              <td className="select-none text-right pr-4 pl-4 py-0 text-[13px] font-mono text-neutral-600 w-[1%] whitespace-nowrap align-top leading-relaxed tracking-wide">
                {i + 1}
              </td>
              <td className="pr-4 py-0 text-[13px] font-mono text-[#c9d1d9] whitespace-pre leading-relaxed tracking-wide">
                {highlightCode(line)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

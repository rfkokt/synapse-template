import { useState, useMemo, type ReactNode } from 'react';
import {
  LuArrowUpDown as ArrowUpDown,
  LuArrowUp as ArrowUp,
  LuArrowDown as ArrowDown,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuSearch as Search,
} from 'react-icons/lu';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Data Table Component
   Sortable columns, search, built-in pagination
   ───────────────────────────────────────────── */

export interface Column<T> {
  /** Unique key for this column */
  key: string;
  /** Header label */
  header: string;
  /** Custom render function; falls back to `row[key]` */
  render?: (row: T, index: number) => ReactNode;
  /** Enable sorting for this column (default false) */
  sortable?: boolean;
  /** Column width class (Tailwind), e.g. "w-40" */
  width?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Row data */
  data: T[];
  /** Unique key extractor for each row */
  rowKey: (row: T, index: number) => string | number;
  /** Enable pagination (default true) */
  paginated?: boolean;
  /** Page size options */
  pageSizes?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** Empty state message */
  emptyMessage?: string;
  /** Optional className for the wrapper */
  className?: string;
  /** Table title shown in toolbar */
  title?: string;
  /** Show search input in toolbar */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Searchable keys (which fields to search through) */
  searchKeys?: string[];
  /** Toolbar right-side actions (e.g. "Add" button) */
  toolbarActions?: ReactNode;
  /** Show row numbers (1., 2., etc.) */
  showRowNumbers?: boolean;
}

type SortDir = 'asc' | 'desc';

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  pageSizes = [10, 20, 50],
  defaultPageSize = 10,
  emptyMessage = 'Tidak ada data.',
  className = '',
  title,
  searchable = false,
  searchPlaceholder = 'Cari...',
  searchKeys,
  toolbarActions,
  showRowNumbers = false,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState('');

  // ── Search filtering ──
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    const keys = searchKeys || columns.map((c) => c.key);
    return data.filter((row) =>
      keys.some((key) => {
        const val = (row as Record<string, unknown>)[key];
        return val != null && String(val).toLowerCase().includes(query);
      })
    );
  }, [data, search, searchKeys, columns]);

  // ── Sorting ──
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = Number(aVal) - Number(bVal);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [filteredData, sortKey, sortDir, columns]);

  // ── Pagination ──
  const totalPages = paginated ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages - 1);
  const pagedData = paginated
    ? sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : sortedData;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handlePageSize = (size: number) => {
    setPageSize(size);
    setPage(0);
  };

  // ── Sort Icon ──
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
    );
  };

  // ── Page number generation with ellipsis ──
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push('...');
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const showToolbar = title || searchable || toolbarActions;

  return (
    <div
      className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm ${className}`}
    >
      {/* ── Toolbar ── */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4">
          {title && (
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder={searchPlaceholder}
                  className="pl-9 pr-4 py-2 w-[220px] rounded-lg bg-neutral-100 dark:bg-neutral-800 border-0 text-sm text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
              </div>
            )}
            {toolbarActions}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              {showRowNumbers && (
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-left w-12">
                  No.
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 ${col.width || ''} ${alignClass[col.align || 'left']} ${
                    col.sortable
                      ? 'cursor-pointer select-none hover:text-neutral-900 dark:hover:text-white transition-colors'
                      : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                  className="px-4 py-16 text-center text-neutral-400 dark:text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  {showRowNumbers && (
                    <td className="px-4 py-3.5 text-neutral-400 text-sm">
                      {currentPage * pageSize + idx + 1}.
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-neutral-700 dark:text-neutral-300 ${alignClass[col.align || 'left']}`}
                    >
                      {col.render
                        ? col.render(row, currentPage * pageSize + idx)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      {paginated && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-800 text-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <span>Menampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSize(Number(e.target.value))}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>dari {sortedData.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-8 w-8 px-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers with ellipsis */}
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span
                  key={`dots-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-neutral-400 text-xs"
                >
                  ···
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 px-0 flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-transparent ${
                    p === currentPage
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {p + 1}
                </Button>
              )
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="h-8 w-8 px-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

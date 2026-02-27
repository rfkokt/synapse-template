import * as React from 'react';
import { LuLoader as LoaderIcon, LuSearch as SearchIcon } from 'react-icons/lu';

import { cn } from '../utils/cn';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from './select';

export interface SearchableSelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options?: SearchableSelectOption[];
  fetchOptions?: (query: string) => Promise<SearchableSelectOption[]>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  minQueryLength?: number;
  debounceMs?: number;
  size?: 'sm' | 'default';
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  searchInputClassName?: string;
  errorText?: string;
}

const DEFAULT_DEBOUNCE = 350;

function dedupeOptions(options: SearchableSelectOption[]) {
  const map = new Map<string, SearchableSelectOption>();
  for (const option of options) {
    if (!map.has(option.value)) {
      map.set(option.value, option);
    }
  }
  return Array.from(map.values());
}

function groupOptions(options: SearchableSelectOption[]) {
  const ungrouped: SearchableSelectOption[] = [];
  const groupedMap = new Map<string, SearchableSelectOption[]>();

  for (const option of options) {
    if (!option.group) {
      ungrouped.push(option);
      continue;
    }

    if (!groupedMap.has(option.group)) {
      groupedMap.set(option.group, []);
    }
    groupedMap.get(option.group)?.push(option);
  }

  return {
    ungrouped,
    grouped: Array.from(groupedMap.entries()),
  };
}

export function SearchableSelect({
  value,
  onValueChange,
  options = [],
  fetchOptions,
  placeholder = 'Pilih...',
  searchPlaceholder = 'Cari...',
  emptyText = 'Tidak ada hasil.',
  loadingText = 'Memuat...',
  minQueryLength = 0,
  debounceMs = DEFAULT_DEBOUNCE,
  size = 'default',
  disabled = false,
  triggerClassName,
  contentClassName,
  searchInputClassName,
  errorText = 'Gagal memuat data.',
}: SearchableSelectProps) {
  const isRemote = Boolean(fetchOptions);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [remoteOptions, setRemoteOptions] = React.useState<SearchableSelectOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState('');
  const requestIdRef = React.useRef(0);

  const searchQuery = query.trim();
  const normalizedQuery = searchQuery.toLowerCase();
  const normalizedLocalOptions = React.useMemo(() => dedupeOptions(options), [options]);

  React.useEffect(() => {
    if (!value) {
      setSelectedLabel('');
      return;
    }

    const currentOptions = dedupeOptions([...normalizedLocalOptions, ...remoteOptions]);
    const selectedOption = currentOptions.find((option) => option.value === value);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    }
  }, [normalizedLocalOptions, remoteOptions, value]);

  React.useEffect(() => {
    if (!isRemote || !fetchOptions || !open) {
      return;
    }

    if (searchQuery.length < minQueryLength) {
      setRemoteOptions([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setHasError(false);

    const timer = window.setTimeout(async () => {
      try {
        const result = await fetchOptions(searchQuery);
        if (requestIdRef.current !== requestId) {
          return;
        }
        setRemoteOptions(dedupeOptions(result));
      } catch {
        if (requestIdRef.current !== requestId) {
          return;
        }
        setRemoteOptions([]);
        setHasError(true);
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, fetchOptions, isRemote, minQueryLength, open, searchQuery]);

  const visibleOptions = React.useMemo(() => {
    if (isRemote) {
      return remoteOptions;
    }

    if (!normalizedQuery) {
      return normalizedLocalOptions;
    }

    return normalizedLocalOptions.filter((option) => {
      const lookup = [option.label, option.value, ...(option.keywords ?? [])]
        .join(' ')
        .toLowerCase();
      return lookup.includes(normalizedQuery);
    });
  }, [isRemote, normalizedLocalOptions, normalizedQuery, remoteOptions]);

  const grouped = React.useMemo(() => groupOptions(visibleOptions), [visibleOptions]);

  const showMinQueryHint = isRemote && searchQuery.length < minQueryLength;
  const hasNoResult = !isLoading && !hasError && !showMinQueryHint && visibleOptions.length === 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery('');
      setHasError(false);
    }
  };

  const handleValueChange = (nextValue: string) => {
    const selectedOption = visibleOptions.find((option) => option.value === nextValue);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    }
    onValueChange(nextValue);
  };

  const renderOptions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
          <LoaderIcon className="size-4 animate-spin" />
          {loadingText}
        </div>
      );
    }

    if (hasError) {
      return <p className="px-3 py-2 text-sm text-error">{errorText}</p>;
    }

    if (showMinQueryHint) {
      return (
        <p className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
          Ketik minimal {minQueryLength} karakter.
        </p>
      );
    }

    if (hasNoResult) {
      return (
        <p className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">{emptyText}</p>
      );
    }

    return (
      <>
        {grouped.ungrouped.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
        {grouped.grouped.map(([groupName, groupOptions], index) => (
          <React.Fragment key={groupName}>
            {(grouped.ungrouped.length > 0 || index > 0) && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{groupName}</SelectLabel>
              {groupOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger size={size} className={triggerClassName}>
        <span className={cn(!selectedLabel && 'text-neutral-500 dark:text-neutral-400')}>
          {selectedLabel || placeholder}
        </span>
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        className={cn('p-0 overflow-hidden', contentClassName)}
      >
        <div className="border-b border-neutral-200 p-2 dark:border-neutral-700">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              placeholder={searchPlaceholder}
              autoFocus
              className={cn(
                'h-8 w-full rounded-md border border-neutral-300 bg-white pr-3 pl-8 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                searchInputClassName
              )}
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">{renderOptions()}</div>
      </SelectContent>
    </Select>
  );
}

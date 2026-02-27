import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { Button } from './Button';

/* ─────────────────────────────────────────────
   Tabs Component (Compound Pattern)
   Horizontal & Vertical, keyboard accessible
   ───────────────────────────────────────────── */

// ── Context ──
interface TabsContextValue {
  activeValue: string;
  setActiveValue: (v: string) => void;
  orientation: 'horizontal' | 'vertical';
  registerTab: (value: string) => void;
  tabValues: string[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used inside <Tabs>');
  return ctx;
}

// ── Tabs Root ──
export interface TabsProps {
  children: ReactNode;
  /** Default active tab value (uncontrolled) */
  defaultValue?: string;
  /** Active tab value (controlled) */
  value?: string;
  /** Callback when active tab changes */
  onChange?: (value: string) => void;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional className */
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value: controlledValue,
  onChange,
  orientation = 'horizontal',
  className = '',
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [tabValues, setTabValues] = useState<string[]>([]);

  const activeValue = controlledValue ?? internalValue;

  const setActiveValue = useCallback(
    (v: string) => {
      if (controlledValue === undefined) {
        setInternalValue(v);
      }
      onChange?.(v);
    },
    [controlledValue, onChange]
  );

  const registerTab = useCallback((val: string) => {
    setTabValues((prev) => (prev.includes(val) ? prev : [...prev, val]));
  }, []);

  return (
    <TabsContext.Provider
      value={{ activeValue, setActiveValue, orientation, registerTab, tabValues }}
    >
      <div
        className={`${orientation === 'vertical' ? 'flex gap-4' : ''} ${className}`}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ── TabList ──
export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  const { orientation, tabValues, activeValue, setActiveValue } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (![prevKey, nextKey, 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();

    const currentIdx = tabValues.indexOf(activeValue);
    let newIdx = currentIdx;

    if (e.key === prevKey) {
      newIdx = currentIdx <= 0 ? tabValues.length - 1 : currentIdx - 1;
    } else if (e.key === nextKey) {
      newIdx = currentIdx >= tabValues.length - 1 ? 0 : currentIdx + 1;
    } else if (e.key === 'Home') {
      newIdx = 0;
    } else if (e.key === 'End') {
      newIdx = tabValues.length - 1;
    }

    setActiveValue(tabValues[newIdx]);

    // Focus the new tab button
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[newIdx]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={`${
        orientation === 'horizontal'
          ? 'flex border-b border-neutral-200 dark:border-neutral-800 gap-0'
          : 'flex flex-col border-r border-neutral-200 dark:border-neutral-800 gap-0 shrink-0 min-w-[160px]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── Tab ──
export interface TabProps {
  /** Unique value for this tab */
  value: string;
  children: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled = false, className = '' }: TabProps) {
  const { activeValue, setActiveValue, orientation, registerTab } = useTabsContext();
  const isActive = activeValue === value;
  const tabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerTab(value);
  }, [value, registerTab]);

  return (
    <Button
      variant="ghost"
      ref={tabRef}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveValue(value)}
      className={`relative px-4 py-2.5 text-sm font-medium transition-colors h-auto focus-visible:ring-0 focus-visible:ring-offset-0 ${
        orientation === 'horizontal'
          ? `justify-center rounded-t-lg rounded-b-none ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-transparent hover:bg-transparent'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 bg-transparent hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50'
            }`
          : `justify-start text-left w-full rounded-l-lg rounded-r-none ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 bg-transparent'
            }`
      } ${className}`}
    >
      {children}

      {/* Active indicator */}
      {isActive && orientation === 'horizontal' && (
        <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-600 dark:bg-primary-400" />
      )}
      {isActive && orientation === 'vertical' && (
        <span className="absolute top-0 bottom-0 right-[-1px] w-[2px] bg-primary-600 dark:bg-primary-400" />
      )}
    </Button>
  );
}

// ── TabPanel ──
export interface TabPanelProps {
  /** Must match the Tab's value */
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeValue } = useTabsContext();

  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={`flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Tabs;

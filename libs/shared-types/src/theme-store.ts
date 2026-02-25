import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* ─────────────────────────────────────────────
   Theme Store — Global dark mode & accent color
   Persisted to localStorage so it survives refresh.
   ───────────────────────────────────────────── */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  /** Resolved value: true = dark is active */
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }
  return mode === 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light' as ThemeMode,
      isDark: false,

      setMode: (mode) => {
        const isDark = resolveIsDark(mode);
        set({ mode, isDark });
        applyTheme(isDark);
      },

      toggle: () => {
        const next = get().isDark ? 'light' : 'dark';
        get().setMode(next);
      },
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Re-apply theme class when store rehydrates from localStorage
        if (state) {
          const isDark = resolveIsDark(state.mode);
          state.isDark = isDark;
          applyTheme(isDark);
        }
      },
    }
  )
);

/** Apply or remove the .dark class on <html> */
function applyTheme(isDark: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
}

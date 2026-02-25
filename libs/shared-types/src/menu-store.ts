import { create } from 'zustand';

/* ────────────────────────────────────────────
   Menu item shape returned by the backend
   GET /api/v1/menus
   ──────────────────────────────────────────── */

export interface MenuItem {
  id: string;
  label: string;
  /** Lucide icon name, e.g. "LayoutDashboard", "Package" */
  icon: string;
  path: string;
  /** Nested children → renders as CollapsibleSection */
  children?: MenuItem[];
  /** Optional badge text, e.g. "NEW" or a count "3" */
  badge?: string;
  /** Whether this group should be expanded by default */
  defaultOpen?: boolean;
}

export interface MenuGroup {
  /** Section title, e.g. "MENU", "LAINNYA" */
  title: string;
  items: MenuItem[];
}

export interface MenuState {
  /** Menu groups from BE */
  groups: MenuGroup[];
  isLoading: boolean;
  error: string | null;
  setMenus: (groups: MenuGroup[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  groups: [],
  isLoading: true,
  error: null,
  setMenus: (groups) => set({ groups, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));

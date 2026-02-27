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
  /** Allowed roles; omit for public-to-authenticated users */
  roles?: string[];
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
  /** Allowed roles for the whole group */
  roles?: string[];
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

function normalizeRole(value: string | null | undefined): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

/**
 * True when role is allowed by `allowedRoles`.
 * - Empty/undefined allowedRoles => allow all
 * - Supports wildcard: '*'
 */
export function isRoleAllowed(
  currentRole: string | null | undefined,
  allowedRoles?: string[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const role = normalizeRole(currentRole);

  return allowedRoles.some((allowed) => {
    const normalizedAllowed = normalizeRole(allowed);
    return normalizedAllowed === '*' || normalizedAllowed === role;
  });
}

export function filterMenuItemsByRole(
  items: MenuItem[],
  currentRole: string | null | undefined
): MenuItem[] {
  const filtered = items
    .filter((item) => isRoleAllowed(currentRole, item.roles))
    .map((item) => {
      if (!item.children || item.children.length === 0) {
        return item;
      }

      const nextChildren = filterMenuItemsByRole(item.children, currentRole);

      if (nextChildren.length === 0) {
        // Keep parent only if it has its own valid path.
        if (!item.path) {
          return null;
        }
        return { ...item, children: [] };
      }

      return { ...item, children: nextChildren };
    })
    .filter((item): item is MenuItem => item !== null);

  return filtered;
}

export function filterMenuGroupsByRole(
  groups: MenuGroup[],
  currentRole: string | null | undefined
): MenuGroup[] {
  return groups
    .filter((group) => isRoleAllowed(currentRole, group.roles))
    .map((group) => ({
      ...group,
      items: filterMenuItemsByRole(group.items, currentRole),
    }))
    .filter((group) => group.items.length > 0);
}

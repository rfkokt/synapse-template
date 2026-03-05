import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth-store';
import {
  useMenuStore,
  isRoleAllowed,
  filterMenuItemsByRole,
  filterMenuGroupsByRole,
} from '../menu-store';
import type { MenuItem, MenuGroup } from '../menu-store';

/* ─────────────────────────────────────────────
   Auth Store
   ───────────────────────────────────────────── */

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isHydrating: false,
    });
  });

  it('should start with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isHydrating).toBe(false);
  });

  it('setAuth should set user and mark authenticated', () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' };
    useAuthStore.getState().setAuth(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isHydrating).toBe(false);
  });

  it('clearAuth should reset user and mark unauthenticated', () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' };
    useAuthStore.getState().setAuth(mockUser);
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setHydrating should update isHydrating', () => {
    useAuthStore.getState().setHydrating(true);
    expect(useAuthStore.getState().isHydrating).toBe(true);

    useAuthStore.getState().setHydrating(false);
    expect(useAuthStore.getState().isHydrating).toBe(false);
  });
});

/* ─────────────────────────────────────────────
   Menu Store
   ───────────────────────────────────────────── */

describe('useMenuStore', () => {
  beforeEach(() => {
    useMenuStore.setState({
      groups: [],
      isLoading: true,
      error: null,
    });
  });

  it('should start with loading state', () => {
    const state = useMenuStore.getState();
    expect(state.groups).toEqual([]);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('setMenus should set groups and clear loading + error', () => {
    const groups: MenuGroup[] = [
      { title: 'Main', items: [{ id: '1', label: 'Dashboard', icon: 'Home', path: '/' }] },
    ];
    useMenuStore.getState().setMenus(groups);

    const state = useMenuStore.getState();
    expect(state.groups).toEqual(groups);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setError should set error and clear loading', () => {
    useMenuStore.getState().setError('Network error');

    const state = useMenuStore.getState();
    expect(state.error).toBe('Network error');
    expect(state.isLoading).toBe(false);
  });
});

/* ─────────────────────────────────────────────
   Role-Based Access Helpers
   ───────────────────────────────────────────── */

describe('isRoleAllowed', () => {
  it('should allow all roles when allowedRoles is undefined', () => {
    expect(isRoleAllowed('admin', undefined)).toBe(true);
  });

  it('should allow all roles when allowedRoles is empty', () => {
    expect(isRoleAllowed('admin', [])).toBe(true);
  });

  it('should allow matching role (case-insensitive)', () => {
    expect(isRoleAllowed('Admin', ['admin', 'manager'])).toBe(true);
  });

  it('should reject non-matching role', () => {
    expect(isRoleAllowed('user', ['admin', 'manager'])).toBe(false);
  });

  it('should allow wildcard *', () => {
    expect(isRoleAllowed('anyone', ['*'])).toBe(true);
  });

  it('should handle null/undefined current role gracefully', () => {
    expect(isRoleAllowed(null, ['admin'])).toBe(false);
    expect(isRoleAllowed(undefined, ['admin'])).toBe(false);
    expect(isRoleAllowed(null, undefined)).toBe(true);
  });
});

describe('filterMenuItemsByRole', () => {
  const items: MenuItem[] = [
    { id: '1', label: 'Dashboard', icon: 'Home', path: '/', roles: ['admin', 'user'] },
    { id: '2', label: 'Settings', icon: 'Cog', path: '/settings', roles: ['admin'] },
    { id: '3', label: 'Help', icon: 'Help', path: '/help' }, // No role restriction
  ];

  it('should keep items matching role', () => {
    const result = filterMenuItemsByRole(items, 'admin');
    expect(result).toHaveLength(3);
  });

  it('should filter out items not matching role', () => {
    const result = filterMenuItemsByRole(items, 'user');
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual(['1', '3']);
  });

  it('should filter children recursively', () => {
    const nested: MenuItem[] = [
      {
        id: '1',
        label: 'Admin',
        icon: 'Shield',
        path: '/admin',
        roles: ['admin'],
        children: [
          { id: '1.1', label: 'Users', icon: 'Users', path: '/admin/users', roles: ['admin'] },
        ],
      },
    ];
    const result = filterMenuItemsByRole(nested, 'user');
    expect(result).toHaveLength(0);
  });
});

describe('filterMenuGroupsByRole', () => {
  const groups: MenuGroup[] = [
    {
      title: 'Admin',
      roles: ['admin'],
      items: [{ id: '1', label: 'Users', icon: 'Users', path: '/users' }],
    },
    {
      title: 'Public',
      items: [{ id: '2', label: 'Dashboard', icon: 'Home', path: '/' }],
    },
  ];

  it('should filter groups by role', () => {
    const result = filterMenuGroupsByRole(groups, 'user');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Public');
  });

  it('should keep all groups for admin', () => {
    const result = filterMenuGroupsByRole(groups, 'admin');
    expect(result).toHaveLength(2);
  });
});

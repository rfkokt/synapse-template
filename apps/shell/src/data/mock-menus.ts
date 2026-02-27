/**
 * Mock menu data for development.
 *
 * In production, this data comes from GET /api/v1/menus.
 * This file is used as a fallback during development when the API is not available.
 *
 * Import this in Shell's main.tsx to seed the menuStore before the app renders.
 */
import type { MenuGroup } from '@synapse/shared-types';

export const MOCK_MENUS: MenuGroup[] = [
  {
    title: 'Main Menu',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        path: '/',
      },
      {
        id: 'users',
        label: 'User Management',
        icon: 'Users',
        path: '/users-management',
        defaultOpen: true,
        children: [
          { id: 'users-list', label: 'All Users', icon: 'Users', path: '/users-management/list' },
          {
            id: 'users-roles',
            label: 'Roles & Permissions',
            icon: 'Shield',
            path: '/users-management/roles',
          },
        ],
      },
      {
        id: 'products',
        label: 'Products',
        icon: 'Package',
        path: '/products',
        children: [
          { id: 'products-list', label: 'Product List', icon: 'List', path: '/products/list' },
          {
            id: 'products-categories',
            label: 'Categories',
            icon: 'Tags',
            path: '/products/categories',
          },
        ],
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: 'ClipboardList',
        path: '/reports',
        children: [
          { id: 'reports-sales', label: 'Sales Report', icon: 'BarChart3', path: '/reports/sales' },
          {
            id: 'reports-inventory',
            label: 'Inventory Report',
            icon: 'Package',
            path: '/reports/inventory',
          },
        ],
      },
    ],
  },
  {
    title: 'Developer',
    items: [
      {
        id: 'docs',
        label: 'Dokumentasi',
        icon: 'Book',
        path: '/docs',
        defaultOpen: true,
        children: [
          {
            id: 'docs-why-mf',
            label: '0. Kenapa Module Federation?',
            icon: 'HelpCircle',
            path: '/docs/kenapa-module-federation',
          },
          {
            id: 'docs-struktur',
            label: '1. Struktur Proyek',
            icon: 'FolderTree',
            path: '/docs/struktur-proyek',
          },
          {
            id: 'docs-menjalankan',
            label: '2. Menjalankan Aplikasi',
            icon: 'Terminal',
            path: '/docs/menjalankan-aplikasi',
          },
          {
            id: 'docs-membuat-mfe',
            label: '3. Membuat MFE Baru',
            icon: 'PlusSquare',
            path: '/docs/membuat-mfe-baru',
          },
          {
            id: 'docs-routing',
            label: '4. MFE Routing Best Practices',
            icon: 'Route',
            path: '/docs/routing-best-practices',
          },
          {
            id: 'docs-menambah-package',
            label: '5. Menambah Package Baru',
            icon: 'PackagePlus',
            path: '/docs/menambah-package',
          },
          { id: 'docs-token', label: '6. Token & Auth', icon: 'Key', path: '/docs/token-auth' },
          {
            id: 'docs-api',
            label: '7. API & Interceptors',
            icon: 'Globe',
            path: '/docs/api-interceptors',
          },
          {
            id: 'docs-remotes',
            label: '8. Dynamic Remotes',
            icon: 'Link',
            path: '/docs/dynamic-remotes',
          },
          {
            id: 'docs-ui',
            label: '9. Shared UI Kit',
            icon: 'Component',
            path: '/docs/shared-ui-kit',
          },
          {
            id: 'docs-tailwind',
            label: '10. Tailwind & Theme',
            icon: 'Palette',
            path: '/docs/tailwind-theme',
          },
          {
            id: 'docs-events',
            label: '11. Events & Error',
            icon: 'Radio',
            path: '/docs/events-error',
          },
          {
            id: 'docs-env',
            label: '12. Env & Dark Mode',
            icon: 'Settings2',
            path: '/docs/env-dark-mode',
          },
          { id: 'docs-git', label: '13. Git & Perf', icon: 'GitBranch', path: '/docs/git-perf' },
          {
            id: 'docs-security',
            label: '14. Security',
            icon: 'ShieldCheck',
            path: '/docs/security',
          },
          {
            id: 'docs-i18n',
            label: '15. Internationalization (i18n)',
            icon: 'Globe2',
            path: '/docs/i18n',
          },
          {
            id: 'docs-api-mocking',
            label: '16. API Mocking (MSW)',
            icon: 'Activity',
            path: '/docs/api-mocking',
          },
        ],
      },
      {
        id: 'reusable-components',
        label: 'Reusable Components',
        icon: 'Puzzle',
        path: '/docs/components',
        children: [
          {
            id: 'rc-infobox',
            label: 'InfoBox',
            icon: 'MessageSquare',
            path: '/docs/components/infobox',
          },
          {
            id: 'rc-comparisontable',
            label: 'ComparisonTable',
            icon: 'BarChart3',
            path: '/docs/components/comparisontable',
          },
          {
            id: 'rc-featuregrid',
            label: 'FeatureGrid',
            icon: 'LayoutGrid',
            path: '/docs/components/featuregrid',
          },
          {
            id: 'rc-utilities',
            label: 'Utilities',
            icon: 'Wrench',
            path: '/docs/components/utilities',
          },
          {
            id: 'rc-codeblocktable',
            label: 'CodeBlockTable',
            icon: 'Table',
            path: '/docs/components/codeblocktable',
          },
          {
            id: 'rc-docsstep',
            label: 'DocsStep',
            icon: 'ListOrdered',
            path: '/docs/components/docsstep',
          },
        ],
      },
      {
        id: 'ui-kit',
        label: 'UI Kit',
        icon: 'Globe',
        path: '/docs/ui-kit',
        // Children are auto-injected from component-discovery.ts
        // Do NOT hardcode them here — they are generated at runtime.
        children: [],
      },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { id: 'pengaturan', label: 'Pengaturan', icon: 'Settings', path: '/pengaturan' },
      { id: 'bantuan', label: 'Bantuan', icon: 'HelpCircle', path: '/bantuan' },
    ],
  },
];

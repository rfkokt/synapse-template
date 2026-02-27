import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@synapse/ui-kit';
import { CodeBlock, InfoBox, StepList } from '@synapse/shared-components';

const menuRbacSnippet = `import type { MenuGroup } from '@synapse/shared-types';

export const MENUS: MenuGroup[] = [
  {
    title: 'Main Menu',
    roles: ['admin', 'manager', 'user', 'developer'],
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/', roles: ['*'] },
      {
        id: 'users',
        label: 'User Management',
        icon: 'Users',
        path: '/users-management',
        roles: ['admin'],
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: 'ClipboardList',
        path: '/reports',
        roles: ['admin', 'manager'],
      },
    ],
  },
];`;

const shellFilterSnippet = `import { filterMenuGroupsByRole } from '@synapse/shared-types';
import { apiClient, API } from '@synapse/shared-api';

const response = await apiClient.get(API.menu.list());
const sourceMenus = Array.isArray(response.data) ? response.data : response.data?.data ?? [];

const enrichedMenus = enrichMenusWithDiscoveredComponents(sourceMenus);
const roleAwareMenus = filterMenuGroupsByRole(enrichedMenus, user?.role ?? 'user');

useEffect(() => {
  useMenuStore.getState().setMenus(roleAwareMenus);
}, [roleAwareMenus]);`;

const mswMenuSnippet = `// libs/mock-api/src/handlers/menus.ts
import { http, HttpResponse } from 'msw';
import menus from '../fixtures/menus.json';

export const menuHandlers = [
  http.get('/api/v1/menus', async () => {
    return HttpResponse.json(menus, { status: 200 });
  }),
];`;

const loginRoleSnippet = `const payload: AuthEventPayload = {
  userId: user.id,
  user, // wajib mengandung field "role"
  accessToken,
  expiresAt: Date.now() + 15 * 60 * 1000,
};

dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_IN, payload);
useAuthStore.getState().setAuth(payload.accessToken, user);`;

export function DocsSidebarRbacSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-sm font-bold">
            18
          </span>
          Sidebar RBAC & Roles
        </CardTitle>
        <CardDescription>
          Role-based sidebar menu: role dari login menentukan menu yang tampil di Shell.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          Implementasi RBAC di platform ini menggunakan field <code>user.role</code> dari hasil
          login. Shell akan memfilter menu berdasarkan metadata <code>roles</code> di tiap group
          atau item.
        </p>

        <InfoBox variant="blue" title="Role Saat Ini">
          Role yang dipakai: <code>admin</code>, <code>manager</code>, <code>developer</code>,{' '}
          <code>user</code>. Tambahan role lain boleh, selama dikirim dari backend.
        </InfoBox>

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          1. Tambahkan Metadata Role di Menu
        </h3>
        <CodeBlock language="typescript" codeString={menuRbacSnippet} />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          2. Filter Menu di Shell Berdasarkan user.role
        </h3>
        <CodeBlock language="typescript" codeString={shellFilterSnippet} />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          3. Simulasi BE dengan MSW
        </h3>
        <CodeBlock language="typescript" codeString={mswMenuSnippet} />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          4. Pastikan Login Mengirim Role
        </h3>
        <CodeBlock language="typescript" codeString={loginRoleSnippet} />

        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Alur Singkat End-to-End
        </h3>
        <StepList
          steps={[
            {
              title: 'User login di auth-mfe',
              content: 'Server mengembalikan user + role + access token.',
            },
            {
              title: 'Auth event dikirim ke Shell',
              content: 'Shell sinkronisasi role ke useAuthStore.',
            },
            {
              title: 'Shell memfilter menu',
              content: 'Menu group/item tanpa akses role otomatis disembunyikan.',
            },
            {
              title: 'User melihat menu sesuai otorisasi',
              content: 'Contoh: menu User Management hanya muncul untuk admin.',
            },
          ]}
        />

        <InfoBox variant="amber" title="Catatan Penting Keamanan">
          Menyembunyikan menu di frontend <strong>bukan</strong> pengganti otorisasi backend.
          Endpoint API tetap wajib validasi role/permission di server.
        </InfoBox>
      </CardContent>
    </Card>
  );
}

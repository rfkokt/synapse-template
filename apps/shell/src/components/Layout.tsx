import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  useAuthStore,
  useMenuStore,
  filterMenuGroupsByRole,
  useThemeStore,
  useNotificationStore,
  useIdleTimeout,
  MFE_EVENTS,
  dispatchMfeEvent,
} from '@synapse/shared-types';
import type { MenuGroup, MenuItem } from '@synapse/shared-types';
import { apiClient, API } from '@synapse/shared-api';
import {
  LuLogOut as LogOut,
  LuSun as Sun,
  LuMoon as Moon,
  LuChevronDown as ChevronDown,
  LuTriangleAlert as AlertTriangle,
  LuPanelLeft as PanelLeft,
  LuGlobe as Globe,
} from 'react-icons/lu';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getIcon } from '../utils/icon-map';
import { MOCK_MENUS } from '../data/mock-menus';
import { ToastContainer, Modal, Button, DropdownMenu } from '@synapse/ui-kit';
import { useTranslation } from 'react-i18next';
import { discoveredComponents } from '../utils/component-discovery';
import { discoveredSharedComponents } from '../utils/shared-component-discovery';
import { AutoBreadcrumb } from './AutoBreadcrumb';

/* ─────────────────────────────────────────────
   Collapsible sidebar section
   ───────────────────────────────────────────── */
function CollapsibleSection({
  label,
  icon: Icon,
  children,
  defaultOpen = false,
  childPaths = [],
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  childPaths?: string[];
}) {
  const location = useLocation();
  const hasActiveChild = childPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );
  const [manualOpen, setManualOpen] = useState(defaultOpen);
  const isOpen = hasActiveChild || manualOpen;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setManualOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors h-auto ${
          hasActiveChild
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-transparent'
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>
      {isOpen && (
        <div className="ml-7 mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NavLink class helpers
   ───────────────────────────────────────────── */
const topNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive
      ? 'nav-item-active bg-neutral-900 text-white'
      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
  }`;

const subNavClass = ({ isActive }: { isActive: boolean }) =>
  `block py-1.5 px-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'font-semibold text-neutral-900 dark:text-white'
      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
  }`;

const DEFAULT_DOCUMENTED_REUSABLE_SLUGS = new Set([
  'reusableguide',
  'codeblock',
  'sectiontitle',
  'keyvaluecard',
  'steplist',
  'infobox',
  'comparisontable',
  'featuregrid',
  'utilities',
  'codeblocktable',
  'docsstep',
  'exampletabs',
]);

function formatRoleLabel(role: string | null | undefined): string {
  const normalized = String(role ?? 'user')
    .trim()
    .toLowerCase();
  return normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
}

function enrichMenusWithDiscoveredComponents(baseMenus: MenuGroup[]): MenuGroup[] {
  return baseMenus.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.id === 'ui-kit') {
        const autoChildren: MenuItem[] = discoveredComponents.map((c) => ({
          id: `uk-${c.slug}`,
          label: c.name,
          icon: 'FileText',
          path: `/docs/ui-kit/${c.slug}`,
          roles: item.roles,
        }));
        autoChildren.push({
          id: 'uk-tutorial',
          label: 'Tutorial',
          icon: 'GraduationCap',
          path: '/docs/ui-kit/tutorial',
          roles: item.roles,
        });
        return { ...item, children: autoChildren };
      }

      if (item.id === 'reusable-components') {
        const documentedSlugsFromMenu = (item.children ?? [])
          .map((child) => child.path.split('/').pop()?.toLowerCase())
          .filter((slug): slug is string => Boolean(slug));

        const documentedSlugs = new Set([
          ...DEFAULT_DOCUMENTED_REUSABLE_SLUGS,
          ...documentedSlugsFromMenu,
        ]);

        const reusableGuideItem = item.children?.find((child) =>
          child.path.endsWith('/reusableguide')
        ) ?? {
          id: 'rc-reusableguide',
          label: 'Build Reusable Component',
          icon: 'Book',
          path: '/docs/components/reusableguide',
          roles: item.roles,
        };

        const autoChildren: MenuItem[] = [reusableGuideItem];
        for (const component of discoveredSharedComponents) {
          autoChildren.push({
            id: `rc-${component.slug}`,
            label: documentedSlugs.has(component.slug)
              ? component.name
              : `${component.name} (Tidak ada dokumentasi)`,
            icon: 'FileText',
            path: `/docs/components/${component.slug}`,
            roles: item.roles,
          });
        }

        return { ...item, children: autoChildren };
      }

      return item;
    }),
  }));
}

/* ─────────────────────────────────────────────
   Render a single MenuItem (top-level or nested)
   ───────────────────────────────────────────── */
function SidebarItem({ item }: { item: MenuItem }) {
  const icon = getIcon(item.icon);
  const { t } = useTranslation('common');

  if (item.children && item.children.length > 0) {
    return (
      <CollapsibleSection
        label={t(`menu.${item.id}`, { defaultValue: item.label })}
        icon={icon}
        defaultOpen={item.defaultOpen}
        childPaths={item.children.map((c) => c.path)}
      >
        {item.children.map((child) => (
          <NavLink key={child.id} to={child.path} className={subNavClass}>
            {t(`menu.${child.id}`, { defaultValue: child.label })}
          </NavLink>
        ))}
      </CollapsibleSection>
    );
  }

  return (
    <NavLink to={item.path} end={item.path === '/'} className={topNavClass}>
      {React.createElement(icon, { className: 'h-4 w-4' })}
      {t(`menu.${item.id}`, { defaultValue: item.label })}
      {item.badge && (
        <span className="ml-auto text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

/* ─────────────────────────────────────────────
   Skeleton loader for sidebar
   ───────────────────────────────────────────── */
function SidebarSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Layout Component
   ═══════════════════════════════════════════════ */
export function Layout() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t, i18n } = useTranslation(['common', 'auth']);

  // Theme store
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);

  // Menu store
  const menuGroups = useMenuStore((s) => s.groups) ?? [];
  const menuLoading = useMenuStore((s) => s.isLoading);
  const [baseMenus, setBaseMenus] = useState<MenuGroup[] | null>(null);
  const roleLabel = formatRoleLabel(user?.role);

  useEffect(() => {
    let active = true;

    const loadMenusFromApi = async () => {
      useMenuStore.getState().setLoading(true);

      try {
        const res = await apiClient.get<MenuGroup[] | { data?: MenuGroup[] }>(API.menu.list());
        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        if (!active) return;
        setBaseMenus(payload.length > 0 ? payload : MOCK_MENUS);
      } catch (error) {
        if (!active) return;
        console.warn('[Menu] Failed to fetch /api/v1/menus. Using local fallback.', error);
        setBaseMenus(MOCK_MENUS);
      }
    };

    loadMenusFromApi();

    return () => {
      active = false;
    };
  }, []);

  const enrichedMenus = useMemo(
    () => enrichMenusWithDiscoveredComponents(baseMenus ?? []),
    [baseMenus]
  );
  const roleAwareMenus = useMemo(
    () => filterMenuGroupsByRole(enrichedMenus, user?.role ?? 'user'),
    [enrichedMenus, user?.role]
  );

  useEffect(() => {
    if (!baseMenus) return;
    useMenuStore.getState().setMenus(roleAwareMenus);
  }, [baseMenus, roleAwareMenus]);

  const handleLogout = useCallback(() => {
    dispatchMfeEvent(MFE_EVENTS.AUTH.USER_LOGGED_OUT, {});
    useAuthStore.getState().clearAuth();
    navigate('/auth/login');
  }, [navigate]);

  // ── Session Idle Timeout (PRD §6.4) ──
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  const { resetTimer } = useIdleTimeout({
    idleTime: 30 * 60 * 1000,
    warningTime: 5 * 60 * 1000,
    onWarning: () => setShowIdleWarning(true),
    onTimeout: () => {
      setShowIdleWarning(false);
      handleLogout();
    },
    enabled: useAuthStore((s) => s.isAuthenticated),
  });

  const handleStayLoggedIn = () => {
    setShowIdleWarning(false);
    resetTimer();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-neutral-900 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <ToastContainer
        toasts={useNotificationStore((s: any) => s.toasts)}
        onDismiss={useNotificationStore.getState().removeToast}
      />

      {/* ── Idle Timeout Warning Modal ── */}
      <Modal
        open={showIdleWarning}
        onClose={handleStayLoggedIn}
        title="Sesi Akan Berakhir"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleStayLoggedIn}>
              Tetap Login
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-300">
            Anda tidak aktif selama 30 menit. Sesi akan otomatis berakhir dalam{' '}
            <strong>5 menit</strong>.
          </p>
        </div>
      </Modal>

      {/* ══════════════════════════════════════
         SIDEBAR — unified with brand & greeting
         ══════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-neutral-900 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarCollapsed
            ? 'max-lg:-translate-x-full lg:w-0 lg:border-r-0'
            : sidebarOpen
              ? 'w-72 translate-x-0'
              : 'max-lg:-translate-x-full lg:translate-x-0 w-72'
        }`}
      >
        <div className="w-72 flex flex-col h-full">
          {/* ── Brand ── */}
          <div className="px-6 pt-5 pb-2 flex items-center gap-2.5">
            <div className="bg-orange-500 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
              U
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base leading-tight tracking-tight truncate">
                Uhud Tour
              </span>
              <span className="text-[10px] text-neutral-400 leading-tight">
                Al Haramain Mandiri
              </span>
            </div>
          </div>

          {/* ── Greeting ── */}
          <div className="px-6 pt-3 pb-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('menu.greeting', { defaultValue: 'Selamat Datang,' })}
            </p>
            <p className="text-lg font-bold leading-tight truncate">
              {user?.name || 'Ahmad Fahim Hakim'} 👋
            </p>
            <span className="mt-1 inline-flex rounded-md border border-primary-300/50 bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-700 dark:border-primary-700/60 dark:bg-primary-900/20 dark:text-primary-300">
              {roleLabel}
            </span>
          </div>

          {/* ── Navigation ── */}
          <nav className="px-4 pb-4 flex-1 overflow-y-auto" aria-label="Main navigation">
            {menuLoading ? (
              <SidebarSkeleton />
            ) : (
              menuGroups.map((group, idx) => (
                <div
                  key={group.title}
                  className={
                    idx > 0 ? 'border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-3' : ''
                  }
                >
                  <div className="px-3 mb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {t(`menu.title_${group.title.toLowerCase()}`, { defaultValue: group.title })}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </nav>

          {/* ── Logout ── */}
          <div className="px-4 pb-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors text-left bg-transparent h-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t('menu.logout', { defaultValue: 'Keluar' })}
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══════════════════════════════════════
         MAIN AREA — header + content
         ══════════════════════════════════════ */}
      <div
        className={`flex flex-col flex-1 h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'
        }`}
      >
        {/* ── Top Header Bar (light, content-area only) ── */}
        <header className="h-14 bg-white dark:bg-neutral-900 flex items-center px-4 lg:px-6 gap-3 shrink-0 z-30">
          {/* Unified sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="flex h-8 w-8 px-0 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors bg-transparent"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setSidebarCollapsed(!sidebarCollapsed);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-[18px] w-[18px]" />
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu
              align="right"
              trigger={
                <div className="flex items-center gap-1.5 font-medium text-sm">
                  <Globe className="h-5 w-5" />
                  <span className="uppercase text-xs font-bold hidden sm:inline-block">
                    {i18n.language}
                  </span>
                </div>
              }
              items={[
                { label: 'Indonesia (ID)', onClick: () => i18n.changeLanguage('id') },
                { label: 'English (EN)', onClick: () => i18n.changeLanguage('en') },
                { label: 'العربية (AR)', onClick: () => i18n.changeLanguage('ar') },
              ]}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 px-0 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors bg-transparent"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 px-0 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors bg-transparent"
            >
              🔔
            </Button>

            <div className="flex items-center gap-3 pl-3 ml-1 border-l border-neutral-200 dark:border-neutral-700">
              <img
                src="https://api.dicebear.com/7.x/open-peeps/svg?seed=Ahmad"
                alt="Avatar"
                className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-700"
              />
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold leading-tight">
                  {user?.name || 'Ahmad Fahim Hakim'}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {user?.email || 'ahmadfahim@gmail.com'} · {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main
          id="main-content"
          className="flex-1 p-6 lg:px-8 overflow-y-auto bg-neutral-100 dark:bg-neutral-950 rounded-tl-3xl overflow-hidden"
        >
          <AutoBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { useMenuStore } from '@synapse/shared-types';
import { Breadcrumb, type BreadcrumbItem } from '@synapse/ui-kit';

export function AutoBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuGroups = useMenuStore((s) => s.groups) ?? [];

  // Home page doesn't need breadcrumb usually, but let's just generate it
  if (location.pathname === '/') return null;

  const items: BreadcrumbItem[] = [];

  for (const group of menuGroups) {
    for (const item of group.items) {
      // Direct exact match (e.g., /reporting)
      if (location.pathname === item.path) {
        items.push({ label: item.label, href: item.path });
        break;
      }

      // Match nested children (e.g., /docs/struktur-proyek)
      if (item.children) {
        const child = item.children.find((c) => location.pathname === c.path);
        if (child) {
          items.push({ label: item.label, href: item.path });
          items.push({ label: child.label, href: child.path });
          break;
        }
      }
    }
    if (items.length > 0) break;
  }

  // Fallback for partial paths where exact match failed (e.g. nested routes not in menu)
  if (items.length === 0) {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (location.pathname.startsWith(item.path + '/')) {
          items.push({ label: item.label, href: item.path });
          // We can't know the exact child name, so we just show the parent.
          break;
        }
      }
      if (items.length > 0) break;
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-6 mt-2">
      <Breadcrumb items={items} onNavigate={(href) => navigate(href)} />
    </div>
  );
}

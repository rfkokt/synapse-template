import * as SharedComponents from '@synapse/shared-components';

export interface DiscoveredSharedComponent {
  name: string;
  slug: string;
}

function isComponentExport(name: string, value: unknown): boolean {
  if (!/^[A-Z]/.test(name)) {
    return false;
  }

  if (typeof value === 'function') {
    return true;
  }

  if (typeof value === 'object' && value !== null) {
    return '$$typeof' in (value as Record<string, unknown>);
  }

  return false;
}

export const discoveredSharedComponents: DiscoveredSharedComponent[] = Object.entries(
  SharedComponents
)
  .filter(([name, value]) => isComponentExport(name, value))
  .map(([name]) => ({
    name,
    slug: name.toLowerCase(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

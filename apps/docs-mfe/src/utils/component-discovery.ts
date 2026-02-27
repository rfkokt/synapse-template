/**
 * Auto-discover UI Kit components by scanning the components directory.
 *
 * This uses Vite's import.meta.glob to find all .tsx files in
 * libs/ui-kit/src/components/ at build time. The result is a list
 * of component names that automatically appear in the sidebar
 * and on the /ui-kit page — even if no documentation exists yet.
 */

// Vite scans at build time — keys are relative paths like
// "../../../libs/ui-kit/src/components/Button.tsx"
const componentModules = import.meta.glob('../../../../libs/ui-kit/src/components/*.tsx', {
  eager: false,
});

export interface DiscoveredComponent {
  /** PascalCase name, e.g. "Button", "ErrorFallback" */
  name: string;
  /** lowercase slug for URL, e.g. "button", "errorfallback" */
  slug: string;
}

/** All discovered component names, sorted alphabetically */
export const discoveredComponents: DiscoveredComponent[] = Object.keys(componentModules)
  .map((path) => {
    // "/libs/ui-kit/src/components/Button.tsx" → "Button"
    const filename = path.split('/').pop()?.replace('.tsx', '') ?? '';
    // Ensure PascalCase: "select" → "Select", "ErrorFallback" stays same
    const name = filename.charAt(0).toUpperCase() + filename.slice(1);
    return {
      name,
      slug: filename.toLowerCase(),
    };
  })
  .filter((c) => c.name.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

// Manually add the Icon documentation page since it's not a component in libs/
discoveredComponents.push({
  name: 'Icon',
  slug: 'icon',
});
discoveredComponents.sort((a, b) => a.name.localeCompare(b.name));

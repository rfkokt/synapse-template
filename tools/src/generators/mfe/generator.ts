import { formatFiles, Tree, readJson, writeJson, joinPathFragments, logger } from '@nx/devkit';
import { applicationGenerator } from '@nx/react';
import { GeneratorGeneratorSchema } from './schema';
import { execSync } from 'child_process';

export async function generatorGenerator(tree: Tree, options: GeneratorGeneratorSchema) {
  const mfeName = options.name;
  const port = options.port;
  const projectRoot = `apps/${mfeName}`;

  // 1. Scaffold base React + Vite application using Nx generator
  await applicationGenerator(tree, {
    name: mfeName,
    directory: projectRoot,
    style: 'css',
    bundler: 'vite',
    linter: 'eslint',
    unitTestRunner: 'none',
    e2eTestRunner: 'none',
    routing: true,
    strict: true,
  });

  // 2. Overwrite vite.config.ts with Module Federation setup
  const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';

export default defineConfig({
  server: {
    port: ${port},
    origin: 'http://localhost:${port}',
  },
  preview: {
    port: ${port + 100},
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: '${mfeName.replace(/-/g, '')}',
      filename: 'remoteEntry.js',
      manifest: true,
      dts: false,
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react/': { singleton: true },
        'react-dom/': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'chrome89',
    modulePreload: false,
    minify: true,
  },
});
`;
  tree.write(joinPathFragments(projectRoot, 'vite.config.ts'), viteConfigContent);

  // 3. Setup Tailwind v4 in styles.css
  const indexCssContent = `@import "tailwindcss";
@import "./theme.css";

/* MFE-specific styles go here */
`;
  tree.write(joinPathFragments(projectRoot, 'src/styles.css'), indexCssContent);

  // Scaffold the default theme variables
  const themeCssContent = `/* Enable class-based dark mode (toggle via .dark on <html>) */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Colors — Primary Blue */
  --color-primary-50: oklch(0.97 0.01 240);
  --color-primary-100: oklch(0.93 0.03 240);
  --color-primary-200: oklch(0.86 0.06 240);
  --color-primary-300: oklch(0.76 0.10 240);
  --color-primary-400: oklch(0.66 0.15 240);
  --color-primary-500: oklch(0.55 0.20 240);
  --color-primary-600: oklch(0.48 0.20 240);
  --color-primary-700: oklch(0.40 0.18 240);
  --color-primary-800: oklch(0.33 0.15 240);
  --color-primary-900: oklch(0.27 0.12 240);

  /* Colors — Neutral */
  --color-neutral-50: oklch(0.98 0.005 260);
  --color-neutral-100: oklch(0.96 0.005 260);
  --color-neutral-200: oklch(0.90 0.005 260);
  --color-neutral-300: oklch(0.82 0.008 260);
  --color-neutral-400: oklch(0.65 0.010 260);
  --color-neutral-500: oklch(0.55 0.010 260);
  --color-neutral-600: oklch(0.45 0.010 260);
  --color-neutral-700: oklch(0.35 0.010 260);
  --color-neutral-800: oklch(0.25 0.010 260);
  --color-neutral-900: oklch(0.15 0.010 260);
  --color-neutral-950: oklch(0.10 0.010 260);

  /* Semantic Colors */
  --color-success: oklch(0.55 0.18 145);
  --color-warning: oklch(0.75 0.18 75);
  --color-error: oklch(0.55 0.22 25);
  --color-info: oklch(0.60 0.18 240);

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.07), 0 2px 4px -2px oklch(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -4px oklch(0 0 0 / 0.05);
  --shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.05);
}

/* Base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-50);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s, color 0.3s;
}

/* Dark Mode Overrides */
.dark body,
.dark {
  color-scheme: dark;
  color: #e5e5e5;
  background-color: #0a0a0a;
}
`;
  tree.write(joinPathFragments(projectRoot, 'src/theme.css'), themeCssContent);

  // Clean up default Nx generated components
  tree.delete(joinPathFragments(projectRoot, 'src/app'));

  // 4. Overwrite App.tsx
  const appTsxContent = `import { Card, CardContent } from '@synapse/ui-kit';
import { SharedOriginGuard } from '@synapse/shared-types';

export function App() {
  return (
    <SharedOriginGuard>
      <div className="p-8">
      <Card variant="elevated" className="bg-white">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Hello from ${mfeName}!
          </h1>
          <p className="text-neutral-600 mb-6">
            This Micro Frontend was auto-generated by the internal platform generator.
          </p>
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-800">Status</span>
            <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
              Federated & Ready
            </span>
          </div>
        </CardContent>
      </Card>
      </div>
    </SharedOriginGuard>
  );
}

export default App;
`;
  tree.write(joinPathFragments(projectRoot, 'src/App.tsx'), appTsxContent);
  // remove the default Nx spec file since we disabled tests
  if (tree.exists(joinPathFragments(projectRoot, 'src/App.spec.tsx'))) {
    tree.delete(joinPathFragments(projectRoot, 'src/App.spec.tsx'));
  }

  // 5. Overwrite main.tsx for standalone dev
  const mainTsxContent = `import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { useAuthStore } from '@synapse/shared-types';
import './styles.css';
import { App } from './App';

function StandaloneAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new window.URLSearchParams(window.location.search);
      const authData = urlParams.get('standaloneAuth');
      if (authData) {
        try {
          const parsed = JSON.parse(decodeURIComponent(authData));
          useAuthStore.getState().setAuth(parsed.token, parsed.user);
          
          // Clean up URL to prevent leak and reload loop
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
          return;
        } catch (e) {
          console.error('Failed to parse standalone auth', e);
        }
      }
    }

    if (!isHydrating && !isAuthenticated) {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = \`http://localhost:4000/auth/login?redirect=\${currentUrl}\`;
    }
  }, [isHydrating, isAuthenticated]);

  if (isHydrating || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return <>{children}</>;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <StandaloneAuthGuard>
        <div className="min-h-screen bg-neutral-50 p-4">
          <header className="mb-8 pl-4">
            <p className="text-sm text-warning font-medium">Standalone Mode - Secured (Port ${port})</p>
          </header>
          <App />
        </div>
      </StandaloneAuthGuard>
    </BrowserRouter>
  </StrictMode>
);
`;
  tree.write(joinPathFragments(projectRoot, 'src/main.tsx'), mainTsxContent);

  // 6. Update shell's remotes.json registry
  const remotesJsonPath = 'apps/shell/public/remotes.json';
  if (tree.exists(remotesJsonPath)) {
    const registry = readJson(tree, remotesJsonPath);
    registry.remotes = registry.remotes || {};
    registry.remotes[mfeName] = {
      name: mfeName.replace(/-/g, ''), // safe variable name for MF
      entry: `http://localhost:${port}/mf-manifest.json`,
      activeWhenPath: `/${mfeName}`,
      exposes: {
        './App': './App',
      },
    };
    writeJson(tree, remotesJsonPath, registry);
  }

  // 7. Update shell's vite.config.ts to inject the new remote at build time
  const shellVitePath = 'apps/shell/vite.config.ts';
  if (tree.exists(shellVitePath)) {
    let shellViteContent = tree.read(shellVitePath, 'utf-8');
    if (shellViteContent) {
      // Find the remotes block and insert our new remote
      const remoteConfig = `${mfeName.replace(/-/g, '')}: {
          type: 'module',
          name: '${mfeName.replace(/-/g, '')}',
          entry: 'http://localhost:${port}/mf-manifest.json',
        },`;

      // Simple string injection right after "remotes: {"
      shellViteContent = shellViteContent.replace(
        /remotes:\s*\{/,
        `remotes: {\n        ${remoteConfig}`
      );
      tree.write(shellVitePath, shellViteContent);
    }
  }

  // 8. Add package.json with type: module for Vite/esbuild fix
  const packageJsonPath = joinPathFragments(projectRoot, 'package.json');
  const pkg = {
    name: mfeName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      serve: `vite --port ${port}`,
      build: 'tsc -b && vite build',
      preview: `vite preview --port ${port + 100}`,
    },
    dependencies: {
      '@synapse/ui-kit': 'workspace:*',
      '@synapse/shared-types': 'workspace:*',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'react-router': '^7.0.0',
    },
    devDependencies: {
      '@types/node': '^22.0.0',
      '@module-federation/vite': '^1.11.0',
      '@tailwindcss/vite': '^4.0.0',
      tailwindcss: '^4.0.0',
      '@vitejs/plugin-react': '^4.5.0',
    },
  };
  writeJson(tree, packageJsonPath, pkg);

  // 8.5 Inject targets directly into project.json so Nx Daemon doesn't miss them
  const projectJsonPath = joinPathFragments(projectRoot, 'project.json');
  if (tree.exists(projectJsonPath)) {
    const projectConfig = readJson(tree, projectJsonPath);
    projectConfig.targets = projectConfig.targets || {};
    projectConfig.targets.serve = {
      executor: 'nx:run-commands',
      options: { command: `pnpm run serve`, cwd: projectRoot },
    };
    projectConfig.targets.build = {
      executor: 'nx:run-commands',
      options: { command: `pnpm run build`, cwd: projectRoot },
    };
    projectConfig.targets.preview = {
      executor: 'nx:run-commands',
      options: { command: `pnpm run preview`, cwd: projectRoot },
    };
    writeJson(tree, projectJsonPath, projectConfig);
  }

  // 10. Update shell's vite-env.d.ts to declare the new module for TypeScript
  const shellEnvPath = 'apps/shell/src/vite-env.d.ts';
  if (tree.exists(shellEnvPath)) {
    const envContent = tree.read(shellEnvPath, 'utf-8') || '';
    const declaration = `\ndeclare module '${mfeName.replace(/-/g, '')}/App' {
  const App: React.ComponentType;
  export default App;
}\n`;
    if (!envContent.includes(declaration)) {
      tree.write(shellEnvPath, envContent + declaration);
    }
  }

  // 11. Update shell's router.tsx to inject the lazy route
  const routerPath = 'apps/shell/src/router.tsx';
  if (tree.exists(routerPath)) {
    let routerContent = tree.read(routerPath, 'utf-8');
    if (routerContent) {
      const safeName = mfeName.replace(/-/g, '');
      const importName = `Remote${safeName.charAt(0).toUpperCase() + safeName.slice(1)}`;
      const lazyImport = `const ${importName} = lazy(() => import('${safeName}/App'));`;

      const routeBlock = `        <Route
          path="${mfeName}/*"
          element={
            <RemoteLoader>
              <${importName} />
            </RemoteLoader>
          }
        />`;

      // 1. Inject the lazy import right before the first ProtectedRoute or after existing lazy imports
      if (!routerContent.includes(lazyImport)) {
        if (routerContent.includes('const RemoteDocs')) {
          routerContent = routerContent.replace(
            /const RemoteDocs = lazy.*\n/,
            (matchStr) => matchStr + `${lazyImport}\n`
          );
        } else {
          // Fallback if docs isn't there
          routerContent = routerContent.replace(
            /function ProtectedRoute/,
            `${lazyImport}\n\nfunction ProtectedRoute`
          );
        }
      }

      // 2. Inject the Route block inside the <Route path="/"> layout wrapper
      if (!routerContent.includes(`path="${mfeName}/*"`)) {
        // Look for the end of the Layout Route before the Catch-all
        // This regex looks for </Route>\n\n      {/* Catch-all */}
        routerContent = routerContent.replace(
          /( {6}<\/Route>\s*(?:\{\/\*.*\*\/\})?\s*<Route path="\*" )/,
          () => `${routeBlock}\n      </Route>\n\n      {/* Catch-all */}\n      <Route path="*" `
        );
      }

      tree.write(routerPath, routerContent);
    }
  }

  await formatFiles(tree);

  return () => {
    // Nx installPackagesTask sometimes skips if it doesn't detect root package.json changes.
    // We enforce it here so the MFE is ready out-of-the-box:
    try {
      logger.info('\\n📦 Running pnpm install to fetch new MFE dependencies...\\n');
      execSync('pnpm install', { stdio: 'inherit' });
      logger.info('\\n✅ Success! You can now run the MFE.\\n');
    } catch {
      logger.error('Failed to run pnpm install automatically. Please run it manually.');
    }
  };
}

export default generatorGenerator;

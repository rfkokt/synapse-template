import {
  formatFiles,
  Tree,
  readJson,
  writeJson,
  joinPathFragments,
  logger,
  workspaceRoot,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/react';
import { GeneratorGeneratorSchema } from './schema';
import { execSync } from 'child_process';
import path from 'path';

const SECURITY_OVERRIDES: Record<string, string> = {
  'ajv@8.12.0': '8.18.0',
  'ajv@8.13.0': '8.18.0',
  'koa@3.0.3': '3.1.2',
  'serialize-javascript@6.0.2': '7.0.3',
  'minimatch@3.1.3': '3.1.4',
  'minimatch@5.1.7': '5.1.8',
  'minimatch@9.0.6': '9.0.7',
  'minimatch@10.2.1': '10.2.4',
  'minimatch@10.2.2': '10.2.4',
};

function ensureWorkspaceSecurityOverrides(tree: Tree) {
  const rootPackageJsonPath = 'package.json';
  if (!tree.exists(rootPackageJsonPath)) return;

  const rootPkg = readJson(tree, rootPackageJsonPath);
  const currentOverrides = (rootPkg.pnpm?.overrides ?? {}) as Record<string, string>;

  const hasDiff = Object.entries(SECURITY_OVERRIDES).some(
    ([dep, version]) => currentOverrides[dep] !== version
  );
  if (!hasDiff) return;

  rootPkg.pnpm = rootPkg.pnpm ?? {};
  rootPkg.pnpm.overrides = {
    ...currentOverrides,
    ...SECURITY_OVERRIDES,
  };
  writeJson(tree, rootPackageJsonPath, rootPkg);
  logger.info('Applied workspace security overrides for transitive dependencies.');
}

export async function generatorGenerator(tree: Tree, options: GeneratorGeneratorSchema) {
  // eslint-disable-next-line no-undef
  const cwd = path.resolve(process.cwd());
  const root = path.resolve(workspaceRoot);
  if (cwd !== root) {
    throw new Error(
      `Generator ini wajib dijalankan dari workspace root.\nCurrent: ${cwd}\nExpected: ${root}\n\nGunakan:\n  cd ${root}\n  pnpm nx g @synapse/tools:mfe ${options.name} --port=${options.port}`
    );
  }

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

  // 4. Overwrite App.tsx with Nested Routing Best Practices
  const appTsxContent = `import { Routes, Route, Link } from 'react-router-dom';
import { Card, CardContent, Button } from '@synapse/ui-kit';
import { SharedOriginGuard } from '@synapse/shared-types';

function Dashboard() {
  return (
    <Card variant="elevated" className="bg-white">
      <CardContent className="p-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-4">
          Hello from ${mfeName}!
        </h1>
        <p className="text-neutral-600 mb-6">
          This Micro Frontend was auto-generated by the internal platform generator.
        </p>
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-primary-800">Status</span>
          <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
            Federated & Ready
          </span>
        </div>
        <Link to="detail">
          <Button variant="default">Test Nested Routing</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function Detail() {
  return (
    <Card variant="elevated" className="bg-white">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Detail Page</h1>
        <p className="text-neutral-600 mb-6">
          This page proves that sub-routing inside the MFE works independently of the Shell!
        </p>
        <Link to="..">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function App() {
  return (
    <SharedOriginGuard>
      <div className="p-8">
        {/*
          MFE Routing Best Practice: 
          Always use <Routes> for internal navigation. Do NOT wrap this in <BrowserRouter>. 
          The Shell takes care of the <BrowserRouter>.
        */}
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="detail" element={<Detail />} />
        </Routes>
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
  const mainTsxContent = `import { StrictMode, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@synapse/shared-types';
import './styles.css';
import { App } from './App';

function StandaloneAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DEV_USERNAME = 'dev@synapse.local';
  const DEV_PASSWORD = 'password123';

  const handleStandaloneLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().toLowerCase() !== DEV_USERNAME || password !== DEV_PASSWORD) {
      setError('Invalid username or password.');
      return;
    }

    useAuthStore.getState().setAuth({
      id: 'dev-user',
      name: 'Developer (MFE Local)',
      email: DEV_USERNAME,
      role: 'developer',
    });
  };

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Standalone Access</h2>
          <p className="text-sm text-neutral-500 mb-6">
            This MFE runs in isolated development mode. Login locally to continue.
          </p>
          <form className="space-y-3 text-left" onSubmit={handleStandaloneLogin}>
            <div>
              <label htmlFor="standalone-username" className="block text-xs font-medium text-neutral-600 mb-1">
                Username
              </label>
              <input
                id="standalone-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="standalone-password" className="block text-xs font-medium text-neutral-600 mb-1">
                Password
              </label>
              <input
                id="standalone-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter password"
              />
            </div>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Login Standalone
            </button>
          </form>
          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-left">
            <p className="text-xs font-semibold text-neutral-700 mb-1">Dev Credentials (Standalone):</p>
            <p className="text-xs text-neutral-600">
              Username: <code className="bg-neutral-200 px-1 rounded">dev@synapse.local</code>
            </p>
            <p className="text-xs text-neutral-600">
              Password: <code className="bg-neutral-200 px-1 rounded">password123</code>
            </p>
          </div>
        </div>
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
      typecheck: 'tsc --noEmit',
      lint: 'eslint .',
    },
    dependencies: {
      '@synapse/mock-api': 'workspace:*',
      '@synapse/ui-kit': 'workspace:*',
      '@synapse/shared-components': 'workspace:*',
      '@synapse/shared-monitoring': 'workspace:*',
      '@synapse/shared-types': 'workspace:*',
      '@synapse/shared-api': 'workspace:*',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'react-router-dom': '^7.13.0',
      'react-icons': '^5.5.0',
    },
    devDependencies: {
      '@types/node': '^25.3.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@module-federation/vite': '^1.11.0',
      '@tailwindcss/vite': '^4.0.0',
      tailwindcss: '^4.0.0',
      '@vitejs/plugin-react': '^4.5.0',
      vite: '^7.3.1',
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

  // 12. Ensure workspace-level security overrides are present for all MFs (existing + new)
  ensureWorkspaceSecurityOverrides(tree);

  await formatFiles(tree);

  return () => {
    // Nx installPackagesTask sometimes skips if it doesn't detect root package.json changes.
    // We enforce it here so the MFE is ready out-of-the-box:
    try {
      logger.info('\\n📦 Running pnpm install to fetch new MFE dependencies...\\n');
      execSync('pnpm install', { stdio: 'inherit', cwd: workspaceRoot });
      logger.info('\\n✅ Success! You can now run the MFE.\\n');
    } catch {
      logger.error('Failed to run pnpm install automatically. Please run it manually.');
    }
  };
}

export default generatorGenerator;

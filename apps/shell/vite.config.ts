import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { RemoteRegistry } from './src/types/remote-registry';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type FederationRemoteConfig = {
  type: 'module';
  name: string;
  entry: string;
};

import { loadEnv } from 'vite';

function loadFederationRemotes(mode: string): Record<string, FederationRemoteConfig> {
  const registryPath = path.resolve(__dirname, './public/remotes.json');
  // Load env variables with VITE_ prefix from the current directory
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  try {
    const raw = fs.readFileSync(registryPath, 'utf-8');
    const registry = JSON.parse(raw) as RemoteRegistry;

    return Object.values(registry.remotes).reduce(
      (acc, remote) => {
        if (!remote.name || !remote.entry) {
          return acc;
        }

        // e.g. "authMfe" -> "VITE_AUTH_MFE_URL"
        // Also supports camelCase/kebab-case mappings by replacing dashes and uppercasing.
        const envKeyName = remote.name
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .replace(/-/g, '_')
          .toUpperCase();
        const envKey = `VITE_${envKeyName}_URL`;

        // Use ENV if available, fallback to remotes.json entry
        const entryUrl = env[envKey] ? `${env[envKey]}/mf-manifest.json` : remote.entry;

        acc[remote.name] = {
          type: 'module',
          name: remote.name,
          entry: entryUrl,
        };
        return acc;
      },
      {} as Record<string, FederationRemoteConfig>
    );
  } catch (error) {
    console.warn(
      '[shell/vite.config] Failed to read remotes.json or process env, using empty remotes map.',
      error
    );
    return {};
  }
}

export default defineConfig(({ mode }) => {
  const federationRemotes = loadFederationRemotes(mode);

  return {
    server: {
      port: 4000,
      origin: 'http://localhost:4000',
    },
    preview: {
      port: 4100,
    },
    resolve: {
      alias: {
        '@synapse/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
        '@synapse/shared-api': path.resolve(__dirname, '../../libs/shared-api/src/index.ts'),
        '@synapse/ui-kit': path.resolve(__dirname, '../../libs/ui-kit/src/index.ts'),
        '@synapse/shared-monitoring': path.resolve(
          __dirname,
          '../../libs/shared-monitoring/src/index.ts'
        ),
        '@synapse/mock-api': path.resolve(__dirname, '../../libs/mock-api/src/index.ts'),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'shell',
        dts: false,
        remotes: federationRemotes,
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
          'react/': { singleton: true },
          'react-dom/': { singleton: true },
          'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
        },
      }),
      visualizer({
        open: false,
        filename: 'dist/apps/shell/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ] as Exclude<import('vite').UserConfig['plugins'], undefined>,
    build: {
      target: 'chrome89',
      modulePreload: false,
      minify: true,
      manifest: true,
    },
  };
});

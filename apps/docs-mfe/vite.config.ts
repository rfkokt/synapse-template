import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Detect monorepo: if ../../libs exists, use local source; otherwise resolve from node_modules
const isMonorepo = existsSync(path.resolve(__dirname, '../../libs'));

export default defineConfig({
  server: {
    port: 4003,
    origin: 'http://localhost:4003',
  },
  preview: {
    port: 4103,
  },
  resolve: {
    alias: isMonorepo
      ? {
          '@synapse/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
          '@synapse/shared-api': path.resolve(__dirname, '../../libs/shared-api/src/index.ts'),
          '@synapse/ui-kit': path.resolve(__dirname, '../../libs/ui-kit/src/index.ts'),
          '@synapse/shared-components': path.resolve(
            __dirname,
            '../../libs/shared-components/src/index.ts'
          ),
          '@synapse/shared-monitoring': path.resolve(
            __dirname,
            '../../libs/shared-monitoring/src/index.ts'
          ),
          '@synapse/mock-api': path.resolve(__dirname, '../../libs/mock-api/src/index.ts'),
        }
      : undefined,
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'docsmfe',
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
        'react-router-dom': { singleton: true, requiredVersion: '^7.0.0' },
        zustand: { singleton: true },
        '@synapse/shared-types': { singleton: true },
      },
    }),
    visualizer({
      open: false,
      filename: 'dist/apps/docs-mfe/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ] as any,
  build: {
    target: 'chrome89',
    modulePreload: false,
    minify: true,
  },
});

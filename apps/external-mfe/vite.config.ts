import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isMonorepo = existsSync(path.resolve(__dirname, '../../libs'));

export default defineConfig({
  server: {
    port: 4005,
    origin: 'http://localhost:4005',
  },
  preview: {
    port: 4105,
  },
  resolve: {
    alias: isMonorepo
      ? {
          '@synapse/shared-api': path.resolve(__dirname, '../../libs/shared-api/src/index.ts'),
          '@synapse/ui-kit': path.resolve(__dirname, '../../libs/ui-kit/src/index.ts'),
          '@synapse/mock-api': path.resolve(__dirname, '../../libs/mock-api/src/index.ts'),
          '@synapse/shared-components': path.resolve(
            __dirname,
            '../../libs/shared-components/src/index.ts'
          ),
          '@synapse/shared-monitoring': path.resolve(
            __dirname,
            '../../libs/shared-monitoring/src/index.ts'
          ),
        }
      : undefined,
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'externalmfe',
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
        zustand: { singleton: true },
        '@synapse/shared-types': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'chrome89',
    modulePreload: false,
    minify: true,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 4001,
    origin: 'http://localhost:4001',
  },
  preview: {
    port: 4101,
  },
  resolve: {
    alias: {
      '@synapse/shared-types': path.resolve(__dirname, '../../libs/shared-types/src/index.ts'),
      '@synapse/shared-api': path.resolve(__dirname, '../../libs/shared-api/src/index.ts'),
      '@synapse/ui-kit': path.resolve(__dirname, '../../libs/ui-kit/src/index.ts'),
      '@synapse/mock-api': path.resolve(__dirname, '../../libs/mock-api/src/index.ts'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'authMfe',
      filename: 'remoteEntry.js',
      manifest: true,
      dts: false,
      exposes: {
        './LoginPage': './src/pages/Login.tsx',
        './RegisterPage': './src/pages/Register.tsx',
        './ProfilePage': './src/pages/Profile.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react/': { singleton: true },
        'react-dom/': { singleton: true },
      },
    }),
    visualizer({
      open: false,
      filename: 'dist/apps/auth-mfe/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ] as Exclude<import('vite').UserConfig['plugins'], undefined>,
  build: {
    target: 'chrome89',
    modulePreload: false,
    minify: true,
  },
});

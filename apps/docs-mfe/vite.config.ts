import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    port: 4003,
    origin: 'http://localhost:4003',
  },
  preview: {
    port: 4103,
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

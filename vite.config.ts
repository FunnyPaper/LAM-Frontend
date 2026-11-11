/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      'lam-frontend': path.resolve(__dirname, './src')
    }
  },
  plugins: [react(), dts({
    insertTypesEntry: true,
    outDir: 'dist',
    tsconfigPath: path.resolve(__dirname, 'tsconfig.dts.json')
  })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'LAMFrontend',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['i18next', 'react-i18next', 'react', 'react-dom', '@mui/icons-material', '@mui/material', '@emotion/react', '@emotion/styled', '@ebay/nice-modal-react', 'monaco-editor', '@monaco-editor/react']
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
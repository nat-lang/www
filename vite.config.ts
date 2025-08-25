/// <reference types="vitest" />
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@nat-lang/nat"]
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        // 
        '/Users/alex/natlang/natc/wasm',
      ],
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})


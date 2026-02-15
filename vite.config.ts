import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get build target from environment variable, default to 'web'
const buildTarget = process.env.BUILD_TARGET || 'web';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BUILD_TARGET': JSON.stringify(buildTarget),
  },
  server: { 
    port: 3000,
    strictPort: false, // Try next available port if 3000 is taken
  },
  build: {
    outDir: buildTarget === 'web' ? 'dist/web' : 'dist/app',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        'dist/',
      ],
    },
  },
});

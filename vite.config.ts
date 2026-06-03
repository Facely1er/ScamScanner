import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildTarget = process.env.BUILD_TARGET || 'app';

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
    outDir: 'dist',
  },
});

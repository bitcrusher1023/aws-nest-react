import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: '/index.tsx',
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': 'http://localhost:5333',
    },
  },
});

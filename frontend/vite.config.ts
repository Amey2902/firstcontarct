import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    target: 'esnext',
    minify: true,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, './src/icons.tsx'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
  },
});


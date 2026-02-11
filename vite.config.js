import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/brewbooks/', // Change this to your GitHub repo name
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: true, // Allows mobile testing on local network
    port: 5173
  }
});

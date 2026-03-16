import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/pomodoro/',
  plugins: [react()],
  resolve: {
    alias: {
      '@pomodoro/shared': path.resolve(__dirname, '../shared'),
    },
  },
});

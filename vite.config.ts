import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React core — smallest possible critical chunk
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/') ||
            id.includes('/scheduler/')
          ) return 'react-core';

          // Framer Motion — needed for animations but separate from UI
          if (id.includes('framer-motion')) return 'framer';

          // HeroUI + its peer deps (react-aria, react-stately, etc.)
          if (
            id.includes('@heroui/') ||
            id.includes('@nextui-org/') ||
            id.includes('@react-aria/') ||
            id.includes('@react-stately/') ||
            id.includes('@internationalized/')
          ) return 'heroui';

          // GSAP — only used for counters, loaded on scroll
          if (id.includes('gsap')) return 'gsap';

          // Supabase
          if (id.includes('@supabase/')) return 'supabase';
        },
      },
    },
  },
});

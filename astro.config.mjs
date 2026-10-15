import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['red-mole-10.loca.lt'] },
  },
});

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Served from https://<user>.github.io/multichannel-serial-console/ on GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/multichannel-serial-console/' : '/',
  plugins: [vue()],
}))

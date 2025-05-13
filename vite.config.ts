import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginVueDevTools from 'vite-plugin-vue-devtools'
import VueSetup from 'vite-plugin-vue-setup-extend'
import mkcert from 'vite-plugin-mkcert'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mkcert(),
    VitePluginVueDevTools(),
    VueSetup(),
  ],
  server:{
    port:3000,
    host: true,
  },
  resolve:{
    alias:{
      "@": path.resolve(process.cwd(), 'src'),
    }
  }
})

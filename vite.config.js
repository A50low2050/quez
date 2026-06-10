import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pluginPurgeCss from 'vite-plugin-purgecss'
import prefixwrap from 'postcss-prefixwrap'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), pluginPurgeCss()],
  // css: {
  //   postcss: {
  //     plugins: [
  //       prefixwrap('.my-landing-wrapper', {
  //         excludedSelectors: ['html', 'body', ':root'],
  //       }),
  //     ],
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

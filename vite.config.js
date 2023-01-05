import { defineConfig } from 'vite'
import vitePluginRequire from 'vite-plugin-require'

export default defineConfig({
  plugins: [vitePluginRequire],
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        index: 'src/index.html',
        fullscreen: 'src/fullscreen.html',
        'map-viewer': 'src/map-viewer.js',
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js'
      }
    }
  },
  publicDir: 'public',
  preview: {
    port: 1234
  },
  server: {
    port: 1234
  }
})

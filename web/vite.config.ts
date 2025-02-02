import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    tsDecorators: true
  })],
  server: {
    host: true
  },
  build: {
    minify: 'terser', // Usa Terser em vez do esbuild
    terserOptions: {
      sourceMap: false,
      compress: {
        drop_console: true, // Remove console.logs
      },
      mangle: {
        keep_classnames: false, // Ofusca nomes de classes
        keep_fnames: false, // Ofusca nomes de funções
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set VITE_BASE_PATH when building for a subpath deploy (e.g. GitHub Pages
  // project sites at https://<user>.github.io/<repo>/). Defaults to root,
  // which is what the FastAPI-served production build needs (see Dockerfile).
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  server: {
    proxy: {
      '/faces': 'http://localhost:8000',
      '/products': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})

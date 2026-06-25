import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ghar Pahuch Seva',
        short_name: 'GharPahuch',
        description: 'Book trusted home service professionals in Chhindwara',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Precache only the static app shell (build output). We deliberately
        // do NOT runtime-cache API responses: those include authenticated PII
        // (bookings, payment history, profile) and caching them in the service
        // worker would leave that data readable in Cache Storage after logout,
        // especially on shared devices. Keep dynamic data network-only.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})

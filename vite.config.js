import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'primary-logo.png', 'secondary-logo.png'],
      manifest: {
        name: 'Foodie Finder Web App',
        short_name: 'Foodie Finder',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/primary-logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/secondary-logo.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})

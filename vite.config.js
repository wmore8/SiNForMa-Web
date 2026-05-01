import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  envPrefix: 'SINFORMA_',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sprite.svg'], // Archivos estaticos offline
      manifest: {
        name: 'SiNForMa Web Development Version',
        short_name: 'SiNForMa',
        description: 'SiNForMa Web Development y PWA',
        theme_color: '#32DE84',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'proto_icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',

          },
          {
            src: 'proto_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
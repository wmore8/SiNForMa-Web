import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  // Cargamos las variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  const isDebug = env.SINFORMA_MODO_DEBUG === 'true';

  // Definimos el prefijo dinámico
  const iconPrefix = isDebug ? 'dev_icon' : 'app_icon';

  return {
    envPrefix: 'SINFORMA_',
    plugins: [
      react(),
      // Mini-plugin custom de Vite para modificar el HTML al vuelo
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%ICON_PREFIX%/g, iconPrefix);
        }
      },
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
          suppressWarnings: true
        },
        includeAssets: ['sprite.svg'], // Archivos estaticos offline
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 4000000
        },
        manifest: {
          name: 'SiNForMa Web Development Version',
          short_name: 'SiNForMa',
          description: 'SiNForMa Web Development y PWA',
          theme_color: '#000000',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          id: '/',
          icons: [
            {
              src: `${iconPrefix}_x192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',

            },
            {
              src: `${iconPrefix}_x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
  }
})
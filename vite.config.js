import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Force Babel transform — OXC (default in v6) chokes on
      // template literals with ${} expressions inside JSX expressions.
      babel: {
        plugins: [],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['NewLogo.png', 'favicon.png', 'pwa-icons/*.png'],
      manifest: {
        name: 'CareerMitra – Govt Job Alerts 2026',
        short_name: 'CareerMitra',
        description: 'Find the latest Government Jobs, Internships & Career Opportunities across India. Get real-time alerts and apply directly.',
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en-IN',
        categories: ['education', 'business', 'productivity'],
        icons: [
          {
            src: 'pwa-icons/icon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-icons/icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'pwa-icons/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/home-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'CareerMitra Home Page',
          },
          {
            src: 'screenshots/home-mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'CareerMitra on Mobile',
          },
        ],
        shortcuts: [
          {
            name: 'Latest Jobs',
            short_name: 'Jobs',
            description: 'Browse latest government jobs',
            url: '/jobs',
            icons: [{ src: 'pwa-icons/icon-96x96.png', sizes: '96x96' }],
          },
          {
            name: 'Login',
            short_name: 'Login',
            description: 'Sign in to your account',
            url: '/login',
            icons: [{ src: 'pwa-icons/icon-96x96.png', sizes: '96x96' }],
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB (AMCharts bundle is large)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/careermitra\.in\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'careermitra-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],

  port: 3005,
  server: {
    port: 3005,
    proxy: {
      '/api': {
        target: 'https://www.careermitra.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

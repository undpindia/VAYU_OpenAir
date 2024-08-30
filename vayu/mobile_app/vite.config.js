import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'VAYU',
        name: 'VAYU',
        icons: [
          {
            src: '/img/pwa-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/img/pwa-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        scope: '/',
        orientation: 'portrait',
        description: 'Survey application',
        id: 'vayu',
        display_override: ['fullscreen', 'window-controls-overlay'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          // {
          //   urlPattern: ({ url }) => {
          //     return url.pathname.startsWith('/vayu');
          //   },
          //   handler: 'NetworkFirst',
          //   options: {
          //     cacheName: 'api-cache',
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   },
          // },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // {
          //   urlPattern: ({ url }) => {
          //     return url.pathname.startsWith('/vayu');
          //   },
          //   handler: 'CacheFirst',
          //   options: {
          //     cacheName: 'build-cache',
          //     cacheableResponse: {
          //       statuses: [0, 200],
          //     },
          //   },
          // },
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      // static assets in the public folder
      includeAssets: ['**/*.{js,css,html,ico,png,svg}'],
    }),
  ],
  base: '/',
});

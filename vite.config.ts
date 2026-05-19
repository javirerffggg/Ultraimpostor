import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import crypto from 'node:crypto';

// Polyfill global crypto for Node environments where it is not globally exposed
if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: crypto.webcrypto,
    writable: true,
    configurable: true,
  });
}
if (typeof global.crypto === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: crypto.webcrypto,
    writable: true,
    configurable: true,
  });
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'El Impostor Pro Ultra',
        short_name: 'ImpostorPro',
        description: 'Aplicación de deducción social premium.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
});
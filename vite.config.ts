import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { viteCompression } from 'vite-plugin-compression'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  try {
    return {
      plugins: [
        react(),
        viteTsconfigPaths(),
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
        }),
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
        }),
      ],
      server: {
        port: 3000,
        open: true,
        proxy: {
          // Proxy API requests if needed
          // '/api': {
          //   target: 'http://your-api-endpoint.com',
          //   changeOrigin: true,
          //   secure: false,
          // },
        },
      },
      build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks: {
              three: ['three'],
              gsap: ['gsap'],
              framerMotion: ['framer-motion'],
              emailjs: ['@emailjs/browser'],
              vendor: [
                'react',
                'react-dom',
              ],
              app: [
                path.resolve(__dirname, 'src/main.tsx'),
                path.resolve(__dirname, 'src/App.tsx'),
              ],
            },
          },
        },
      },
      optimizeDeps: {
        include: ['three', 'gsap', 'framer-motion', '@emailjs/browser'],
      },
    }
  } catch (error) {
    console.error('Vite configuration error:', error)
    throw error
  }
})
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const devPort = parseInt(env.VITE_DEV_PORT || '5174', 10)
  const prodPort = parseInt(env.VITE_PROD_PORT || '5174', 10)
  const apiBaseUrl = env.VITE_API_BASE_URL 
  
  const port = mode === 'production' ? prodPort : devPort

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: port,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', () => {});
            proxy.on('proxyReq', () => {});
            proxy.on('proxyRes', () => {});
          },
        },
        '/uploads': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', () => {});
            proxy.on('proxyReq', () => {});
            proxy.on('proxyRes', () => {});
          },
        },
      },
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Define all routes that should get their own HTML file
const routes = [
  '/',
  '/login',
  '/register',
  '/pc-repair',
  '/mobile-repair',
  '/reviews',
  '/schedule',
  '/payment',
  '/payment-success',
  '/technicians',
  '/account',
  '/history',
  '/favorites',
  '/settings',
  '/compare',
  '/terms',
  '/privacy',
  '/services',
  '/support',
  '/company',
  '/bidding',
  '/admin',
  '/technician-dashboard',
  '/customer-dashboard'
]

// Plugin to generate separate HTML files for each route after build
function generateRouteHtmlPlugin() {
  return {
    name: 'generate-route-html',
    closeBundle: async () => {
      const distPath = path.resolve(process.cwd(), 'dist')
      const indexHtmlPath = path.join(distPath, 'index.html')

      // Read the main index.html content
      if (!fs.existsSync(indexHtmlPath)) {
        console.error('index.html not found in dist folder')
        return
      }

      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')

      // Generate HTML file for each route
      for (const route of routes) {
        if (route === '/') continue // Skip root, already has index.html

        const routePath = route.slice(1) // Remove leading slash
        const routeDir = path.join(distPath, routePath)

        // Create directory if it doesn't exist
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true })
        }

        // Write index.html for this route
        const routeHtmlPath = path.join(routeDir, 'index.html')
        fs.writeFileSync(routeHtmlPath, indexHtml)
        console.log(`✅ Created: ${routePath}/index.html`)
      }

      console.log(`\n🎉 Generated ${routes.length - 1} route HTML files!`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-utils': ['date-fns', 'axios', 'lucide-react'],
        }
      }
    }
  }
})

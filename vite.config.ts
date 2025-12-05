import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icon.png'],
            manifest: {
                name: 'Sarvasva - Fitness Tracker',
                short_name: 'Sarvasva',
                description: 'Personalized Lifestyle & Fitness Tracker',
                theme_color: '#6366f1',
                background_color: '#020617',
                display: 'standalone',
                icons: [
                    {
                        src: 'icon.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
})

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Palette
                'brand-primary': '#6366f1', // Indigo 500
                'brand-secondary': '#8b5cf6', // Violet 500
                'brand-accent': '#ec4899', // Pink 500

                // Functional
                'success': '#10b981', // Emerald 500
                'warning': '#f59e0b', // Amber 500
                'danger': '#ef4444', // Red 500

                // Glass / Surface
                'glass-surface': 'rgba(255, 255, 255, 0.08)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                'glass-highlight': 'rgba(255, 255, 255, 0.2)',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                'neon': '0 0 20px rgba(99, 102, 241, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}

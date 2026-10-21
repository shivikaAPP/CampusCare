/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1120',      // Deep navy background
          darker: '#070C18',    // Ultra deep navy
          card: '#111B32',      // Glass card base
          cardHover: '#162342', // Card hover state
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#3B82F6',      // Electric blue primary
          blueLight: '#60A5FA', // Light electric blue
          cyan: '#06B6D4',      // Electric cyan accent
          indigo: '#6366F1',    // Tech indigo
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

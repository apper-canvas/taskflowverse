/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f4ff",
          500: "#5B21B6",
          600: "#7C3AED",
          700: "#5B21B6",
        },
        accent: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        surface: "#F9FAFB",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6"
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scale-in': 'scaleIn 0.15s ease-out',
        'check-draw': 'checkDraw 0.3s spring',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        checkDraw: {
          '0%': { 'stroke-dasharray': '0 20', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { 'stroke-dasharray': '20 20', transform: 'scale(1)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
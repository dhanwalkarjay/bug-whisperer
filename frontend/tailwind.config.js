/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Case board theme
        board: {
          bg: '#1a1612',
          card: '#2a2318',
          border: '#3d3425',
          accent: '#4a3f2f',
          pin: '#8b7355',
          text: '#d4c5a9',
          muted: '#9a8b6f',
          highlight: '#e8d5a3',
        },
        // Role colors
        crime: '#ef4444',
        suspect: '#f59e0b',
        accomplice: '#3b82f6',
        redherring: '#6b7280',
        // Confidence
        high: '#22c55e',
        medium: '#f59e0b',
        low: '#ef4444',
      },
      fontFamily: {
        detective: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pin': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'pin-hover': '0 8px 30px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(232, 213, 163, 0.15)',
      },
      animation: {
        'pin-drop': 'pinDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'draw-line': 'drawLine 0.8s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'stamp': 'stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        pinDrop: {
          '0%': { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(232, 213, 163, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(232, 213, 163, 0.25)' },
        },
        stamp: {
          '0%': { transform: 'scale(1.5) rotate(-5deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

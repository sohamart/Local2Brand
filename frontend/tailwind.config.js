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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary Accent
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f5f7',
          200: '#e5e7eb',
          300: '#d1d5db',
          800: '#1e293b',
          900: '#0f172a',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.75)',
          medium: 'rgba(255, 255, 255, 0.85)',
          heavy: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(255, 255, 255, 0.6)',
          borderDark: 'rgba(0, 0, 0, 0.08)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'btn': '16px',
        'card': '28px',
        'panel': '32px',
        'hero': '40px',
        'modal': '32px',
      },
      boxShadow: {
        'glass-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        'glass': '0 12px 36px -4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.9) inset, 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'glass-lg': '0 20px 50px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.95) inset, 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'glass-highlight': '0 24px 60px -12px rgba(37, 99, 235, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.95) inset',
        'floating': '0 30px 70px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

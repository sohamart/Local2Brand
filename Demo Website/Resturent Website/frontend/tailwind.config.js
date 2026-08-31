/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #e63946)',
          primaryHover: 'var(--brand-primary-hover, #d62828)',
          secondary: 'var(--brand-secondary, #f4a261)',
          accent: 'var(--brand-accent, #2a9d8f)',
          dark: 'var(--brand-dark, #0f1117)',
          darkSurface: 'var(--brand-dark-surface, #181b24)',
          darkBorder: 'var(--brand-dark-border, #2a2e3d)',
          light: 'var(--brand-light, #fafafa)',
          lightSurface: 'var(--brand-light-surface, #ffffff)',
          lightBorder: 'var(--brand-light-border, #e5e7eb)',
          gold: '#dfa645',
          goldDark: '#b8860b'
        }
      },
      fontFamily: {
        heading: ['var(--font-heading, "Playfair Display")', 'serif'],
        body: ['var(--font-body, "Outfit")', 'sans-serif'],
        accent: ['var(--font-accent, "Cinzel")', 'serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-glow': '0 0 25px var(--brand-primary-glow, rgba(230, 57, 70, 0.25))',
        'gold-glow': '0 0 30px rgba(223, 166, 69, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#FAFAF7',
        surface: '#FFFFFF',
        'surface-2': '#F4F3EE',
        border: '#E8E5DC',
        ink: '#1A1814',
        'ink-2': '#6B6760',
        accent: '#E8860A',
        'accent-light': '#FEF3E2',
        green: '#2D7A4F',
        'green-light': '#E8F5EE',
        red: '#C0392B',
        'red-light': '#FDECEA',
        blue: '#1A56DB',
        'blue-light': '#EBF0FF',
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,24,20,0.06), 0 4px 16px rgba(26,24,20,0.04)',
        elevated: '0 8px 32px rgba(26,24,20,0.10)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        'page-enter': 'pageEnter 250ms ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

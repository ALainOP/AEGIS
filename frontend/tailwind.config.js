/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          orange: '#C8500A', 'orange-dk': '#A03E08', 'orange-lt': '#E06020',
          navy: '#1B3A6B', 'navy-dk': '#122A52', 'navy-lt': '#2A5298',
          brown: '#7B3200', 'brown-dk': '#5A2500',
          bg: '#EEF4F8', card: '#FFFFFF', section: '#DAE8F2',
        },
        ts: {
          base: '#080D18', 'surf-0': '#0D1425', 'surf-1': '#121C30', 'surf-2': '#172236',
          amber: '#C9861A', red: '#B83232', teal: '#2A7F76', cyan: '#3EA8C4',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      borderRadius: { none: '0', sm: '2px', DEFAULT: '3px', md: '4px', lg: '6px' },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: { 'fade-in': 'fadeIn 0.2s ease-out' },
    },
  },
  plugins: [],
}
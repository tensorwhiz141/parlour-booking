/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          50: '#fdf7f1',
          100: '#fbead8',
          200: '#f7d5b5',
          300: '#f3bc87',
          400: '#ee9f5a',
          500: '#ea8a39',
          600: '#d7691d',
          700: '#b34f19',
          800: '#91401b',
          900: '#77371b',
          950: '#451b0c',
        },
        accent: {
          50: '#f5f9ff',
          100: '#ebf3ff',
          200: '#d6e6ff',
          300: '#b5d1ff',
          400: '#8fb5ff',
          500: '#6495ff',
          600: '#4570f4',
          700: '#3758db',
          800: '#3048b1',
          900: '#2d4089',
          950: '#1e2652',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
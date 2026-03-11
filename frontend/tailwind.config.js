/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#111827',
          600: '#0f172a'
        },
        accent: '#f59e0b'
      }
    }
  },
  plugins: []
};

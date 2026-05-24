/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          900: '#1a1005',
          800: '#2d1e0f',
          700: '#4a3219',
          600: '#6a4a2a',
          500: '#8c6239',
        },
        africa: {
          red: '#d94126',
          orange: '#f28e2b',
          yellow: '#f2c94c',
          green: '#2e7d32',
        }
      }
    },
  },
  plugins: [],
}

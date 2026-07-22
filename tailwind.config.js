/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#E50914',
        darkBg: '#000000',
        darkSurface: '#141414',
        darkCard: '#1E1E1E',
      },
    },
  },
  plugins: [],
}

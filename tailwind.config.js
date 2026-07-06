/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enables toggling dark mode using a class (e.g., class="dark") on the parent element
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color configurations based on your design system requirements
        brand: '#E50914',       // Primary Cinematic Red
        darkBg: '#000000',      // Deep Black Background
        darkSurface: '#141414', // Secondary Dark Gray
        darkCard: '#1E1E1E',    // Component Card Fill
      },
    },
  },
  plugins: [],
}
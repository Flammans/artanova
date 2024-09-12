/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{tsx,ts}"
  ],
  theme: {
    extend: {
      // Custom colors
      colors: {
        primary: '#000000',  // Black
        secondary: '#ffffff',  // White
        accent: '#d4af37',  // Gold
        dark: '#242424' // Brown Dark
      },
      // Custom fonts
      fontFamily: {
        serif: ['Playfair Display', 'serif'],  // For headings
        sans: ['Roboto', 'sans-serif'],  // For body text
      },
    },
  },
  plugins: [],
}



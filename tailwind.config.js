/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      // Custom colors
      colors: {
        primary: '#000000',  // Black
        secondary: '#EEEEEE',  // White
        accent: '#d4af37',  // Gold
        dark: '#242424', // Brown Dark
        'red-light': '#B22222',  // Firebrick
        'red-dark': '#8B0000',   // Dark Red
      },
      // Custom fonts
      fontFamily: {
        serif: ['Playfair Display', 'serif'],  // For headings
        sans: ['Roboto', 'sans-serif'],  // For body text
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  variants: {
    extend: {
      transform: ['hover', 'focus'],
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '::-webkit-scrollbar': {
          width: '12px',
        },
        '::-webkit-scrollbar-track': {
          background: '#242424',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#d4af37',
          borderRadius: '6px',
          border: '2px solid #242424',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4af37 #242424',
        },
        '::selection': {
          backgroundColor: '#d4af37',
          color: '#000000',
        },
        '::-moz-selection': {
          backgroundColor: '#d4af37',
          color: '#000000',
        },
      });
    },
  ],
};



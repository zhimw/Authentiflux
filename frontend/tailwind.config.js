/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          darkGold: '#B8941F',
          black: '#1a1a1a',
          gray: '#2d2d2d',
        }
      }
    },
  },
  plugins: [],
}


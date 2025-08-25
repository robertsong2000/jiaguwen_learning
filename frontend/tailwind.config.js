/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ancient-brown': '#8B4513',
        'vermillion': '#FF4500',
        'ivory': '#FFFFF0',
        'dark-green': '#2F4F4F',
        'gold': '#FFD700',
      },
      fontFamily: {
        'chinese': ['Noto Sans SC', 'sans-serif'],
        'oracle': ['Oracle Bone Script Font', 'serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    },
  },
  plugins: [],
}
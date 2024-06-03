/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      boxShadow: {
        'brutal-blue': '8px 8px 0px rgba(0, 0, 139, 1)', 
      },
      fontFamily: {
        'cornelia-sans': '"cornelia-sans"',
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102a2e',
        lagoon: '#0f766e',
        mist: '#eef8f6',
        sun: '#f4b942',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 118, 110, .12)',
      },
    },
  },
  plugins: [],
}

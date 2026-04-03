/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cn-dark': '#1c1c1e',
        'cn-muted': '#6c6a66',
        'cn-bg': '#ecebe7',
        'cn-verified': 'rgba(111, 207, 151, 0.92)',
      },
    },
  },
  plugins: [],
}


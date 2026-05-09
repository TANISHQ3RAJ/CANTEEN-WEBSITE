/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5A5F',
        secondary: '#00A699',
        accent: '#FC642D',
        dark: '#484848',
        light: '#F5F5F5'
      }
    },
  },
  plugins: [],
}

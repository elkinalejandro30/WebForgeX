/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        darker: '#0f172a',
        pageBg: 'var(--color-bg)',
        pageText: 'var(--color-text)',
      }
    },
  },
  plugins: [],
}
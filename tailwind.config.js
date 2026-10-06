/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-bg': '#008080',      // Hijau Teal klasik Windows 95
        'retro-gray': '#c0c0c0',    // Abu-abu klasik
        'retro-dark': '#808080',
        'retro-light': '#ffffff',
        'retro-blue': '#000080',    // Navy titlebar
        'retro-blue-light': '#1084d0',
      },
      fontFamily: {
        retro: ['"MS Sans Serif"', 'Tahoma', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
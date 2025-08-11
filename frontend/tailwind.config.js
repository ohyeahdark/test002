/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Thêm .ts và .tsx vào đây
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fade: 'fade 0.4s ease-in-out',
      },
    }
  },
  plugins: [],
  darkMode: 'class',
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- PERBAIKAN ANIMASI ---
      // Kita mendefinisikan nilai bayangan sebagai variabel CSS
      // agar kita bisa menggunakannya di framer-motion
      boxShadow: {
        'card': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 30px -5px rgba(59, 130, 246, 0.2)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 40px -6px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
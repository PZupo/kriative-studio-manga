/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- ESSENCIAL: Permite alternar entre dark/light via botão
  theme: {
    extend: {
      colors: {
        // Mapeando as cores "brand-*" usadas no seu código
        brand: {
          orange: '#f97316', // Laranja vibrante
          teal: '#14b8a6',   // Verde-azulado (Teal)
          purple: '#8b5cf6', // Roxo
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
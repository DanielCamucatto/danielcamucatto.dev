import typography from "@tailwindcss/typography";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,md,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita o modo dark baseado em classe
  theme: {
    extend: {},
  },
  plugins: [typography],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        mont: ['Montserrat', 'sans-serif'],
        source: ['Source Serif Pro', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          light: '#f9fafc',
          dark: '#f3f4f6',
          text: '#000',
          post: '#242424',
          // DEFAULT: '#0e1116',
          // light: '#1c1f26',
          // dark: '#0b0d11',
          // text: '#ffffff'
        },
        secondary: {
          DEFAULT: '#282b35',
          light: '#6a7180',
          dark: '#1f222a',
        },
        accent: {
          DEFAULT: '#e2e2e6',
          light: '#f5f5f7',
          dark: '#c5c5c9',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#6a7180',
        },
        border: {
          DEFAULT: '#1c1f26',
          light: '#282b35',
        },
      },
    },
  },
  plugins: [],
}


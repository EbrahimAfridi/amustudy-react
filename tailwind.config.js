/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e1116',
          light: '#1c1f26',
          dark: '#0b0d11',
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


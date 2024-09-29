/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        widest: '0.6em'
      },
      colors: {
        'primary': '#FF5380',
        'faint-primary': '#fffafc',
      },
    },
  },
  plugins: [],
}


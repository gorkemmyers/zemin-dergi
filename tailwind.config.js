/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F5F0',
        hero: '#4E141E',
        ink: '#1A1A1A',
        sage: '#5E7362',
        'sage-light': '#8CA090',
        hairline: '#E3DDD3',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zemin: {
          kagit: '#F7F2E7',
          kagitkoyu: '#EFE7D6',
          murekkep: '#211F1B',
          murekkepacik: '#514C43',
          kil: '#C1502E',
          kilkoyu: '#8F3A20',
          hardal: '#C99A2E',
          hardalkoyu: '#93701D',
          gece: '#33505A',
          gecekoyu: '#22383F',
          cizgi: '#E1D8C4',
        },
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

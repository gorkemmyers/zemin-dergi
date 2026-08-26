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
          bej: '#FBF7EF',        // Ana Zemin (daha açık)
          kagit: '#F2ECDF',      // Kart Zemin (bg'den bir ton koyu, katman hissi verir)
          bordo: '#4E141E',
          bordokoyu: '#380B13',
          yesil: '#2D4F38',
          yesilacik: '#3E654B',
          metin: '#1F1E1B',
          cizgi: '#DDD7CA',
          // Kategori aksan renkleri
          turuncu: '#C9713E',     // Felsefe
          turuncukoyu: '#8F4E29',
          hardal: '#B98B2E',      // Sosyoloji
          hardalkoyu: '#805F1E',
          mavi: '#3E5C74',        // Psikoloji
          mavikoyu: '#2A3F50',
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

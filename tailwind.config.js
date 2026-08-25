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
          bej: '#F5F2EB',       // %60 Ana Zemin
          kagit: '#EFECE3',     // Kart / İkincil Zemin
          bordo: '#4E141E',     // %30 Gövde & Manşet
          bordokoyu: '#380B13', // Koyu Bordo (Buton hover / Vurgu)
          yesil: '#2D4F38',     // %10 Yosun Yeşili Vurgu
          yesilacik: '#3E654B', // Açık Yeşil Etiket
          metin: '#1F1E1B',     // Koyu İsli Mürekkep
          cizgi: '#DDD7CA',     // Gazete Ayracı Çizgisi
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

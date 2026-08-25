import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'ZEMİN — Öğrenci Düşünce & Teori Arşivi',
  description: 'Felsefe, Sosyoloji ve Psikoloji Alanlarında Bağımsız Öğrenci Yazıları',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#1A1A1A]">
        {/* Header */}
        <header className="border-b border-[#E3DDD3] sticky top-0 bg-[#F7F5F0]/90 backdrop-blur-md z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex flex-col">
              <span className="font-editorial text-2xl md:text-3xl tracking-tight font-bold text-[#1A1A1A]">
                ZEMİN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#5E7362] font-semibold">
                Öğrenci Düşünce & Teori Arşivi
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/80">
              <Link href="/" className="hover:text-[#4E141E] transition-colors">Yazılar</Link>
              <Link href="/dergiler" className="hover:text-[#4E141E] transition-colors">Dergiler</Link>
              <Link href="/yazarlar" className="hover:text-[#4E141E] transition-colors">Yazarlar</Link>
              <Link href="/sss" className="hover:text-[#4E141E] transition-colors">SSS</Link>
            </nav>

            <Link
              href="/basvuru"
              className="bg-[#1A1A1A] hover:bg-[#4E141E] text-[#F7F5F0] px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              + Yazı Gönder
            </Link>
          </div>
        </header>

        {/* Ana İçerik */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E3DDD3] mt-20 py-12 bg-[#F7F5F0]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="font-editorial font-bold text-xl text-[#1A1A1A]">ZEMİN</span>
              <p className="text-xs text-[#1A1A1A]/60">
                Tüm yazıların fikri mülkiyeti ve sorumluluğu yazarlarına aittir.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/70">
              <Link href="/basvuru" className="hover:text-[#4E141E]">Yayın İlkeleri</Link>
              <Link href="/admin" className="hover:text-[#4E141E]">Editör Girişi</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

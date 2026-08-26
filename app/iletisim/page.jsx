'use client';
import Link from 'next/link';

export default function IletisimPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-16">
        
        {/* ÇİFT KATMANLI HAMBURGERSİZ CAM NAVBAR */}
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Açık Düşünce
              </span>
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="hover:text-[#00a693] transition-colors flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="text-[#00a693] flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* İLETİŞİM PANELİ */}
        <div className="glass-card p-6 md:p-10 border border-white/80 shadow-xl space-y-6">
          <header className="border-b border-gray-200/60 pb-4 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#00a693] font-black">Hakkımızda & İletişim</span>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mt-1">
              Açık Düşüncenin <span className="text-[#74112f]">Zemini</span>
            </h1>
          </header>

          <div className="space-y-3 text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
            <p>
              <strong>ZEMİN</strong>; felsefe, sosyoloji ve psikoloji alanlarında eleştirel, bağımsız ve açık fikir üretimini destekleyen dijital bir düşünce inisiyatifidir.
            </p>
            <p>
              Dijital arşiv ve tematik e-dergi sayıları ile genç araştırmacıların ve düşünce üretenlerin metinlerini kalıcı bir mecrada buluşturur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="glass-panel p-4 bg-white/50 border border-white">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#32127a] block mb-1">Editoryal E-Posta</span>
              <p className="text-xs sm:text-sm font-bold text-gray-900">iletisim@zemindergi.com</p>
            </div>

            <div className="glass-panel p-4 bg-white/50 border border-white">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00a693] block mb-1">Sosyal Medya</span>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#74112f] transition-colors block"
              >
                Instagram / @zemindergi ↗
              </a>
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#74112f] tracking-tighter mr-2">ZEMİN</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

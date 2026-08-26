'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function IletisimPage() {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <nav className="glass-panel mx-auto max-w-4xl px-6 py-3.5 mb-8 md:mb-12 flex justify-between items-center sticky top-4 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
            ZEMİN
          </Link>
          
          <div className="hidden md:flex gap-7 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" className="text-[#00a693]">İletişim</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/basvuru" className="hidden sm:inline-block bg-[#32127a] text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20">
              METİN GÖNDER
            </Link>
            <button 
              onClick={() => setMenuAcik(!menuAcik)}
              className="md:hidden p-2 rounded-full text-gray-800 hover:bg-white/50"
              aria-label="Menü"
            >
              {menuAcik ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {/* MOBİL MENÜ */}
        {menuAcik && (
          <div className="md:hidden glass-panel p-6 mb-8 flex flex-col gap-4 text-center text-sm font-bold text-gray-800 shadow-xl">
            <Link href="/" onClick={() => setMenuAcik(false)}>Ana Sayfa</Link>
            <Link href="/yazilar" onClick={() => setMenuAcik(false)}>Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)}>Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)}>Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)} className="text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" onClick={() => setMenuAcik(false)} className="bg-[#32127a] text-white py-2.5 rounded-full text-xs">
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* İLETİŞİM & MANİFESTO KARTI */}
        <div className="glass-card p-6 md:p-12 border border-white/80 shadow-2xl space-y-8">
          
          <header className="border-b border-gray-200/60 pb-6 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-[#00a693] font-black">Hakkımızda & İletişim</span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mt-2">
              Açık Düşüncenin <span className="text-[#74112f]">Zemini</span>
            </h1>
          </header>

          {/* MANİFESTO */}
          <div className="space-y-4 text-gray-700 text-sm md:text-base font-medium leading-relaxed">
            <p>
              <strong>ZEMİN</strong>; felsefe, sosyoloji, psikoloji ve ilgili beşerî bilimler alanında eleştirel, bağımsız ve açık fikir üretimini desteklemek amacıyla kurulmuş bağımsız bir düşünce inisiyatifidir.
            </p>
            <p>
              Üniversite sınırlarını aşan, herkesin erişebileceği bir dijital arşiv ve tematik e-dergi sayıları ile genç araştırmacıların ve düşünce üretenlerin sesini bir araya getiriyoruz.
            </p>
          </div>

          {/* İLETİŞİM KANALLARI KUTUSU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="glass-panel p-5 bg-white/50 border border-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#32127a] block mb-1">Editoryal E-Posta</span>
              <p className="text-sm font-bold text-gray-900">iletisim@zemindergi.com</p>
              <span className="text-xs text-gray-500 font-medium mt-1 block">Metin ve iş birliği talepleri için</span>
            </div>

            <div className="glass-panel p-5 bg-white/50 border border-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00a693] block mb-1">Sosyal Medya</span>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-gray-900 hover:text-[#74112f] transition-colors block"
              >
                Instagram / @zemindergi ↗
              </a>
              <span className="text-xs text-gray-500 font-medium mt-1 block">Duyurular ve yeni sayılar</span>
            </div>
          </div>

          {/* ÇAĞRI BUTONU */}
          <div className="pt-4 text-center sm:text-left">
            <Link 
              href="/basvuru" 
              className="inline-block bg-[#32127a] text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/90 shadow-lg shadow-[#32127a]/20 transition-all hover:scale-105"
            >
              YAZI GÖNDERMEK İÇİN TIKLAYIN →
            </Link>
          </div>

        </div>

      </main>

      {/* FOOTER */}
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

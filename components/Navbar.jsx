'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b-2 border-zemin-bordo bg-zemin-bej sticky top-0 z-50 shadow-sm">
      {/* Üst Şerit: Yosun Yeşili & Bej Detay */}
      <div className="bg-zemin-yesil text-zemin-bej text-[11px] py-2 px-6 font-medium tracking-wider">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="uppercase tracking-widest text-[10px] font-semibold">
            Açık Düşünce & Üniversite İnisiyatifi
          </span>
          <span className="hidden sm:inline font-serif italic text-xs text-zemin-bej/90">
            Felsefe · Sosyoloji · Psikoloji · Kültür
          </span>
        </div>
      </div>

      {/* Ana Başlık (Bordo Masthead) */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex-1 hidden md:block">
          <span className="text-[10px] uppercase tracking-widest bg-zemin-yesil text-zemin-bej px-2.5 py-1 font-bold">
            Bağımsız Arşiv
          </span>
        </div>

        <Link href="/" className="text-center group">
          <span className="font-serif text-4xl md:text-5xl font-black tracking-tight text-zemin-bordo group-hover:text-zemin-bordokoyu transition-colors block">
            ZEMİN
          </span>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            href="/basvuru"
            className="hidden sm:inline-block bg-zemin-bordo text-zemin-bej px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-zemin-bordokoyu hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[2px_2px_0px_#2D4F38]"
          >
            + Metin Gönder
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zemin-bordo font-bold"
            aria-label="Menü"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigasyon Linkleri */}
      <div className="border-t border-zemin-cizgi bg-zemin-kagit/40 hidden md:block">
        <nav className="max-w-6xl mx-auto px-6 flex justify-center items-center gap-10 py-2.5 text-xs uppercase tracking-[0.16em] font-bold text-zemin-metin">
          <Link href="/" className="hover:text-zemin-bordo transition-colors">Tüm Yazılar</Link>
          <Link href="/dergiler" className="hover:text-zemin-bordo transition-colors">Dergiler</Link>
          <Link href="/yazarlar" className="hover:text-zemin-bordo transition-colors">Yazarlar</Link>
          <Link href="/sss" className="hover:text-zemin-bordo transition-colors">Yayın İlkeleri</Link>
          <Link href="/iletisim" className="hover:text-zemin-bordo transition-colors">İletişim</Link>
        </nav>
      </div>

      {/* Mobil Menü */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-zemin-bordo bg-zemin-kagit px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-bold">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-bordo">Tüm Yazılar</Link>
          <Link href="/dergiler" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi">Dergiler</Link>
          <Link href="/yazarlar" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi">Yazarlar Dizini</Link>
          <Link href="/sss" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi">Yayın İlkeleri</Link>
          <Link href="/iletisim" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi">İletişim</Link>
          <div className="pt-2">
            <Link href="/basvuru" onClick={() => setIsOpen(false)} className="block text-center bg-zemin-bordo text-zemin-bej py-3 shadow-[2px_2px_0px_#2D4F38]">
              + Metin Gönder
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

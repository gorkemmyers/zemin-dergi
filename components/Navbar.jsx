'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-zemin-cizgi bg-zemin-bej sticky top-0 z-50">
      {/* Üst Şerit: Yosun Yeşili & Bej Detay */}
      <div className="bg-zemin-yesil text-zemin-bej text-[11px] py-1.5 px-6 font-medium tracking-wider">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="uppercase tracking-widest text-[10px]">Açık Düşünce & Üniversite İnisiyatifi</span>
          <div className="flex items-center gap-3">
            <span>Felsefe · Sosyoloji · Psikoloji</span>
            <span className="opacity-40">•</span>
            <span className="font-bold">Sayı 01</span>
          </div>
        </div>
      </div>

      {/* Ana Başlık (Bordo Masthead) */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex-1 hidden md:block">
          <span className="text-[11px] uppercase tracking-widest text-zemin-yesil font-bold border-l-2 border-zemin-yesil pl-2">
            Bağımsız Arşiv
          </span>
        </div>

        <Link href="/" className="text-center group">
          <span className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-zemin-bordo group-hover:text-zemin-bordokoyu transition-colors block">
            ZEMİN
          </span>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            href="/basvuru"
            className="hidden sm:inline-block bg-zemin-bordo text-zemin-bej px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-zemin-bordokoyu transition-colors shadow-sm"
          >
            + Yazı Gönder
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zemin-bordo"
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
      <div className="border-t border-zemin-cizgi hidden md:block">
        <nav className="max-w-6xl mx-auto px-6 flex justify-center items-center gap-10 py-3 text-xs uppercase tracking-[0.18em] font-semibold text-zemin-metin/80">
          <Link href="/" className="hover:text-zemin-bordo transition-colors">Tüm Yazılar</Link>
          <Link href="/dergiler" className="hover:text-zemin-bordo transition-colors">Aylık Sayılar</Link>
          <Link href="/yazarlar" className="hover:text-zemin-bordo transition-colors">Yazarlar</Link>
          <Link href="/sss" className="hover:text-zemin-bordo transition-colors">Yayın İlkeleri</Link>
          <Link href="/iletisim" className="hover:text-zemin-bordo transition-colors">Künye & İletişim</Link>
        </nav>
      </div>

      {/* Mobil Menü */}
      {isOpen && (
        <div className="md:hidden border-t border-zemin-cizgi bg-zemin-kagit px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-metin">Tüm Yazılar</Link>
          <Link href="/dergiler" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-metin">Aylık Sayılar</Link>
          <Link href="/yazarlar" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-metin">Yazarlar</Link>
          <Link href="/sss" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-metin">Yayın İlkeleri</Link>
          <Link href="/iletisim" onClick={() => setIsOpen(false)} className="block py-2 border-b border-zemin-cizgi text-zemin-metin">İletişim</Link>
          <div className="pt-2">
            <Link href="/basvuru" onClick={() => setIsOpen(false)} className="block text-center bg-zemin-bordo text-zemin-bej py-3">
              + Yazı Gönder
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

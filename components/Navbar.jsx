'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-[#E2DDD5] bg-[#F8F6F0] sticky top-0 z-50">
      {/* Üst Bilgi Şeridi */}
      <div className="border-b border-[#E2DDD5]/60 text-[11px] text-[#1A1A1A]/60 py-1.5 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span>Açık Düşünce & Üniversite İnisiyatifi</span>
          <div className="hidden sm:flex items-center gap-4">
            <span>Felsefe · Sosyoloji · Psikoloji</span>
            <span>•</span>
            <span>Sayı 01</span>
          </div>
        </div>
      </div>

      {/* Ana Masthead (Logo) */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex-1 hidden md:block">
          <span className="text-[11px] uppercase tracking-widest text-[#5E7362] font-semibold">Bağımsız Arşiv</span>
        </div>

        {/* Gazete Logosu */}
        <Link href="/" className="text-center group">
          <span className="font-editorial text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A] block transition-colors group-hover:text-[#4E141E]">
            ZEMİN
          </span>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            href="/basvuru"
            className="hidden sm:inline-block border border-[#4E141E] text-[#4E141E] px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-[#4E141E] hover:text-[#F8F6F0] transition-colors"
          >
            Yazı Gönder
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1A1A1A]"
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

      {/* Klasik Navigasyon Çizgisi */}
      <div className="border-t border-[#E2DDD5] hidden md:block">
        <nav className="max-w-6xl mx-auto px-6 flex justify-center items-center gap-10 py-3 text-xs uppercase tracking-[0.15em] font-medium text-[#1A1A1A]/80">
          <Link href="/" className="hover:text-[#4E141E] transition-colors">Tüm Yazılar</Link>
          <Link href="/dergiler" className="hover:text-[#4E141E] transition-colors">Aylık Sayılar</Link>
          <Link href="/yazarlar" className="hover:text-[#4E141E] transition-colors">Yazarlar</Link>
          <Link href="/sss" className="hover:text-[#4E141E] transition-colors">Yayın İlkeleri</Link>
          <Link href="/iletisim" className="hover:text-[#4E141E] transition-colors">Künye & İletişim</Link>
        </nav>
      </div>

      {/* Mobil Açılır Menü */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E2DDD5] bg-[#F8F6F0] px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 border-b border-[#E2DDD5]/60">Tüm Yazılar</Link>
          <Link href="/dergiler" onClick={() => setIsOpen(false)} className="block py-2 border-b border-[#E2DDD5]/60">Aylık Sayılar</Link>
          <Link href="/yazarlar" onClick={() => setIsOpen(false)} className="block py-2 border-b border-[#E2DDD5]/60">Yazarlar Dizini</Link>
          <Link href="/sss" onClick={() => setIsOpen(false)} className="block py-2 border-b border-[#E2DDD5]/60">Yayın İlkeleri</Link>
          <Link href="/iletisim" onClick={() => setIsOpen(false)} className="block py-2 border-b border-[#E2DDD5]/60">İletişim</Link>
          <div className="pt-2">
            <Link href="/basvuru" onClick={() => setIsOpen(false)} className="block text-center bg-[#4E141E] text-[#F8F6F0] py-3">
              + Yazı Gönder
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

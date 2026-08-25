'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-[#E3DDD3] bg-[#F7F5F0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="font-editorial text-3xl font-bold tracking-tight text-[#1A1A1A]">ZEMİN</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#5E7362] font-semibold -mt-1">Açık Düşünce Arşivi</span>
        </Link>

        {/* Masaüstü Menü Linkleri */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-[#1A1A1A]/80">
          <Link href="/" className="hover:text-[#4E141E] transition-colors">Yazılar</Link>
          <Link href="/dergiler" className="hover:text-[#4E141E] transition-colors">Dergiler</Link>
          <Link href="/yazarlar" className="hover:text-[#4E141E] transition-colors">Yazarlar</Link>
          <Link href="/sss" className="hover:text-[#4E141E] transition-colors">SSS</Link>
          <Link href="/iletisim" className="hover:text-[#4E141E] transition-colors">İletişim</Link>
        </nav>

        {/* Sağ Buton & Mobil Menü Butonu */}
        <div className="flex items-center gap-4">
          <Link
            href="/basvuru"
            className="hidden sm:inline-block bg-[#4E141E] text-[#F7F5F0] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-opacity"
          >
            + Yazı Gönder
          </Link>

          {/* Hamburger Menü Butonu (Mobil) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1A1A1A] hover:text-[#4E141E] focus:outline-none"
            aria-label="Menüyü Aç"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.7a1 1 0 00-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 001.42 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.41z"/>
              ) : (
                <path fillRule="evenodd" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E3DDD3] bg-[#F7F5F0] px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-semibold">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-[#E3DDD3]/50 hover:text-[#4E141E]"
          >
            Yazılar
          </Link>
          <Link
            href="/dergiler"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-[#E3DDD3]/50 hover:text-[#4E141E]"
          >
            Dergiler
          </Link>
          <Link
            href="/yazarlar"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-[#E3DDD3]/50 hover:text-[#4E141E]"
          >
            Yazarlar
          </Link>
          <Link
            href="/sss"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-[#E3DDD3]/50 hover:text-[#4E141E]"
          >
            SSS & Yayın İlkeleri
          </Link>
          <Link
            href="/iletisim"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-[#E3DDD3]/50 hover:text-[#4E141E]"
          >
            İletişim & Künye
          </Link>
          <div className="pt-2">
            <Link
              href="/basvuru"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-[#4E141E] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold"
            >
              + Yazı Gönder
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

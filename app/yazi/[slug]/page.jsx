'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function YaziDetayPage() {
  const params = useParams();
  const [yazi, setYazi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazi() {
      if (!params?.slug) return;
      
      const { data } = await supabase
        .from('yazilar')
        .select(`
          id, baslik, slug, kategori, icerik, olusturulma_tarihi,
          dergiler (id, sayi_no, baslik),
          yazarlar (id, ad_soyad, slug, universite, bolum, instagram, biyografi)
        `)
        .eq('slug', params.slug)
        .eq('durum', 'onaylandi')
        .single();

      if (data) setYazi(data);
      setLoading(false);
    }
    fetchYazi();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs font-bold text-gray-500">Metin yükleniyor...</p>
      </div>
    );
  }

  if (!yazi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-xl font-black text-gray-900 mb-2">Metin Bulunamadı</h1>
        <Link href="/" className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20">
        
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
            <Link href="/yazilar" className="text-[#00a693] flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* MAKALE GÖVDESİ */}
        <article className="glass-card p-6 sm:p-12 border border-white/80 shadow-xl">
          <header className="border-b border-gray-200/70 pb-6 mb-8 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="bg-[#00a693]/15 text-[#00a693] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                {yazi.kategori}
              </span>
              {yazi.dergiler && (
                <span className="bg-[#74112f] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Sayı {yazi.dergiler.sayi_no}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              {yazi.baslik}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-medium text-gray-600">
              <span className="font-bold text-gray-900">{yazi.yazarlar?.ad_soyad}</span>
              <span>•</span>
              <span>{yazi.yazarlar?.universite}</span>
            </div>
          </header>

          <div className="font-serif text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap selection:bg-[#74112f]/15">
            {yazi.icerik}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200/70 font-sans">
            <div className="glass-panel p-4 flex items-center gap-4 bg-white/40">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'}
              </div>
              <div className="min-w-0 flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-900">{yazi.yazarlar?.ad_soyad}</h3>
                  {yazi.yazarlar?.instagram && (
                    <a 
                      href={`https://instagram.com/${yazi.yazarlar.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#00a693] hover:underline"
                    >
                      @{yazi.yazarlar.instagram}
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate">{yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}</p>
              </div>
            </div>
          </div>
        </article>
      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#74112f] tracking-tighter mr-2">ZEMİN</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function YaziDetayPage() {
  const params = useParams();
  const [yazi, setYazi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);

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
        <p className="text-sm font-bold text-gray-500">Metin yükleniyor...</p>
      </div>
    );
  }

  if (!yazi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-3">Metin Bulunamadı</h1>
        <p className="text-sm text-gray-600 mb-6">Bu metin henüz onaylanmamış veya yayından kaldırılmış olabilir.</p>
        <Link href="/yazilar" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-bold">
          Arşive Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20">
        
        {/* NAVBAR */}
        <nav className="glass-panel mx-auto max-w-4xl px-6 py-3.5 mb-8 md:mb-12 flex justify-between items-center sticky top-4 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
            ZEMİN
          </Link>
          
          <div className="hidden md:flex gap-7 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
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
            <Link href="/yazilar" onClick={() => setMenuAcik(false)} className="text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)}>Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)}>Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)}>İletişim</Link>
            <Link href="/basvuru" onClick={() => setMenuAcik(false)} className="bg-[#32127a] text-white py-2.5 rounded-full text-xs">
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* METİN KAPSAYICI CAM PANEL */}
        <article className="glass-card p-6 sm:p-12 md:p-16 border border-white/80 shadow-2xl">
          
          {/* Başlık & Bilgi Bloğu */}
          <header className="border-b border-gray-200/70 pb-8 mb-10 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
              <span className="bg-[#00a693]/15 text-[#00a693] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {yazi.kategori}
              </span>
              {yazi.dergiler && (
                <span className="bg-[#74112f] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Sayı {yazi.dergiler.sayi_no}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              {yazi.baslik}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-gray-600">
              <span className="font-bold text-gray-900">{yazi.yazarlar?.ad_soyad}</span>
              <span>•</span>
              <span>{yazi.yazarlar?.universite}</span>
            </div>
          </header>

          {/* MAKALE GÖVDESİ (LORA FONTU) */}
          <div className="font-serif text-gray-800 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap selection:bg-[#74112f]/20">
            {yazi.icerik}
          </div>

          {/* YAZAR BİYOGRAFİ CAM KARTI */}
          <div className="mt-16 pt-8 border-t border-gray-200/70 font-sans">
            <div className="glass-panel p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white/40">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">
                {yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'}
              </div>
              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="font-black text-lg text-gray-900">{yazi.yazarlar?.ad_soyad}</h3>
                  {yazi.yazarlar?.instagram && (
                    <a 
                      href={`https://instagram.com/${yazi.yazarlar.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#00a693] hover:underline"
                    >
                      @{yazi.yazarlar.instagram} ↗
                    </a>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  {yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}
                </p>
                {yazi.yazarlar?.biyografi && (
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {yazi.yazarlar.biyografi}
                  </p>
                )}
              </div>
            </div>
          </div>

        </article>
      </main>

      {/* FOOTER */}
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

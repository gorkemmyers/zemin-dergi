'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function YaziDetayPage() {
  const params = useParams();
  const [yazi, setYazi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kopyalandi, setKopyalandi] = useState(false);
  const [fontSize, setFontSize] = useState('text-lg'); // text-base | text-lg | text-xl | text-2xl
  const [imgError, setImgError] = useState(false);

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

  // Tahmini Okuma Süresi (Kelime Sayısı / 200 wpm)
  const okumaSuresi = yazi?.icerik 
    ? Math.max(1, Math.ceil(yazi.icerik.trim().split(/\s+/).length / 200))
    : 1;

  // Paylaşım Fonksiyonları
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: yazi?.baslik,
          text: `${yazi?.yazarlar?.ad_soyad} - ${yazi?.baslik} | ZEMİN`,
          url: url,
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2500);
  };

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

  const temizInstagram = yazi.yazarlar?.instagram ? yazi.yazarlar.instagram.replace('@', '').trim() : '';

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20">
        
        {/* NAVBAR */}
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

        {/* MAKALE KAPSAYICI */}
        <article className="glass-card p-6 sm:p-12 border border-white/90 shadow-2xl relative">
          
          {/* ÜST BİLGİ & KONTROL MASASI */}
          <header className="border-b border-gray-200/70 pb-6 mb-8 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#00a693]/15 text-[#00a693] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {yazi.kategori}
                </span>
                {yazi.dergiler && (
                  <span className="bg-[#74112f] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    Sayı {yazi.dergiler.sayi_no}
                  </span>
                )}
                <span className="text-[11px] font-bold text-gray-500 bg-white/60 border px-2.5 py-0.5 rounded-full">
                  ⏱ {okumaSuresi} dk okuma
                </span>
              </div>

              {/* FONT BOYUTU AYARLAYICI ($A^- / A^+$) */}
              <div className="flex items-center gap-1 bg-white/70 border border-gray-200 p-1 rounded-full shadow-sm text-xs font-bold text-gray-700">
                <button 
                  onClick={() => setFontSize('text-base')} 
                  className={`px-2 py-0.5 rounded-full transition-colors ${fontSize === 'text-base' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                  title="Küçük Boyut"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontSize('text-lg')} 
                  className={`px-2 py-0.5 rounded-full transition-colors ${fontSize === 'text-lg' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                  title="Normal Boyut"
                >
                  A
                </button>
                <button 
                  onClick={() => setFontSize('text-xl')} 
                  className={`px-2 py-0.5 rounded-full transition-colors ${fontSize === 'text-xl' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                  title="Büyük Boyut"
                >
                  A+
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              {yazi.baslik}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link 
                href={`/yazar/${yazi.yazarlar?.slug}`}
                className="flex items-center gap-2 group outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-xs shadow-sm">
                  {temizInstagram && !imgError ? (
                    <img 
                      src={`https://unavatar.io/instagram/${temizInstagram}`} 
                      alt={yazi.yazarlar?.ad_soyad}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#74112f] transition-colors">
                    {yazi.yazarlar?.ad_soyad}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">{yazi.yazarlar?.universite}</p>
                </div>
              </Link>

              {/* PAYLAŞIM BUTONLARI */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 bg-[#32127a] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#32127a]/90 shadow-sm"
                >
                  📤 Paylaş / Story
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 shadow-sm"
                >
                  {kopyalandi ? '✓ Kopyalandı' : '🔗 Link'}
                </button>
              </div>
            </div>
          </header>

          {/* DİNAMİK MAKALE GÖVDESİ */}
          <div className={`font-serif text-gray-800 ${fontSize} leading-relaxed whitespace-pre-wrap selection:bg-[#74112f]/15`}>
            {yazi.icerik}
          </div>

          {/* ALT YAZAR BİYOGRAFİSİ */}
          <div className="mt-14 pt-6 border-t border-gray-200/70 font-sans">
            <Link 
              href={`/yazar/${yazi.yazarlar?.slug}`} 
              className="glass-panel p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white/50 hover:bg-white/80 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md border border-white">
                {temizInstagram && !imgError ? (
                  <img 
                    src={`https://unavatar.io/instagram/${temizInstagram}`} 
                    alt={yazi.yazarlar?.ad_soyad}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'
                )}
              </div>
              <div className="min-w-0 flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="font-black text-sm sm:text-base text-gray-900 group-hover:text-[#74112f] transition-colors">
                    {yazi.yazarlar?.ad_soyad}
                  </h3>
                  {yazi.yazarlar?.instagram && (
                    <span className="text-xs font-bold text-[#00a693]">
                      @{yazi.yazarlar.instagram}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 font-semibold mb-2">
                  {yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}
                </p>
                {yazi.yazarlar?.biyografi && (
                  <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                    {yazi.yazarlar.biyografi}
                  </p>
                )}
              </div>
            </Link>
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

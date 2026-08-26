'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent',
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(116, 17, 47, 0.12) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 166, 147, 0.12) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(50, 18, 122, 0.12) 0%, transparent 60%)'
      };
    default:
      return {
        cardBg: 'from-gray-100 to-transparent',
        badgeBg: 'bg-gray-100 text-gray-700',
        pattern: 'none'
      };
  }
};

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazilar() {
      const { data } = await supabase
        .from('yazilar')
        .select('id, baslik, slug, kategori, icerik, kapak_url, olusturulma_tarihi, yazarlar(ad_soyad, universite)')
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false })
        .limit(6);
      
      if (data) setYazilar(data);
      setLoading(false);
    }
    fetchYazilar();
  }, []);

  // Rastgele Düşünce Fonksiyonu
  const handleRastgele = async () => {
    const { data } = await supabase
      .from('yazilar')
      .select('slug')
      .eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    } else {
      alert('Henüz yayında yazı bulunmuyor.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 md:mb-10 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleRastgele}
                className="glass-panel px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-700 hover:text-[#74112f] transition-all flex items-center gap-1 shadow-xs"
                title="Rastgele Bir Metin Keşfet"
              >
                <span>🔀</span> <span className="hidden sm:inline">Rastgele</span>
              </button>
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="text-[#00a693] flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="relative mx-auto max-w-4xl mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693] rounded-[2.5rem] blur opacity-30"></div>
          
          <div className="relative glass-card p-6 sm:p-12 md:p-16 rounded-[2.3rem] text-center border border-white/90 shadow-xl overflow-hidden">
            <span className="inline-block text-[#00a693] font-black tracking-widest uppercase text-[10px] sm:text-[11px] mb-4 px-4 py-1.5 rounded-full bg-[#00a693]/10 border border-[#00a693]/20">
              Açık Düşünce İnisiyatifi
            </span>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Fikri <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693]">Zeminini</span> Burada İnşa Et.
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              Felsefe, sosyoloji ve psikoloji disiplinlerinde üretilen eleştirel metinleri açık erişimli bir arşivde bir araya getiriyoruz.
            </p>
            
            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4">
              <button 
                onClick={handleRastgele}
                className="glass-panel px-5 py-2.5 sm:px-7 sm:py-3.5 font-bold text-xs sm:text-sm text-gray-800 hover:bg-white/90 transition-all shadow-sm flex items-center gap-2"
              >
                <span>🔀</span> Rastgele Keşfet
              </button>
              <Link 
                href="/basvuru" 
                className="bg-gray-900 text-white px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-3xl text-xs sm:text-sm font-bold shadow-lg shadow-gray-900/15 hover:scale-105 transition-transform"
              >
                Yayın Başvurusu →
              </Link>
            </div>
          </div>
        </section>

        {/* SON YAYINLAR */}
        <section className="mt-6">
          <div className="flex justify-between items-end mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Son Yayınlar</h2>
            <Link href="/yazilar" className="text-xs md:text-sm font-bold text-[#32127a] hover:underline">Tümünü Gör</Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium text-xs">Metinler çekiliyor...</div>
          ) : yazilar.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500 font-medium text-xs">Henüz yayımlanmış bir metin bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {yazilar.map((yazi) => {
                const stil = getDisiplinStili(yazi.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((yazi.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${yazi.slug}`} key={yazi.id} className="group outline-none">
                    <article 
                      style={{ backgroundImage: !yazi.kapak_url ? stil.pattern : 'none' }}
                      className={`glass-card p-6 h-full flex flex-col justify-between hover:shadow-2xl hover:bg-white transition-all duration-300 border border-white/80 group-hover:-translate-y-1 relative overflow-hidden ${!yazi.kapak_url ? `bg-gradient-to-br ${stil.cardBg}` : 'bg-white/90'}`}
                    >
                      {yazi.kapak_url && (
                        <>
                          <img 
                            src={yazi.kapak_url} 
                            alt="" 
                            className="absolute -right-2 inset-y-0 w-3/5 h-full object-cover object-center opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500 pointer-events-none" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none"></div>
                        </>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${stil.badgeBg} shadow-xs`}>
                            {yazi.kategori}
                          </span>
                          <span className="text-[10px] text-gray-700 font-bold bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-gray-200/60 shadow-xs">
                            ⏱ {okumaSuresi} dk
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug group-hover:text-[#74112f] transition-colors line-clamp-3">
                          {yazi.baslik}
                        </h3>
                      </div>

                      <div className="relative z-10 mt-6 pt-3.5 border-t border-gray-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{yazi.yazarlar?.ad_soyad}</p>
                          <p className="text-[11px] text-gray-600 font-medium truncate max-w-[170px]">{yazi.yazarlar?.universite}</p>
                        </div>
                        <span className="text-xs font-black text-[#32127a] group-hover:translate-x-1 transition-transform">
                          Oku →
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
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

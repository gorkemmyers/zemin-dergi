'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DergilerPage() {
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDergiler() {
      const { data } = await supabase
        .from('dergiler')
        .select('*')
        .eq('durum', 'yayinda')
        .order('sayi_no', { ascending: false });
      
      if (data) setDergiler(data);
      setLoading(false);
    }
    fetchDergiler();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-16">
        
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
            <Link href="/dergiler" className="text-[#00a693] flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* BAŞLIK */}
        <header className="text-center py-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1">
            Dergi <span className="text-[#32127a]">Arşivi</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md mx-auto">
            Tematik çerçeveler etrafında derlenen açık erişimli e-dergi sayıları.
          </p>
        </header>

        {/* YANLAMASINA KOMPAKT LİSTE */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium text-xs">Arşiv yükleniyor...</div>
        ) : dergiler.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-xl mx-auto">
            <p className="text-gray-500 font-medium text-xs">Henüz yayımlanmış bir dergi sayısı bulunmuyor.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {dergiler.map((dergi) => (
              <div 
                key={dergi.id} 
                className="glass-card p-4 md:p-5 flex flex-col sm:flex-row items-center gap-5 hover:shadow-lg transition-all border border-white/60 hover:bg-white/85"
              >
                <div className="w-20 sm:w-24 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm relative">
                  {dergi.kapak_url ? (
                    <img src={dergi.kapak_url} alt={`Sayı ${dergi.sayi_no}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#74112f]/20 to-[#32127a]/20">
                      <span className="font-black text-xl text-[#74112f]/50">{dergi.sayi_no}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center flex-grow text-center sm:text-left">
                  <span className="bg-[#74112f] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full w-max mx-auto sm:mx-0 mb-1.5">
                    Sayı {dergi.sayi_no}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-gray-900 leading-snug mb-1">
                    {dergi.baslik}
                  </h2>
                  {dergi.tema_aciklama && (
                    <p className="text-xs text-gray-600 font-medium line-clamp-2 mb-3">
                      {dergi.tema_aciklama}
                    </p>
                  )}
                  <div>
                    <a 
                      href={dergi.pdf_url || '#'} 
                      target={dergi.pdf_url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-transform"
                    >
                      PDF Olarak Oku ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

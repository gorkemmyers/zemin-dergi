'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DergilerPage() {
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);

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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <nav className="glass-panel mx-auto max-w-4xl px-6 py-3.5 mb-8 md:mb-12 flex justify-between items-center sticky top-4 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
            ZEMİN
          </Link>
          
          <div className="hidden md:flex gap-7 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" className="text-[#00a693]">Dergiler</Link>
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
            <Link href="/" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)} className="text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" onClick={() => setMenuAcik(false)} className="bg-[#32127a] text-white py-2.5 rounded-full text-xs">
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* BAŞLIK */}
        <header className="text-center py-6 md:py-10 mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
            Dergi <span className="text-[#32127a]">Arşivi</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium max-w-xl mx-auto">
            Tematik çerçeveler etrafında derlenen açık erişimli e-dergi sayıları.
          </p>
        </header>

        {/* YANLAMASINA / KOMPAKT DERGİ LİSTESİ */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Arşiv yükleniyor...</div>
        ) : dergiler.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-xl mx-auto">
            <p className="text-gray-500 font-medium">Henüz yayımlanmış bir dergi sayısı bulunmuyor.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {dergiler.map((dergi) => (
              <div 
                key={dergi.id} 
                className="glass-card p-4 md:p-5 flex flex-col sm:flex-row items-center gap-5 hover:shadow-xl transition-all border border-white/60 hover:bg-white/80"
              >
                {/* Minik Kapak Önizlemesi */}
                <div className="w-24 sm:w-28 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm relative">
                  {dergi.kapak_url ? (
                    <img src={dergi.kapak_url} alt={`Sayı ${dergi.sayi_no}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#74112f]/20 to-[#32127a]/20">
                      <span className="font-black text-2xl text-[#74112f]/50">{dergi.sayi_no}</span>
                    </div>
                  )}
                </div>
                
                {/* Bilgiler ve Buton */}
                <div className="flex flex-col justify-center flex-grow text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <span className="bg-[#74112f] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                      Sayı {dergi.sayi_no}
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">
                    {dergi.baslik}
                  </h2>
                  
                  {dergi.tema_aciklama && (
                    <p className="text-xs md:text-sm text-gray-600 font-medium line-clamp-2 mb-3">
                      {dergi.tema_aciklama}
                    </p>
                  )}
                  
                  <div className="pt-1">
                    <a 
                      href={dergi.pdf_url || '#'} 
                      target={dergi.pdf_url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform"
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

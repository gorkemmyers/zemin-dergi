'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function DergilerPage() {
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDergiler() {
      // Sadece 'yayinda' durumundaki dergileri çeker
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* NAV BAR */}
        <nav className="glass-panel mx-auto max-w-4xl px-8 py-4 mb-12 flex justify-between items-center sticky top-6 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
            ZEMİN
          </Link>
          <div className="hidden lg:flex gap-8 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693] transition-colors">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors">Yazılar</Link>
            <Link href="/dergiler" className="text-[#00a693] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors">İletişim</Link>
          </div>
          <Link href="/basvuru" className="bg-[#32127a] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/80 shadow-lg shadow-[#32127a]/30 transition-all hover:-translate-y-0.5">
            METİN GÖNDER
          </Link>
        </nav>

        {/* SAYFA BAŞLIĞI */}
        <header className="text-center py-16 mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Dergi <span className="text-[#32127a]">Arşivi</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Editoryal süreçten geçerek belirli bir tema etrafında toplanmış e-dergi sayılarımızı buradan inceleyebilir, PDF olarak okuyabilirsiniz.
          </p>
        </header>

        {/* DERGİLER GRİDİ */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Arşiv yükleniyor...</div>
        ) : dergiler.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto">
            <p className="text-gray-500 font-medium">Henüz yayımlanmış bir dergi sayısı bulunmuyor. Yeni sayılar için hazırlıklarımız sürüyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dergiler.map((dergi) => (
              <div key={dergi.id} className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-shadow border border-white/60">
                {/* Kapak Görseli */}
                <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-inner relative">
                  {dergi.kapak_url ? (
                    <img src={dergi.kapak_url} alt={`Sayı ${dergi.sayi_no} Kapak`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#74112f]/20 to-[#32127a]/20">
                      <span className="font-black text-4xl text-[#74112f]/40">{dergi.sayi_no}</span>
                    </div>
                  )}
                </div>
                
                {/* İçerik Bilgisi */}
                <div className="flex flex-col justify-center flex-grow">
                  <span className="inline-block bg-[#74112f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-3">
                    SAYI {dergi.sayi_no}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{dergi.baslik}</h2>
                  {dergi.tema_aciklama && (
                    <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-3">
                      {dergi.tema_aciklama}
                    </p>
                  )}
                  <div className="mt-auto">
                    <a 
                      href={dergi.pdf_url || '#'} 
                      target={dergi.pdf_url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      Sayıyı Oku (PDF) ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-black text-[#74112f] tracking-tighter mb-1 block">ZEMİN</Link>
            <p className="text-xs font-semibold text-gray-500">© 2026 Zemin. Tüm hakları saklıdır.</p>
          </div>
          <div className="flex gap-6 text-sm font-bold text-gray-600">
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693] transition-colors">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f] transition-colors">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

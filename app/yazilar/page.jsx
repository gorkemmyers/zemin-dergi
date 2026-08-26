'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function YazilarPage() {
  const [yazilar, setYazilar] = useState([]);
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const [aramaMetni, setAramaMetni] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);

  useEffect(() => {
    async function fetchYazilar() {
      const { data } = await supabase
        .from('yazilar')
        .select('id, baslik, slug, kategori, olusturulma_tarihi, yazarlar(ad_soyad, universite)')
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false });
      
      if (data) setYazilar(data);
      setLoading(false);
    }
    fetchYazilar();
  }, []);

  const filtrelenmisYazilar = yazilar.filter((y) => {
    const kategoriUyumu = seciliKategori === 'Tümü' || y.kategori === seciliKategori;
    const aramaUyumu = 
      y.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      y.yazarlar?.ad_soyad.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUyumu && aramaUyumu;
  });

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
            <Link href="/" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" onClick={() => setMenuAcik(false)} className="text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" onClick={() => setMenuAcik(false)} className="bg-[#32127a] text-white py-2.5 rounded-full text-xs">
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* BAŞLIK & ARAMA ALANI */}
        <header className="text-center py-6 md:py-8 mb-6 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Metin <span className="text-[#74112f]">Arşivi</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium mb-6">
            Disiplinlerarası düşünce yazıları, makaleler ve denemeler.
          </p>

          {/* Arama Input */}
          <div className="glass-panel p-2 flex items-center max-w-lg mx-auto shadow-sm">
            <input 
              type="text" 
              placeholder="Yazı başlığı veya yazar ara..." 
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full bg-transparent px-4 py-2 text-sm text-gray-900 outline-none font-medium placeholder-gray-400"
            />
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
              <button
                key={kat}
                onClick={() => setSeciliKategori(kat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  seciliKategori === kat
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'glass-panel text-gray-700 hover:bg-white/80'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </header>

        {/* YAZI LİSTESİ */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium">Yazılar getiriliyor...</div>
        ) : filtrelenmisYazilar.length === 0 ? (
          <div className="glass-card p-10 text-center max-w-md mx-auto">
            <p className="text-gray-500 font-medium">Aramanıza uygun yazı bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrelenmisYazilar.map((yazi) => (
              <Link href={`/yazi/${yazi.slug}`} key={yazi.id} className="group outline-none">
                <article className="glass-card p-5 h-full flex flex-col justify-between hover:shadow-xl hover:bg-white/85 transition-all duration-300 border border-white/60 group-hover:-translate-y-1">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00a693] mb-3 bg-[#00a693]/10 px-2.5 py-0.5 rounded-md">
                      {yazi.kategori}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#74112f] transition-colors line-clamp-2">
                      {yazi.baslik}
                    </h2>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{yazi.yazarlar?.ad_soyad}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{yazi.yazarlar?.universite}</p>
                    </div>
                    <span className="text-xs text-[#32127a] font-bold">Oku →</span>
                  </div>
                </article>
              </Link>
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

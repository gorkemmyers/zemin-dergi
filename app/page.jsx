'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);

  useEffect(() => {
    async function fetchYazilar() {
      const { data } = await supabase
        .from('yazilar')
        .select('id, baslik, slug, kategori, olusturulma_tarihi, yazarlar(ad_soyad, universite)')
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false })
        .limit(6);
      
      if (data) setYazilar(data);
      setLoading(false);
    }
    fetchYazilar();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-16">
        
        {/* SÜZÜLEN MENÜ (NAVBAR) */}
        <nav className="glass-panel mx-auto max-w-4xl px-6 py-3.5 mb-8 md:mb-12 flex justify-between items-center sticky top-4 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
            ZEMİN
          </Link>
          
          {/* Masaüstü Linkler */}
          <div className="hidden md:flex gap-7 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors">İletişim</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/basvuru" 
              className="hidden sm:inline-block bg-[#32127a] text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
            >
              METİN GÖNDER
            </Link>
            
            {/* Mobil Menü Butonu */}
            <button 
              onClick={() => setMenuAcik(!menuAcik)}
              className="md:hidden p-2 rounded-full text-gray-800 hover:bg-white/50 focus:outline-none"
              aria-label="Menü"
            >
              {menuAcik ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {/* MOBİL AÇILIR MENÜ */}
        {menuAcik && (
          <div className="md:hidden glass-panel p-6 mb-8 flex flex-col gap-4 text-center text-sm font-bold text-gray-800 shadow-xl">
            <Link href="/" onClick={() => setMenuAcik(false)} className="text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)} className="hover:text-[#00a693]">İletişim</Link>
            <Link 
              href="/basvuru" 
              onClick={() => setMenuAcik(false)}
              className="bg-[#32127a] text-white py-2.5 rounded-full text-xs tracking-wider"
            >
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* KOMPAKT HERO BÖLÜMÜ */}
        <section className="text-center py-8 md:py-14 flex flex-col items-center justify-center">
          <span className="text-[#00a693] font-black tracking-widest uppercase text-[11px] mb-4 px-4 py-1.5 rounded-full bg-[#00a693]/10 border border-[#00a693]/20">
            Açık Düşünce İnisiyatifi
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-4 max-w-3xl">
            Fikri <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693]">Zeminini</span> Burada İnşa Et.
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mb-6 font-medium leading-relaxed">
            Felsefe, sosyoloji ve psikoloji disiplinlerinde üretilen eleştirel metinleri açık arşivde buluşturuyoruz.
          </p>
          <div className="flex flex-row gap-3">
            <Link 
              href="/dergiler" 
              className="glass-panel px-6 py-3 font-bold text-sm text-gray-800 hover:bg-white/80 transition-all shadow-sm"
            >
              Sayıları İncele
            </Link>
            <Link 
              href="/basvuru" 
              className="bg-gray-900 text-white px-6 py-3 rounded-3xl text-sm font-bold shadow-lg shadow-gray-900/10 hover:scale-105 transition-transform"
            >
              Yayın Başvurusu →
            </Link>
          </div>
        </section>

        {/* SON YAZILAR */}
        <section className="mt-8">
          <div className="flex justify-between items-end mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Son Yayınlar</h2>
            <Link href="/yazilar" className="text-xs md:text-sm font-bold text-[#32127a] hover:underline">Tümünü Gör</Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium">Metinler çekiliyor...</div>
          ) : yazilar.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500 font-medium">Henüz yayımlanmış bir metin bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {yazilar.map((yazi) => (
                <Link href={`/yazi/${yazi.slug}`} key={yazi.id} className="group outline-none">
                  <article className="glass-card p-5 h-full flex flex-col justify-between hover:shadow-xl hover:bg-white/85 transition-all duration-300 border border-white/60 group-hover:-translate-y-1">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00a693] mb-3 bg-[#00a693]/10 px-2.5 py-0.5 rounded-md">
                        {yazi.kategori}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#74112f] transition-colors line-clamp-2">
                        {yazi.baslik}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between">
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
        </section>
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

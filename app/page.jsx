'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazilar() {
      const { data } = await supabase
        .from('yazilar')
        .select('id, baslik, slug, kategori, ozet, olusturulma_tarihi, yazarlar(ad_soyad, universite)')
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* MERKEZİ SÜZÜLEN MENÜ (NAVBAR) */}
        <nav className="glass-panel mx-auto max-w-4xl px-8 py-4 mb-16 flex justify-between items-center sticky top-6 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
            ZEMİN
          </Link>
          
          {/* Ortalanmış Linkler */}
          <div className="hidden lg:flex gap-8 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693] transition-colors">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors">İletişim</Link>
          </div>

          <Link 
            href="/basvuru" 
            className="bg-[#32127a] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/80 shadow-lg shadow-[#32127a]/30 transition-all hover:-translate-y-0.5"
          >
            METİN GÖNDER
          </Link>
        </nav>

        {/* KAHRAMAN BÖLÜMÜ (HERO) */}
        <section className="text-center py-20 lg:py-28 flex flex-col items-center justify-center">
          <span className="text-[#00a693] font-black tracking-widest uppercase text-xs mb-6 px-5 py-2 rounded-full bg-[#00a693]/10 border border-[#00a693]/20 shadow-sm">
            Açık Düşünce İnisiyatifi
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Fikri <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693]">Zeminini</span> Burada İnşa Et.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 font-medium leading-relaxed">
            Felsefe, sosyoloji ve psikoloji disiplinlerinde üretilen akademik ve eleştirel metinleri açık erişimli bir arşivde bir araya getiriyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dergiler" 
              className="glass-panel px-8 py-4 font-bold text-gray-800 hover:bg-white/80 transition-all flex items-center justify-center gap-2"
            >
              Sayıları İncele
            </Link>
            <Link 
              href="/basvuru" 
              className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-gray-900/20 hover:scale-105 transition-transform text-center"
            >
              Yayın Başvurusu →
            </Link>
          </div>
        </section>

        {/* SON YAZILAR */}
        <section className="mt-12">
          <div className="flex justify-between items-end mb-8 px-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Son Yayınlar</h2>
            <Link href="/yazilar" className="text-sm font-bold text-[#32127a] hover:underline">Tümünü Gör</Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-medium">Metinler çekiliyor...</div>
          ) : yazilar.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500 font-medium">Henüz yayımlanmış bir metin bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yazilar.map((yazi) => (
                <Link href={`/yazi/${yazi.slug}`} key={yazi.id} className="group outline-none">
                  <article className="glass-card p-6 h-full flex flex-col justify-between hover:shadow-2xl hover:bg-white/80 transition-all duration-300 border border-white/60 group-hover:border-white group-hover:-translate-y-1">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00a693] mb-4 bg-[#00a693]/10 px-2.5 py-1 rounded-md">
                        {yazi.kategori}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#74112f] transition-colors line-clamp-3">
                        {yazi.baslik}
                      </h3>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{yazi.yazarlar?.ad_soyad}</p>
                        <p className="text-xs text-gray-500 font-medium">{yazi.yazarlar?.universite}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#32127a] group-hover:text-white transition-colors">
                        ↗
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER (ALT BİLGİ) */}
      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-black text-[#74112f] tracking-tighter mb-1 block">ZEMİN</Link>
            <p className="text-xs font-semibold text-gray-500">© 2026 Zemin. Tüm hakları saklıdır.</p>
          </div>
          
          <div className="flex gap-6 text-sm font-bold text-gray-600">
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693] transition-colors">Yayın Şartları</Link>
            {/* Editör Girişi */}
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f] transition-colors">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

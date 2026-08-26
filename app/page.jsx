'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase'; // Kendi supabase yoluna göre ayarla

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazilar() {
      // Sadece 'onaylandi' durumundaki yazıları getirir
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
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      
      {/* SÜZÜLEN (FLOATING) MENÜ - Cam Efekti */}
      <nav className="glass-panel mx-auto max-w-3xl px-8 py-4 mb-16 flex justify-between items-center sticky top-6 z-50 rounded-full">
        <div className="text-[#74112f] font-black text-2xl tracking-tighter">ZEMİN</div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-[#00a693] transition-colors">Ana Sayfa</Link>
          <Link href="/dergiler" className="hover:text-[#00a693] transition-colors">Dergiler</Link>
          <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors">Yazarlar</Link>
        </div>
        <Link 
          href="/basvuru" 
          className="bg-[#32127a] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/80 shadow-lg shadow-[#32127a]/30 transition-all"
        >
          METİN GÖNDER
        </Link>
      </nav>

      {/* KAHRAMAN BÖLÜMÜ (HERO SECTION) */}
      <section className="text-center py-20 lg:py-32 flex flex-col items-center justify-center">
        <span className="text-[#00a693] font-bold tracking-widest uppercase text-sm mb-4 px-4 py-1.5 rounded-full bg-[#00a693]/10 border border-[#00a693]/20">
          Açık Düşünce & Üniversite İnisiyatifi
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Fikri <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693]">Zeminini</span> Burada İnşa Et.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 font-medium leading-relaxed">
          Felsefe, sosyoloji ve psikoloji disiplinlerinde üretilen akademik ve eleştirel metinleri açık erişimli bir arşivde bir araya getiriyoruz.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/dergiler" 
            className="glass-panel px-8 py-4 font-bold text-gray-800 hover:bg-white/60 transition-all flex items-center gap-2"
          >
            Sayıları İncele
          </Link>
          <Link 
            href="/basvuru" 
            className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-gray-900/20 hover:scale-105 transition-transform"
          >
            Yayın Başvurusu →
          </Link>
        </div>
      </section>

      {/* SON YAZILAR VİTRİNİ */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Son Yayınlar</h2>
          <Link href="/arsiv" className="text-sm font-bold text-[#32127a] hover:underline">Tümünü Gör</Link>
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
                <article className="glass-card p-6 h-full flex flex-col justify-between hover:shadow-2xl hover:bg-white/80 transition-all duration-300 border border-white/60 group-hover:border-white">
                  
                  <div>
                    {/* Kategori Etiketi */}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00a693] mb-4 bg-[#00a693]/10 px-2.5 py-1 rounded-md">
                      {yazi.kategori}
                    </span>
                    
                    {/* Yazı Başlığı */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#74112f] transition-colors line-clamp-3">
                      {yazi.baslik}
                    </h3>
                  </div>

                  {/* Yazar Bilgisi */}
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
  );
}

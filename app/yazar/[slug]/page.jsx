'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function YazarProfilPage() {
  const params = useParams();
  const [yazar, setYazar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazarVeYazilar() {
      if (!params?.slug) return;

      const { data } = await supabase
        .from('yazarlar')
        .select(`
          id, ad_soyad, slug, universite, bolum, instagram, biyografi,
          yazilar (id, baslik, slug, kategori, durum, icerik, olusturulma_tarihi, dergiler(sayi_no))
        `)
        .eq('slug', params.slug)
        .single();

      if (data) setYazar(data);
      setLoading(false);
    }
    fetchYazarVeYazilar();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs font-bold text-gray-500">Yazar profili yükleniyor...</p>
      </div>
    );
  }

  if (!yazar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-xl font-black text-gray-900 mb-2">Yazar Bulunamadı</h1>
        <Link href="/yazarlar" className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold">
          Yazar Topluluğuna Dön
        </Link>
      </div>
    );
  }

  const yayindakiYazilar = yazar.yazilar?.filter(y => y.durum === 'onaylandi') || [];

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
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="text-[#00a693] flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* YAZAR PROFİL KARTI */}
        <section className="glass-card p-6 sm:p-8 border border-white/90 shadow-xl mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-3xl shadow-md flex-shrink-0 border-2 border-white">
              {yazar.ad_soyad?.charAt(0) || 'Z'}
            </div>

            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {yazar.ad_soyad}
                </h1>
                {yazar.instagram && (
                  <a
                    href={`https://instagram.com/${yazar.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#00a693] hover:underline justify-center sm:justify-start"
                  >
                    @{yazar.instagram.replace('@', '')} ↗
                  </a>
                )}
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#32127a] mb-3">
                {yazar.universite} — <span className="text-gray-600 font-medium">{yazar.bolum}</span>
              </p>

              {yazar.biyografi && (
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed max-w-2xl">
                  {yazar.biyografi}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* YAZARIN METİNLERİ (OKUMA SÜRELİ) */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Yayımlanan Metinleri ({yayindakiYazilar.length})
            </h2>
          </div>

          {yayindakiYazilar.length === 0 ? (
            <div className="glass-card p-8 text-center text-xs text-gray-500 font-medium">
              Yazarın henüz yayımlanmış bir metni bulunmamaktadır.
            </div>
          ) : (
            <div className="space-y-3">
              {yayindakiYazilar.map((y) => {
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="block group outline-none">
                    <article className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/70 hover:bg-white/90 hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                            {y.kategori}
                          </span>
                          {y.dergiler?.sayi_no && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[#74112f] px-2 py-0.5 rounded">
                              Sayı {y.dergiler.sayi_no}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500 font-bold bg-white/70 px-2 py-0.5 rounded-full border border-gray-100">
                            ⏱ {okumaSuresi} dk
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#74112f] transition-colors line-clamp-1">
                          {y.baslik}
                        </h3>
                      </div>
                      <span className="text-xs font-black text-[#32127a] flex-shrink-0 group-hover:translate-x-1 transition-transform">
                        Metni Oku →
                      </span>
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

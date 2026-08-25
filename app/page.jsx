'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [kategori, setKategori] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getYazilar() {
      setLoading(true);
      let query = supabase
        .from('yazilar')
        .select(`
          id,
          baslik,
          slug,
          kategori,
          icerik,
          olusturulma_tarihi,
          yazarlar (ad_soyad, universite, bolum)
        `)
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false });

      if (kategori !== 'Tümü') {
        query = query.eq('kategori', kategori);
      }

      const { data, error } = await query;
      if (!error && data) setYazilar(data);
      setLoading(false);
    }

    getYazilar();
  }, [kategori]);

  const mansetYazi = yazilar[0];
  const yanYazilar = yazilar.slice(1, 4);
  const digerYazilar = yazilar.slice(4);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* KATEGORİ FİLTRELERİ */}
      <section className="border-b border-[#E2DDD5] pb-3 mb-10 flex items-center justify-between">
        <div className="flex gap-6 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
          {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
            <button
              key={kat}
              onClick={() => setKategori(kat)}
              className={`pb-1 transition-colors ${
                kategori === kat
                  ? 'border-b-2 border-[#4E141E] text-[#4E141E]'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#5E7362] font-semibold hidden sm:inline uppercase tracking-widest">
          Serbest Kürsü
        </span>
      </section>

      {loading ? (
        <div className="py-28 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">
          Arşiv taranıyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[#E2DDD5] p-12">
          <p className="font-editorial text-2xl text-[#1A1A1A]/70 mb-3">Bu alanda henüz yayımlanmış metin bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-semibold text-[#4E141E] underline">
            İlk metni sen gönder
          </Link>
        </div>
      ) : (
        <>
          {/* 1. BÖLÜM: EDİTORYAL MANŞET VE YAN KOLON */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E2DDD5]">
            {/* Büyük Manşet Metni (Sol 7 Kolon) */}
            {mansetYazi && (
              <article className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#E2DDD5] pb-8 lg:pb-0">
                <div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-[#5E7362] mb-3">
                    <span>{mansetYazi.kategori}</span>
                    <span>•</span>
                    <span className="text-[#1A1A1A]/50">Öne Çıkan</span>
                  </div>

                  <Link href={`/yazi/${mansetYazi.slug}`} className="group block">
                    <h1 className="font-editorial text-3xl md:text-5xl font-bold leading-[1.15] text-[#1A1A1A] group-hover:text-[#4E141E] transition-colors mb-5">
                      {mansetYazi.baslik}
                    </h1>
                  </Link>

                  <p className="font-editorial text-lg md:text-xl text-[#1A1A1A]/80 leading-relaxed line-clamp-4 mb-6">
                    {mansetYazi.icerik}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2DDD5]/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-sm text-[#1A1A1A] block">{mansetYazi.yazarlar?.ad_soyad}</span>
                    <span className="text-[#1A1A1A]/60">{mansetYazi.yazarlar?.universite} · {mansetYazi.yazarlar?.bolum}</span>
                  </div>
                  <Link href={`/yazi/${mansetYazi.slug}`} className="font-semibold text-[#4E141E] hover:underline uppercase tracking-wider text-[11px]">
                    Okumaya Başla →
                  </Link>
                </div>
              </article>
            )}

            {/* Yan Kolon Metinleri (Sağ 5 Kolon) */}
            <div className="lg:col-span-5 divide-y divide-[#E2DDD5] flex flex-col justify-between">
              {yanYazilar.map((yazi) => (
                <article key={yazi.id} className="py-5 first:pt-0 last:pb-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-1.5">
                    {yazi.kategori}
                  </span>
                  <Link href={`/yazi/${yazi.slug}`} className="group block">
                    <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A] group-hover:text-[#4E141E] transition-colors leading-snug mb-2">
                      {yazi.baslik}
                    </h2>
                  </Link>
                  <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed mb-3">
                    {yazi.icerik}
                  </p>
                  <div className="text-[11px] text-[#1A1A1A]/60">
                    <span className="font-semibold text-[#1A1A1A]">{yazi.yazarlar?.ad_soyad}</span> — {yazi.yazarlar?.universite}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 2. BÖLÜM: SAYI DOSYASI BANTI */}
          <section className="my-14 py-8 px-6 md:px-10 bg-[#1A1A1A] text-[#F8F6F0] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#8CA090] font-semibold mb-2">
                <span>Tematik Seçki</span>
                <span>•</span>
                <span>Sayı 01</span>
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl font-bold">Bellek, Zaman ve İrade</h3>
              <p className="text-xs md:text-sm text-[#F8F6F0]/70 mt-1 font-editorial italic">
                Bireyin mekanla ve hafızayla kurduğu bağıntıyı tartışmaya açan özel dosya metinleri.
              </p>
            </div>
            <Link
              href="/dergiler"
              className="border border-[#F8F6F0]/40 text-[#F8F6F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#F8F6F0] hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
            >
              Dosyayı İncele →
            </Link>
          </section>

          {/* 3. BÖLÜM: GAZETE SÜTUNLARI (DİĞER METİNLER) */}
          {digerYazilar.length > 0 && (
            <section className="pt-2">
              <div className="border-b border-[#E2DDD5] pb-2 mb-8">
                <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Arşivden Diğer Metinler</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {digerYazilar.map((yazi) => (
                  <article key={yazi.id} className="flex flex-col justify-between border-b md:border-b-0 md:border-r last:border-r-0 border-[#E2DDD5] pr-0 md:pr-6 pb-6 md:pb-0">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-2">
                        {yazi.kategori}
                      </span>
                      <Link href={`/yazi/${yazi.slug}`} className="group block">
                        <h4 className="font-editorial text-xl font-bold text-[#1A1A1A] group-hover:text-[#4E141E] transition-colors leading-snug mb-3">
                          {yazi.baslik}
                        </h4>
                      </Link>
                      <p className="text-xs text-[#1A1A1A]/70 line-clamp-3 leading-relaxed mb-4">
                        {yazi.icerik}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#E2DDD5]/60 text-xs">
                      <span className="font-semibold block text-[#1A1A1A]">{yazi.yazarlar?.ad_soyad}</span>
                      <span className="text-[11px] text-[#1A1A1A]/60">{yazi.yazarlar?.universite}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

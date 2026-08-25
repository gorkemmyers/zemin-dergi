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
  const yanYazilar = yazilar.slice(1, 3);
  const digerYazilar = yazilar.slice(3);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* KATEGORİ FİLTRE BUTONLARI (HAREKETLİ BORDO/YEŞİL PİLLER) */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-zemin-cizgi pb-4">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider font-bold">
          {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
            <button
              key={kat}
              onClick={() => setKategori(kat)}
              className={`px-4 py-2 transition-all cursor-pointer ${
                kategori === kat
                  ? 'bg-zemin-bordo text-zemin-bej shadow-[2px_2px_0px_#2D4F38] -translate-y-0.5'
                  : 'bg-zemin-kagit text-zemin-metin border border-zemin-cizgi hover:border-zemin-bordo hover:text-zemin-bordo'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-zemin-yesil bg-zemin-yesil/10 px-3 py-1.5 border border-zemin-yesil/30">
          ● Açık Öğrenci Koleksiyonu
        </span>
      </section>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-zemin-metin/60 font-bold">
          Arşiv Taranıyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zemin-bordo/30 bg-zemin-kagit p-10">
          <p className="font-serif text-3xl text-zemin-bordo font-bold mb-3">Bu alanda henüz onaylanmış metin bulunmuyor.</p>
          <p className="text-xs text-zemin-metin/70 mb-6">İlk araştırmayı veya denemeyi sen göndererek arşivi başlat.</p>
          <Link href="/basvuru" className="inline-block bg-zemin-bordo text-zemin-bej px-6 py-3 text-xs uppercase tracking-widest font-bold shadow-[3px_3px_0px_#2D4F38]">
            + Metin Gönder
          </Link>
        </div>
      ) : (
        <>
          {/* 1. BÖLÜM: BÜYÜK BORDO MANŞET BLOĞU & YAN KARTLAR */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Büyük Bordo Manşet Kartı */}
            {mansetYazi && (
              <article className="lg:col-span-8 bg-zemin-bordo text-zemin-bej p-8 md:p-10 border-2 border-zemin-bordo shadow-[4px_4px_0px_#2D4F38] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold mb-4">
                    <span className="bg-zemin-yesil text-zemin-bej px-2.5 py-1">
                      {mansetYazi.kategori}
                    </span>
                    <span className="text-zemin-bej/60">• Manşet Metin</span>
                  </div>

                  <Link href={`/yazi/${mansetYazi.slug}`} className="block">
                    <h1 className="font-serif text-3xl md:text-5xl font-black leading-tight text-zemin-bej group-hover:text-zemin-kagit transition-colors mb-5">
                      {mansetYazi.baslik}
                    </h1>
                  </Link>

                  <p className="font-serif text-lg md:text-xl text-zemin-bej/85 leading-relaxed line-clamp-4 font-normal mb-8">
                    {mansetYazi.icerik}
                  </p>
                </div>

                <div className="pt-6 border-t border-zemin-bej/20 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-base block text-zemin-bej">{mansetYazi.yazarlar?.ad_soyad}</span>
                    <span className="text-zemin-bej/70">{mansetYazi.yazarlar?.universite} · {mansetYazi.yazarlar?.bolum}</span>
                  </div>
                  <Link
                    href={`/yazi/${mansetYazi.slug}`}
                    className="bg-zemin-bej text-zemin-bordo font-bold px-5 py-2.5 uppercase tracking-widest text-xs hover:bg-zemin-yesil hover:text-zemin-bej transition-all"
                  >
                    Metni Oku →
                  </Link>
                </div>
              </article>
            )}

            {/* Yan Kolon Kartları */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {yanYazilar.map((yazi) => (
                <article
                  key={yazi.id}
                  className="bg-zemin-kagit p-6 border-2 border-zemin-cizgi hover:border-zemin-bordo transition-all shadow-[3px_3px_0px_#DDD7CA] hover:shadow-[3px_3px_0px_#4E141E] flex flex-col justify-between flex-1"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-yesil bg-zemin-yesil/10 px-2 py-0.5 inline-block mb-2">
                      {yazi.kategori}
                    </span>
                    <Link href={`/yazi/${yazi.slug}`} className="block group">
                      <h2 className="font-serif text-2xl font-bold text-zemin-metin group-hover:text-zemin-bordo transition-colors leading-snug mb-2">
                        {yazi.baslik}
                      </h2>
                    </Link>
                    <p className="text-xs text-zemin-metin/75 line-clamp-3 leading-relaxed mb-4">
                      {yazi.icerik}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-zemin-cizgi flex justify-between items-center text-xs">
                    <span className="font-bold text-zemin-metin truncate">{yazi.yazarlar?.ad_soyad}</span>
                    <Link href={`/yazi/${yazi.slug}`} className="font-bold text-zemin-bordo hover:underline whitespace-nowrap">
                      Oku →
                    </Link>
                  </div>
                </article>
              ))}

              {yanYazilar.length === 0 && (
                <div className="p-8 border-2 border-dashed border-zemin-cizgi bg-zemin-kagit/60 text-center flex-1 flex flex-col justify-center items-center">
                  <span className="text-xs text-zemin-yesil uppercase tracking-widest font-bold">Açık Kürsü</span>
                  <p className="font-serif text-lg text-zemin-metin/70 mt-1">Yeni metinler editör masasında inceleniyor.</p>
                </div>
              )}
            </div>
          </section>

          {/* 2. BÖLÜM: DERGİLER ÇAĞRI ŞERİDİ */}
          <section className="mb-14 p-8 bg-zemin-yesil text-zemin-bej border-2 border-zemin-yesil shadow-[4px_4px_0px_#4E141E] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest bg-zemin-bej text-zemin-yesil px-2.5 py-0.5 font-black">
                Tematik Arşiv
              </span>
              <h3 className="font-serif text-3xl font-bold text-zemin-bej mt-2">Dergiler & Aylık Seçkiler</h3>
              <p className="text-xs md:text-sm text-zemin-bej/85 font-serif italic mt-1">
                Felsefe, sosyoloji ve psikoloji alanında yayımlanan bağımsız öğrenci metinlerinin tematik derlemesi.
              </p>
            </div>
            <Link
              href="/dergiler"
              className="bg-zemin-bordo text-zemin-bej px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-zemin-bordokoyu transition-all whitespace-nowrap shadow-[2px_2px_0px_#F5F2EB]"
            >
              Dergileri İncele →
            </Link>
          </section>

          {/* 3. BÖLÜM: DİĞER ARŞİV KARTLARI (3'LÜ DİNAMİK GRID) */}
          {digerYazilar.length > 0 && (
            <section>
              <div className="border-b-2 border-zemin-bordo pb-2 mb-6 flex justify-between items-end">
                <h3 className="font-serif text-3xl font-bold text-zemin-bordo">Arşiv Metinleri</h3>
                <span className="text-xs uppercase tracking-widest text-zemin-yesil font-bold">Koleksiyon</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {digerYazilar.map((yazi) => (
                  <article
                    key={yazi.id}
                    className="bg-zemin-kagit border-2 border-zemin-cizgi hover:border-zemin-bordo p-6 flex flex-col justify-between shadow-[3px_3px_0px_#DDD7CA] hover:shadow-[3px_3px_0px_#4E141E] transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-3">
                        <span className="text-zemin-yesil bg-zemin-yesil/10 px-2 py-0.5">{yazi.kategori}</span>
                        <span className="text-zemin-metin/40">{new Date(yazi.olusturulma_tarihi).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <Link href={`/yazi/${yazi.slug}`}>
                        <h4 className="font-serif text-2xl font-bold text-zemin-metin group-hover:text-zemin-bordo transition-colors leading-snug mb-3">
                          {yazi.baslik}
                        </h4>
                      </Link>
                      <p className="text-xs text-zemin-metin/75 line-clamp-3 leading-relaxed mb-6">
                        {yazi.icerik}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zemin-cizgi text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold block text-zemin-metin">{yazi.yazarlar?.ad_soyad}</span>
                        <span className="text-[11px] text-zemin-metin/60 truncate">{yazi.yazarlar?.universite}</span>
                      </div>
                      <Link href={`/yazi/${yazi.slug}`} className="font-bold text-zemin-bordo hover:underline">
                        Oku →
                      </Link>
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

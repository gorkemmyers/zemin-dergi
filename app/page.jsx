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
      {/* FİLTRE ŞERİDİ */}
      <section className="border-b border-zemin-cizgi pb-3 mb-10 flex items-center justify-between">
        <div className="flex gap-6 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
          {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
            <button
              key={kat}
              onClick={() => setKategori(kat)}
              className={`pb-1 transition-colors ${
                kategori === kat
                  ? 'border-b-2 border-zemin-bordo text-zemin-bordo font-bold'
                  : 'text-zemin-metin/60 hover:text-zemin-metin'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zemin-yesil font-bold hidden sm:inline uppercase tracking-widest bg-zemin-yesil/10 px-2.5 py-1 rounded">
          Açık Düşünce Serisi
        </span>
      </section>

      {loading ? (
        <div className="py-28 text-center text-xs uppercase tracking-widest text-zemin-metin/50">
          Metinler taranıyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zemin-cizgi bg-zemin-kagit/50 p-12">
          <p className="font-serif text-2xl text-zemin-metin/80 mb-3">Bu alanda henüz onaylanmış metin bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-bold text-zemin-bordo underline">
            İlk metni sen gönder
          </Link>
        </div>
      ) : (
        <>
          {/* MANŞET VE YAN KOLON */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-zemin-cizgi">
            {/* Büyük Manşet */}
            {mansetYazi && (
              <article className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-zemin-cizgi pb-8 lg:pb-0">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-3">
                    <span className="bg-zemin-yesil/10 px-2 py-0.5 rounded">{mansetYazi.kategori}</span>
                    <span>•</span>
                    <span className="text-zemin-metin/50 font-medium">Öne Çıkan</span>
                  </div>

                  <Link href={`/yazi/${mansetYazi.slug}`} className="group block">
                    <h1 className="font-serif text-3xl md:text-5xl font-bold leading-[1.15] text-zemin-bordo group-hover:text-zemin-bordokoyu transition-colors mb-5">
                      {mansetYazi.baslik}
                    </h1>
                  </Link>

                  <p className="font-serif text-lg md:text-xl text-zemin-metin/85 leading-relaxed line-clamp-4 mb-6">
                    {mansetYazi.icerik}
                  </p>
                </div>

                <div className="pt-4 border-t border-zemin-cizgi flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sm text-zemin-metin block">{mansetYazi.yazarlar?.ad_soyad}</span>
                    <span className="text-zemin-metin/60">{mansetYazi.yazarlar?.universite} · {mansetYazi.yazarlar?.bolum}</span>
                  </div>
                  <Link href={`/yazi/${mansetYazi.slug}`} className="font-bold text-zemin-bordo hover:text-zemin-yesil transition-colors uppercase tracking-wider text-[11px]">
                    Okumaya Başla →
                  </Link>
                </div>
              </article>
            )}

            {/* Yan Kolon */}
            <div className="lg:col-span-5 divide-y divide-zemin-cizgi flex flex-col justify-between">
              {yanYazilar.map((yazi) => (
                <article key={yazi.id} className="py-5 first:pt-0 last:pb-0">
                  <span className="text-[10px] uppercase tracking-widest text-zemin-yesil font-bold block mb-1.5">
                    {yazi.kategori}
                  </span>
                  <Link href={`/yazi/${yazi.slug}`} className="group block">
                    <h2 className="font-serif text-2xl font-bold text-zemin-metin group-hover:text-zemin-bordo transition-colors leading-snug mb-2">
                      {yazi.baslik}
                    </h2>
                  </Link>
                  <p className="text-xs text-zemin-metin/75 line-clamp-2 leading-relaxed mb-3">
                    {yazi.icerik}
                  </p>
                  <div className="text-[11px] text-zemin-metin/60">
                    <span className="font-semibold text-zemin-metin">{yazi.yazarlar?.ad_soyad}</span> — {yazi.yazarlar?.universite}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* TEMATİK SEÇKİ BANTI (BORDO GÖVDE + YEŞİL VURGU) */}
          <section className="my-14 py-8 px-8 md:px-12 bg-zemin-bordo text-zemin-bej flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-zemin-yesilacik font-bold mb-2">
                <span className="bg-zemin-yesil/30 px-2 py-0.5 border border-zemin-yesilacik/30">Tematik Sayı</span>
                <span>•</span>
                <span>Sayı 01</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-zemin-bej">Bellek, Zaman ve İrade</h3>
              <p className="text-xs md:text-sm text-zemin-bej/80 mt-2 font-serif italic leading-relaxed">
                "Zihin, toplum ve mekan üçgeninde bireyin kopuşunu ve hafızayla kurduğu bağıntıyı tartışmaya açan metinler."
              </p>
            </div>
            <Link
              href="/dergiler"
              className="bg-zemin-bej text-zemin-bordo px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-zemin-yesil hover:text-zemin-bej transition-colors whitespace-nowrap"
            >
              Sayıyı İncele →
            </Link>
          </section>

          {/* SÜTUNLAR */}
          {digerYazilar.length > 0 && (
            <section className="pt-2">
              <div className="border-b border-zemin-cizgi pb-2 mb-8 flex justify-between items-end">
                <h3 className="font-serif text-2xl font-bold text-zemin-bordo">Arşivden Diğer Metinler</h3>
                <span className="text-[11px] uppercase tracking-widest text-zemin-yesil font-semibold">Tüm Koleksiyon</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {digerYazilar.map((yazi) => (
                  <article key={yazi.id} className="flex flex-col justify-between border-b md:border-b-0 md:border-r last:border-r-0 border-zemin-cizgi pr-0 md:pr-6 pb-6 md:pb-0">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-zemin-yesil font-bold block mb-2">
                        {yazi.kategori}
                      </span>
                      <Link href={`/yazi/${yazi.slug}`} className="group block">
                        <h4 className="font-serif text-xl font-bold text-zemin-metin group-hover:text-zemin-bordo transition-colors leading-snug mb-3">
                          {yazi.baslik}
                        </h4>
                      </Link>
                      <p className="text-xs text-zemin-metin/75 line-clamp-3 leading-relaxed mb-4">
                        {yazi.icerik}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zemin-cizgi text-xs">
                      <span className="font-bold block text-zemin-metin">{yazi.yazarlar?.ad_soyad}</span>
                      <span className="text-[11px] text-zemin-metin/60">{yazi.yazarlar?.universite}</span>
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

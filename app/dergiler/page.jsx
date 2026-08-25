'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DergilerPage() {
  const [dergiler, setDergiler] = useState([]);
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVeriler() {
      setLoading(true);

      const { data: dData } = await supabase
        .from('dergiler')
        .select('*')
        .order('sayi_no', { ascending: false });

      const { data: yData } = await supabase
        .from('yazilar')
        .select('id, baslik, slug, kategori, dergi_id, yazarlar(ad_soyad, universite)')
        .eq('durum', 'onaylandi');

      if (dData) setDergiler(dData);
      if (yData) setYazilar(yData);

      setLoading(false);
    }

    fetchVeriler();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <header className="border-b-2 border-zemin-bordo pb-6 mb-10">
        <span className="text-xs uppercase tracking-widest text-zemin-yesil font-bold bg-zemin-yesil/10 px-3 py-1">
          Koleksiyon
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black text-zemin-bordo mt-3">Sayılar & Tematik Seçkiler</h1>
        <p className="text-xs md:text-sm text-zemin-metin/80 mt-2 max-w-2xl leading-relaxed">
          ZEMİN tarafından tematik odaklarla derlenen süreli yayın sayıları ve dijital baskı arşivi.
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest font-bold text-zemin-metin/50">
          Koleksiyon taranıyor...
        </div>
      ) : dergiler.length === 0 ? (
        <div className="bg-zemin-kagit border-2 border-dashed border-zemin-bordo p-10 text-center">
          <p className="font-serif text-2xl font-bold text-zemin-bordo mb-2">İlk sayı hazırlık aşamasında.</p>
          <p className="text-xs text-zemin-metin/70 mb-6">Metinlerini göndererek ilk sayının içeriğine dahil olabilirsin.</p>
          <Link href="/basvuru" className="inline-block bg-zemin-bordo text-zemin-bej px-6 py-3 text-xs uppercase tracking-widest font-bold shadow-[2px_2px_0px_#2D4F38]">
            + Metin Gönder
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {dergiler.map((d) => {
            const sayidakiYazilar = yazilar.filter(y => y.dergi_id === d.id);
            return (
              <section
                key={d.id}
                className="bg-zemin-kagit border-2 border-zemin-bordo p-6 md:p-10 shadow-[5px_5px_0px_#4E141E]"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Sol: Kapak */}
                  <div className="md:col-span-3 flex justify-center">
                    {d.kapak_url ? (
                      <img
                        src={d.kapak_url}
                        alt={`Sayı ${d.sayi_no} Kapak`}
                        className="w-full max-w-[200px] aspect-[3/4] object-cover border-2 border-zemin-bordo shadow-md"
                      />
                    ) : (
                      <div className="w-full max-w-[200px] aspect-[3/4] bg-zemin-bordo text-zemin-bej p-4 flex flex-col justify-between text-center border-2 border-zemin-bordo">
                        <span className="text-[9px] uppercase tracking-widest text-zemin-yesilacik font-bold">ZEMİN</span>
                        <h4 className="font-serif text-2xl font-black">Sayı {d.sayi_no}</h4>
                        <span className="text-[10px] opacity-75">{d.durum === 'yayinda' ? 'Yayında' : 'Hazırlıkta'}</span>
                      </div>
                    )}
                  </div>

                  {/* Sağ: Bilgiler & Yazılar */}
                  <div className="md:col-span-9 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-zemin-bordo text-zemin-bej text-xs uppercase tracking-widest font-black px-2.5 py-0.5">
                          Sayı {d.sayi_no}
                        </span>
                        <span className={`text-xs uppercase tracking-widest font-bold ${
                          d.durum === 'yayinda' ? 'text-zemin-yesil' : 'text-amber-800'
                        }`}>
                          ● {d.durum === 'yayinda' ? 'Yayında' : 'Yazı Kabulü Sürüyor'}
                        </span>
                      </div>

                      {d.pdf_url && (
                        <a
                          href={d.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-zemin-yesil text-zemin-bej px-4 py-2 text-xs uppercase tracking-widest font-bold hover:opacity-90"
                        >
                          PDF Oku / İndir ↗
                        </a>
                      )}
                    </div>

                    <h2 className="font-serif text-3xl font-black text-zemin-bordo leading-tight">{d.baslik}</h2>

                    {d.tema_aciklama && (
                      <p className="font-serif text-base text-zemin-metin/80 italic leading-relaxed">
                        "{d.tema_aciklama}"
                      </p>
                    )}

                    {/* Bu Sayıdaki Makaleler */}
                    <div className="border-t border-zemin-cizgi pt-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-yesil block mb-2">
                        İçindekiler ({sayidakiYazilar.length} Metin):
                      </span>
                      {sayidakiYazilar.length === 0 ? (
                        <p className="text-xs text-zemin-metin/60 italic">Bu sayı için metin seçimi devam ediyor.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sayidakiYazilar.map(y => (
                            <Link
                              key={y.id}
                              href={`/yazi/${y.slug}`}
                              className="p-2.5 bg-zemin-bej border border-zemin-cizgi hover:border-zemin-bordo flex justify-between items-center group transition-colors"
                            >
                              <div className="truncate pr-2">
                                <span className="font-serif font-bold text-sm text-zemin-metin group-hover:text-zemin-bordo block truncate">
                                  {y.baslik}
                                </span>
                                <span className="text-[11px] text-zemin-metin/60">
                                  {y.yazarlar?.ad_soyad}
                                </span>
                              </div>
                              <span className="text-zemin-bordo font-bold">→</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

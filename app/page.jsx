'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const KATEGORI_STIL = {
  Felsefe: { tint: 'bg-zemin-kil/10', tagBg: 'bg-zemin-kil/15', tagText: 'text-zemin-kilkoyu', index: 'text-zemin-kil', hover: 'group-hover:text-zemin-kilkoyu', border: 'hover:border-zemin-kil' },
  Sosyoloji: { tint: 'bg-zemin-hardal/10', tagBg: 'bg-zemin-hardal/15', tagText: 'text-zemin-hardalkoyu', index: 'text-zemin-hardal', hover: 'group-hover:text-zemin-hardalkoyu', border: 'hover:border-zemin-hardal' },
  Psikoloji: { tint: 'bg-zemin-gece/10', tagBg: 'bg-zemin-gece/15', tagText: 'text-zemin-gecekoyu', index: 'text-zemin-gece', hover: 'group-hover:text-zemin-gecekoyu', border: 'hover:border-zemin-gece' },
};
const VARSAYILAN_STIL = { tint: 'bg-zemin-kagitkoyu', tagBg: 'bg-zemin-murekkep/10', tagText: 'text-zemin-murekkep', index: 'text-zemin-murekkep', hover: 'group-hover:text-zemin-kil', border: 'hover:border-zemin-murekkep' };

export default function HomePage() {
  const [yazilar, setYazilar] = useState([]);
  const [sonDergi, setSonDergi] = useState(null);
  const [dergiYazilari, setDergiYazilari] = useState([]);
  const [kategori, setKategori] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getVeriler() {
      setLoading(true);

      const { data: dData } = await supabase
        .from('dergiler')
        .select('*')
        .order('sayi_no', { ascending: false })
        .limit(1);

      if (dData && dData.length > 0) {
        const aktuelDergi = dData[0];
        setSonDergi(aktuelDergi);

        const { data: dyData } = await supabase
          .from('yazilar')
          .select('id, baslik, slug, kategori, yazarlar(ad_soyad, universite)')
          .eq('dergi_id', aktuelDergi.id)
          .eq('durum', 'onaylandi');

        if (dyData) setDergiYazilari(dyData);
      }

      let query = supabase
        .from('yazilar')
        .select(`
          id,
          baslik,
          slug,
          kategori,
          icerik,
          dergi_id,
          olusturulma_tarihi,
          yazarlar (ad_soyad, universite, bolum)
        `)
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false });

      if (kategori !== 'Tümü') {
        query = query.eq('kategori', kategori);
      }

      const { data: yData } = await query;
      if (yData) setYazilar(yData);

      setLoading(false);
    }

    getVeriler();
  }, [kategori]);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {sonDergi ? (
        <section className="zemin-giris mb-16 bg-zemin-murekkep text-zemin-kagit border-t-4 border-zemin-kil shadow-xl p-8 md:p-12 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              {sonDergi.kapak_url ? (
                <img
                  src={sonDergi.kapak_url}
                  alt={`Sayı ${sonDergi.sayi_no} Kapak`}
                  className="w-full max-w-[260px] aspect-[3/4] object-cover rounded-sm shadow-lg"
                />
              ) : (
                <div className="w-full max-w-[260px] aspect-[3/4] bg-zemin-murekkep border border-zemin-kagit/25 rounded-sm p-6 flex flex-col justify-between text-center">
                  <span className="text-[10px] uppercase tracking-widest text-zemin-kil font-bold">Süreli Yayın</span>
                  <div>
                    <h3 className="font-serif text-3xl font-black text-zemin-kagit">ZEMİN</h3>
                    <p className="text-xs uppercase tracking-widest text-zemin-kagit/70 mt-1 font-bold">Sayı {sonDergi.sayi_no}</p>
                  </div>
                  <span className="text-[11px] text-zemin-kagit/60 font-serif italic">Felsefe · Sosyoloji · Psikoloji</span>
                </div>
              )}
            </div>

            <div className="md:col-span-8 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-black text-zemin-kil mb-2">
                  <span className="bg-zemin-kil/20 px-2.5 py-1 rounded-sm border border-zemin-kil/30">
                    Sayı {sonDergi.sayi_no}
                  </span>
                  <span>•</span>
                  <span className="text-zemin-kagit/70">{sonDergi.durum === 'yayinda' ? 'Yayında & Açık Erişim' : 'Hazırlık Aşamasında'}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-black text-zemin-kagit leading-tight">
                  {sonDergi.baslik}
                </h1>

                {sonDergi.tema_aciklama && (
                  <p className="text-sm md:text-base text-zemin-kagit/80 font-serif italic mt-3 leading-relaxed">
                    "{sonDergi.tema_aciklama}"
                  </p>
                )}
              </div>

              {dergiYazilari.length > 0 && (
                <div className="border-t border-zemin-kagit/15 pt-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-kil block mb-2">
                    Bu Sayıdaki Makaleler ({dergiYazilari.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {dergiYazilari.map((dy) => (
                      <Link key={dy.id} href={`/yazi/${dy.slug}`} className="hover:text-zemin-kil truncate font-serif text-zemin-kagit/90">
                        • {dy.baslik} <span className="opacity-70 text-[11px] font-sans">({dy.yazarlar?.ad_soyad})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zemin-kagit/15 flex flex-wrap gap-3">
                {sonDergi.pdf_url && (
                  <a
                    href={sonDergi.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-zemin-kagit text-zemin-murekkep px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-black hover:bg-zemin-kil hover:text-zemin-kagit transition-all"
                  >
                    Dergiyi Oku / İndir (PDF) ↗
                  </a>
                )}
                <Link
                  href="/dergiler"
                  className="border border-zemin-kagit/40 text-zemin-kagit px-5 py-3 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-zemin-kagit hover:text-zemin-murekkep transition-all"
                >
                  Tüm Sayılar Arşivi →
                </Link>
                {sonDergi.durum === 'hazirlikta' && (
                  <Link
                    href="/basvuru"
                    className="bg-zemin-kil text-zemin-kagit px-5 py-3 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-zemin-kilkoyu transition-all"
                  >
                    Bu Sayıya Metin Gönder +
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="zemin-giris mb-14 border-l-4 border-zemin-kil bg-zemin-kagitkoyu p-8 rounded-r-md">
          <span className="text-xs uppercase tracking-widest font-bold text-zemin-kil">Açık Yayın</span>
          <h2 className="font-serif text-3xl font-black text-zemin-murekkep mt-1 mb-2">ZEMİN Düşünce Arşivi</h2>
          <p className="text-xs text-zemin-murekkepacik max-w-lg mb-4">
            Felsefe, sosyoloji ve psikoloji alanında bağımsız araştırmalar ve serbest denemeler.
          </p>
          <Link href="/basvuru" className="inline-block bg-zemin-murekkep text-zemin-kagit px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-zemin-kil transition-colors">
            + Metin Gönder
          </Link>
        </section>
      )}

      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="font-serif text-3xl font-black text-zemin-murekkep">Yazılar</h2>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider font-bold">
            {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`px-3 py-1.5 rounded-sm transition-all cursor-pointer ${
                  kategori === kat
                    ? 'bg-zemin-murekkep text-zemin-kagit'
                    : 'bg-zemin-kagitkoyu text-zemin-murekkepacik border border-zemin-cizgi hover:border-zemin-kil'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-zemin-kil">
          Toplam {yazilar.length} Metin
        </span>
      </section>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest font-bold text-zemin-murekkepacik/60">
          Metinler taranıyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-16 text-center border-l-4 border-zemin-kil bg-zemin-kagitkoyu p-8 rounded-r-md">
          <p className="font-serif text-2xl text-zemin-murekkep font-bold mb-2">Bu alanda henüz onaylanmış metin bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-bold text-zemin-kil underline">
            İlk metni sen gönder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {yazilar.map((yazi, i) => {
            const stil = KATEGORI_STIL[yazi.kategori] || VARSAYILAN_STIL;
            const noStr = String(i + 1).padStart(2, '0');
            const oneCikan = i === 0;
            return (
              <article
                key={yazi.id}
                className={`zemin-giris relative rounded-md border border-zemin-cizgi ${stil.border} ${stil.tint} p-5 pt-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group ${oneCikan ? 'md:col-span-2' : ''}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className={`absolute top-4 left-5 text-xs font-black font-serif ${stil.index}`}>
                  {noStr}
                </span>

                <div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-3">
                    <span className={`px-2 py-0.5 rounded-sm ${stil.tagBg} ${stil.tagText}`}>{yazi.kategori}</span>
                    {yazi.dergi_id && (
                      <span className="bg-zemin-murekkep text-zemin-kagit px-1.5 py-0.5 rounded-sm text-[9px] font-black">
                        Dergide
                      </span>
                    )}
                  </div>
                  <Link href={`/yazi/${yazi.slug}`}>
                    <h3 className={`font-serif ${oneCikan ? 'text-3xl' : 'text-2xl'} font-bold text-zemin-murekkep transition-colors leading-snug mb-3 ${stil.hover}`}>
                      {yazi.baslik}
                    </h3>
                  </Link>
                  <p className={`text-xs text-zemin-murekkepacik leading-relaxed mb-6 font-serif text-[13px] ${oneCikan ? 'line-clamp-4' : 'line-clamp-3'}`}>
                    {yazi.icerik}
                  </p>
                </div>

                <div className="pt-4 border-t border-zemin-cizgi text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-zemin-murekkep">{yazi.yazarlar?.ad_soyad}</span>
                    <span className="text-[11px] text-zemin-murekkepacik/70 truncate">{yazi.yazarlar?.universite}</span>
                  </div>
                  <Link href={`/yazi/${yazi.slug}`} className="font-bold text-zemin-kil hover:underline">
                    Oku →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

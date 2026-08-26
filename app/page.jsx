'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const KATEGORI_STIL = {
  Felsefe: { tag: 'text-zemin-turuncukoyu bg-zemin-turuncu/15', index: 'text-zemin-turuncu', hover: 'group-hover:text-zemin-turuncukoyu' },
  Sosyoloji: { tag: 'text-zemin-hardalkoyu bg-zemin-hardal/15', index: 'text-zemin-hardal', hover: 'group-hover:text-zemin-hardalkoyu' },
  Psikoloji: { tag: 'text-zemin-mavikoyu bg-zemin-mavi/15', index: 'text-zemin-mavi', hover: 'group-hover:text-zemin-mavikoyu' },
};
const VARSAYILAN_STIL = { tag: 'text-zemin-yesil bg-zemin-yesil/10', index: 'text-zemin-yesil', hover: 'group-hover:text-zemin-yesilacik' };

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
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {sonDergi ? (
        <section className="mb-14 bg-zemin-bordo text-zemin-bej border-2 border-zemin-bordo shadow-[6px_6px_0px_#2D4F38] p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              {sonDergi.kapak_url ? (
                <img
                  src={sonDergi.kapak_url}
                  alt={`Sayı ${sonDergi.sayi_no} Kapak`}
                  className="w-full max-w-[260px] aspect-[3/4] object-cover border-2 border-zemin-bej shadow-md"
                />
              ) : (
                <div className="w-full max-w-[260px] aspect-[3/4] bg-zemin-bordokoyu border-2 border-zemin-bej/40 p-6 flex flex-col justify-between text-center">
                  <span className="text-[10px] uppercase tracking-widest text-zemin-yesilacik font-bold">Süreli Yayın</span>
                  <div>
                    <h3 className="font-serif text-3xl font-black text-zemin-bej">ZEMİN</h3>
                    <p className="text-xs uppercase tracking-widest text-zemin-bej/80 mt-1 font-bold">Sayı {sonDergi.sayi_no}</p>
                  </div>
                  <span className="text-[11px] text-zemin-bej/70 font-serif italic">Felsefe · Sosyoloji · Psikoloji</span>
                </div>
              )}
            </div>

            <div className="md:col-span-8 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-black text-zemin-yesilacik mb-2">
                  <span className="bg-zemin-yesil/40 px-2.5 py-1 border border-zemin-yesilacik/30">
                    Sayı {sonDergi.sayi_no}
                  </span>
                  <span>•</span>
                  <span>{sonDergi.durum === 'yayinda' ? 'Yayında & Açık Erişim' : 'Hazırlık Aşamasında'}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-black text-zemin-bej leading-tight">
                  {sonDergi.baslik}
                </h1>

                {sonDergi.tema_aciklama && (
                  <p className="text-sm md:text-base text-zemin-bej/85 font-serif italic mt-3 leading-relaxed">
                    "{sonDergi.tema_aciklama}"
                  </p>
                )}
              </div>

              {dergiYazilari.length > 0 && (
                <div className="border-t border-zemin-bej/20 pt-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-yesilacik block mb-2">
                    Bu Sayıdaki Makaleler ({dergiYazilari.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {dergiYazilari.map((dy) => (
                      <Link key={dy.id} href={`/yazi/${dy.slug}`} className="hover:text-zemin-yesilacik truncate font-serif">
                        • {dy.baslik} <span className="opacity-70 text-[11px] font-sans">({dy.yazarlar?.ad_soyad})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zemin-bej/20 flex flex-wrap gap-4">
                {sonDergi.pdf_url && (
                  <a
                    href={sonDergi.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-zemin-bej text-zemin-bordo px-6 py-3 text-xs uppercase tracking-widest font-black hover:bg-zemin-yesil hover:text-zemin-bej transition-all shadow-[2px_2px_0px_#1F1E1B]"
                  >
                    Dergiyi Oku / İndir (PDF) ↗
                  </a>
                )}
                <Link
                  href="/dergiler"
                  className="border-2 border-zemin-bej text-zemin-bej px-5 py-3 text-xs uppercase tracking-widest font-bold hover:bg-zemin-bej hover:text-zemin-bordo transition-all"
                >
                  Tüm Sayılar Arşivi →
                </Link>
                {sonDergi.durum === 'hazirlikta' && (
                  <Link
                    href="/basvuru"
                    className="bg-zemin-yesil text-zemin-bej px-5 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                  >
                    Bu Sayıya Metin Gönder +
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-12 bg-zemin-kagit border-2 border-zemin-bordo p-8 text-center shadow-[4px_4px_0px_#4E141E]">
          <span className="text-xs uppercase tracking-widest font-bold text-zemin-yesil">Açık Yayın</span>
          <h2 className="font-serif text-3xl font-black text-zemin-bordo mt-1 mb-2">ZEMİN Düşünce Arşivi</h2>
          <p className="text-xs text-zemin-metin/75 max-w-lg mx-auto mb-4">
            Felsefe, sosyoloji ve psikoloji alanında bağımsız araştırmalar ve serbest denemeler.
          </p>
          <Link href="/basvuru" className="inline-block bg-zemin-bordo text-zemin-bej px-6 py-2.5 text-xs uppercase tracking-widest font-bold">
            + Metin Gönder
          </Link>
        </section>
      )}

      <section className="border-b-2 border-zemin-bordo pb-3 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-3xl font-black text-zemin-bordo mr-4">Yazılar</h2>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider font-bold">
            {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`px-3 py-1.5 transition-all cursor-pointer ${
                  kategori === kat
                    ? 'bg-zemin-bordo text-zemin-bej shadow-sm'
                    : 'bg-zemin-kagit text-zemin-metin border border-zemin-cizgi hover:border-zemin-bordo'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-zemin-yesil">
          Toplam {yazilar.length} Metin
        </span>
      </section>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest font-bold text-zemin-metin/50">
          Metinler taranıyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-zemin-cizgi bg-zemin-kagit p-8">
          <p className="font-serif text-2xl text-zemin-bordo font-bold mb-2">Bu alanda henüz onaylanmış metin bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-bold text-zemin-bordo underline">
            İlk metni sen gönder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {yazilar.map((yazi, i) => {
            const stil = KATEGORI_STIL[yazi.kategori] || VARSAYILAN_STIL;
            const noStr = String(i + 1).padStart(2, '0');
            return (
              <article
                key={yazi.id}
                className="relative bg-zemin-kagit border-2 border-zemin-cizgi hover:border-zemin-bordo p-6 pt-8 flex flex-col justify-between shadow-[3px_3px_0px_#DDD7CA] hover:shadow-[3px_3px_0px_#4E141E] transition-all group"
              >
                <span className={`absolute top-3 left-4 text-xs font-black font-serif ${stil.index}`}>
                  {noStr}
                </span>

                <div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-3">
                    <span className={`px-2 py-0.5 ${stil.tag}`}>{yazi.kategori}</span>
                    {yazi.dergi_id && (
                      <span className="bg-zemin-bordo text-zemin-bej px-1.5 py-0.5 text-[9px] font-black">
                        Dergide
                      </span>
                    )}
                  </div>
                  <Link href={`/yazi/${yazi.slug}`}>
                    <h3 className={`font-serif text-2xl font-bold text-zemin-metin transition-colors leading-snug mb-3 relative inline ${stil.hover}
                      after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[6px] after:w-0 after:bg-current after:opacity-20 after:-z-10 after:transition-all group-hover:after:w-full`}>
                      {yazi.baslik}
                    </h3>
                  </Link>
                  <p className="text-xs text-zemin-metin/75 line-clamp-3 leading-relaxed mb-6 font-serif text-[13px]">
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
            );
          })}
        </div>
      )}
    </main>
  );
}

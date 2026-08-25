'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DergilerPage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDergiler() {
      setLoading(true);
      const { data, error } = await supabase
        .from('yazilar')
        .select(`
          id,
          baslik,
          slug,
          kategori,
          icerik,
          yazarlar (ad_soyad, universite, bolum)
        `)
        .eq('durum', 'onaylandi')
        .order('olusturulma_tarihi', { ascending: false });

      if (!error && data) {
        setYazilar(data);
      }
      setLoading(false);
    }

    fetchDergiler();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <header className="border-b-2 border-zemin-bordo pb-6 mb-10">
        <span className="text-xs uppercase tracking-widest text-zemin-yesil font-bold bg-zemin-yesil/10 px-3 py-1">
          Koleksiyon
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black text-zemin-bordo mt-3">Dergiler & Tematik Sayılar</h1>
        <p className="text-xs md:text-sm text-zemin-metin/80 mt-2 max-w-2xl leading-relaxed">
          ZEMİN açık düşünce arşivinde yayımlanan bağımsız öğrenci metinlerinin tematik derlemeleri.
        </p>
      </header>

      {/* SAYI 01 ANA KART */}
      <section className="bg-zemin-kagit border-2 border-zemin-bordo p-8 md:p-10 shadow-[5px_5px_0px_#4E141E] mb-12">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-zemin-bordo text-zemin-bej text-xs uppercase tracking-widest font-black px-3 py-1">
              Sayı 01
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-zemin-yesil">
              ● Yayında & Açık Arşiv
            </span>
          </div>
          <span className="text-xs font-bold text-zemin-metin/70 bg-zemin-bej px-3 py-1 border border-zemin-cizgi">
            Toplam {yazilar.length} Onaylı Metin
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl font-black text-zemin-bordo mb-3">
          Bellek, Zaman ve İrade
        </h2>
        <p className="font-serif text-lg text-zemin-metin/80 leading-relaxed italic max-w-3xl mb-8">
          "Zihin, toplum ve mekan üçgeninde bireyin kopuşunu ve hafızayla kurduğu bağıntıyı tartışmaya açan öğrenci metinleri derlemesi."
        </p>

        {/* Bu Sayıdaki Gerçek Metinlerin Listesi */}
        <div className="border-t-2 border-zemin-cizgi pt-6">
          <h3 className="text-xs uppercase tracking-widest font-black text-zemin-yesil mb-4">
            Bu Sayıda Yayımlanan Metinler ({yazilar.length}):
          </h3>

          {loading ? (
            <div className="text-xs uppercase tracking-widest text-zemin-metin/50 py-4 font-bold">
              Metinler yükleniyor...
            </div>
          ) : yazilar.length === 0 ? (
            <div className="bg-zemin-bej p-6 border border-dashed border-zemin-bordo text-center">
              <p className="font-serif text-lg text-zemin-bordo font-bold mb-2">Bu sayıya henüz onaylanmış bir metin eklenmedi.</p>
              <p className="text-xs text-zemin-metin/70 mb-4">İlk metni göndererek Sayı 01'in ilk yazarı olabilirsin.</p>
              <Link href="/basvuru" className="inline-block bg-zemin-bordo text-zemin-bej px-5 py-2.5 text-xs uppercase tracking-widest font-bold">
                + Yazı Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yazilar.map((y) => (
                <Link
                  key={y.id}
                  href={`/yazi/${y.slug}`}
                  className="bg-zemin-bej border border-zemin-cizgi hover:border-zemin-bordo p-4 flex justify-between items-center group transition-all"
                >
                  <div className="pr-4">
                    <span className="text-[9px] uppercase tracking-widest text-zemin-yesil font-bold block mb-1">
                      {y.kategori}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-zemin-metin group-hover:text-zemin-bordo transition-colors">
                      {y.baslik}
                    </h4>
                    <span className="text-xs text-zemin-metin/60">
                      {y.yazarlar?.ad_soyad} ({y.yazarlar?.universite})
                    </span>
                  </div>
                  <span className="text-zemin-bordo font-bold text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GELECEK SAYI ÇAĞRISI */}
      <section className="bg-zemin-bej border-2 border-dashed border-zemin-cizgi p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zemin-bordo font-black">Gelecek Sayı</span>
          <h3 className="font-serif text-2xl font-bold text-zemin-metin mt-1">Sayı 02: Gözetim, Dijital Beden ve Yabancılaşma</h3>
          <p className="text-xs text-zemin-metin/70 mt-1">Açık çağrı devam ediyor. İkinci sayıya metin göndermek için başvurunu yapabilirsin.</p>
        </div>
        <Link
          href="/basvuru"
          className="border-2 border-zemin-bordo text-zemin-bordo px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-zemin-bordo hover:text-zemin-bej transition-all whitespace-nowrap"
        >
          Bu Sayıya Metin Gönder →
        </Link>
      </section>
    </main>
  );
}

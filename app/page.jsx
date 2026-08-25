'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
          yazarlar (ad_soyad, universite, bolum, slug)
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* AYIN SAYISI (HERO BLOĞU) */}
      <section className="bg-[#4E141E] text-[#F7F5F0] p-8 md:p-12 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-[#4E141E]">
        <div className="md:col-span-1 border border-[#8CA090]/40 p-6 text-center bg-[#4E141E]/50 flex flex-col justify-between aspect-[3/4]">
          <span className="text-[10px] uppercase tracking-widest text-[#8CA090] font-semibold">Aylık Seçki</span>
          <div>
            <h2 className="font-editorial text-3xl font-bold tracking-wide">ZEMİN</h2>
            <p className="text-xs uppercase tracking-widest text-[#8CA090] mt-1">Sayı 01</p>
          </div>
          <span className="text-[11px] text-[#F7F5F0]/70 italic">Felsefe · Sosyoloji · Psikoloji</span>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#8CA090] font-semibold">Ayın Sayısı</span>
            <span className="text-xs text-[#8CA090]/60">•</span>
            <span className="text-xs text-[#8CA090]">Sayı 01</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold leading-tight">
            Bellek, Zaman ve İrade
          </h1>
          <p className="text-sm md:text-base text-[#F7F5F0]/80 leading-relaxed font-editorial italic pt-2">
            "Bu ay zihin, toplum ve mekan ucgeninde bireyin kopuşunu ve hafızayla kurduğu bağıntıyı üç bağımsız öğrenci metni üzerinden tartışmaya açıyoruz."
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/dergiler" className="bg-[#F7F5F0] text-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#8CA090] transition-colors">
              Sayıyı İncele
            </Link>
          </div>
        </div>
      </section>

      {/* KATEGORİ FİLTRELERİ */}
      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-[#E3DDD3] pb-4">
          <div className="flex gap-4 md:gap-8 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
            {['Tümü', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`pb-2 transition-colors ${
                  kategori === kat
                    ? 'border-b-2 border-[#4E141E] text-[#4E141E]'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#5E7362] font-semibold hidden md:inline">
            Açık Düşünce Arşivi
          </span>
        </div>
      </section>

      {/* YAZI LİSTESİ / GRID */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">
          Metinler Yükleniyor...
        </div>
      ) : yazilar.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#E3DDD3] p-12">
          <p className="font-editorial text-xl text-[#1A1A1A]/70 mb-3">Bu kategoride henüz yayımlanmış metin bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-semibold text-[#4E141E] underline">
            İlk metni sen gönder
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {yazilar.map((yazi) => (
            <article key={yazi.id} className="border border-[#E3DDD3] p-6 flex flex-col justify-between bg-[#F7F5F0] hover:border-[#4E141E] transition-colors">
              <div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-[#5E7362] mb-3">
                  <span>{yazi.kategori}</span>
                  <span>5 dk okuma</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold leading-snug mb-3 text-[#1A1A1A]">
                  {yazi.baslik}
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed line-clamp-3 mb-6">
                  {yazi.icerik}
                </p>
              </div>

              <div className="border-t border-[#E3DDD3] pt-4 text-xs">
                <span className="font-semibold block text-[#1A1A1A]">
                  {yazi.yazarlar?.ad_soyad}
                </span>
                <span className="text-[#1A1A1A]/60 text-[11px]">
                  {yazi.yazarlar?.universite} · {yazi.yazarlar?.bolum}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* CTA ŞERİDİ */}
      <section className="mt-20 border border-[#E3DDD3] bg-[#F7F5F0] p-8 md:p-12 text-center">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Açık Çağrı</span>
        <h2 className="font-editorial text-3xl font-bold mt-2 mb-4 text-[#1A1A1A]">
          Düşüncelerini Arşive Dahil Et
        </h2>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 max-w-xl mx-auto mb-6 leading-relaxed">
          Felsefe, sosyoloji veya psikoloji alanındaki denemeni gönder; açık web arşivinde bağımsız profilinle yer al ve aylık küratörlü seçkiye dahil ol.
        </p>
        <Link href="/basvuru" className="inline-block bg-[#4E141E] text-[#F7F5F0] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-opacity">
          Metin Gönder
        </Link>
      </section>
    </main>
  );
}

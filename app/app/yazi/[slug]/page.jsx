'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function YaziDetayPage() {
  const params = useParams();
  const [yazi, setYazi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazi() {
      if (!params?.slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('yazilar')
        .select(`
          id,
          baslik,
          kategori,
          icerik,
          olusturulma_tarihi,
          yazarlar (ad_soyad, universite, bolum, instagram, biyografi)
        `)
        .eq('slug', params.slug)
        .single();

      if (!error && data) {
        setYazi(data);
      }
      setLoading(false);
    }

    fetchYazi();
  }, [params]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">
        Metin Yükleniyor...
      </main>
    );
  }

  if (!yazi) {
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-editorial text-3xl font-bold text-[#4E141E] mb-3">Metin Bulunamadı</h1>
        <p className="text-xs text-[#1A1A1A]/70 mb-6">Aradığınız metin yayından kaldırılmış veya taşınmış olabilir.</p>
        <Link href="/" className="text-xs uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-1">
          ← Arşive Dön
        </Link>
      </main>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Üst Bilgi */}
      <div className="border-b border-[#E3DDD3] pb-8 mb-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-[#5E7362] mb-4">
          <Link href="/" className="hover:text-[#4E141E]">Arşiv</Link>
          <span>/</span>
          <span>{yazi.kategori}</span>
        </div>

        <h1 className="font-editorial text-3xl md:text-5xl font-bold leading-tight text-[#1A1A1A] mb-6">
          {yazi.baslik}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#E3DDD3]/60 text-xs">
          <div>
            <span className="font-semibold text-sm text-[#1A1A1A] block">{yazi.yazarlar?.ad_soyad}</span>
            <span className="text-[#1A1A1A]/60">{yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}</span>
          </div>
          {yazi.yazarlar?.instagram && (
            <a
              href={`https://instagram.com/${yazi.yazarlar.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#5E7362] hover:text-[#4E141E] font-medium transition-colors self-start md:self-auto"
            >
              @{yazi.yazarlar.instagram}
            </a>
          )}
        </div>
      </div>

      {/* Metin Gövdesi */}
      <div className="font-editorial text-lg md:text-xl text-[#1A1A1A]/90 leading-relaxed space-y-6 whitespace-pre-wrap font-normal">
        {yazi.icerik}
      </div>

      {/* Yazar Kutusu (Dipnot) */}
      <div className="mt-16 border-t border-b border-[#E3DDD3] py-8 bg-[#E3DDD3]/20 px-6 my-12">
        <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-2">Yazar Hakkında</span>
        <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">{yazi.yazarlar?.ad_soyad}</h3>
        <p className="text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed">
          {yazi.yazarlar?.biyografi || `${yazi.yazarlar?.universite} ${yazi.yazarlar?.bolum} öğrencisi.`}
        </p>
      </div>

      <div className="text-center pt-6">
        <Link href="/" className="inline-block border border-[#1A1A1A] px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
          ← Tüm Metinlere Göz At
        </Link>
      </div>
    </article>
  );
}

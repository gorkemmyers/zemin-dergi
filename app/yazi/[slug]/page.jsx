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
          dergi_id,
          olusturulma_tarihi,
          yazarlar (ad_soyad, universite, bolum, instagram, biyografi),
          dergiler (id, sayi_no, baslik, pdf_url)
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
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-xs uppercase tracking-widest font-bold text-zemin-metin/50">
        Metin Yükleniyor...
      </main>
    );
  }

  if (!yazi) {
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-black text-zemin-bordo mb-3">Metin Bulunamadı</h1>
        <p className="text-xs text-zemin-metin/70 mb-6">Aradığınız metin yayından kaldırılmış olabilir.</p>
        <Link href="/" className="text-xs uppercase tracking-widest font-bold border-b border-zemin-metin pb-1">
          ← Arşive Dön
        </Link>
      </main>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      {/* DERGİDE YAYIMLANDIYSA ÖZEL ROZET BANTI */}
      {yazi.dergiler && (
        <div className="mb-8 p-4 bg-zemin-bordo text-zemin-bej border-2 border-zemin-bordo shadow-[3px_3px_0px_#2D4F38] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-zemin-yesil text-zemin-bej px-2 py-0.5 font-black uppercase text-[10px]">
              Sayı {yazi.dergiler.sayi_no}
            </span>
            <span className="font-serif font-bold">
              Bu metin ZEMİN Sayı {yazi.dergiler.sayi_no} ({yazi.dergiler.baslik}) bünyesinde yayımlanmıştır.
            </span>
          </div>
          {yazi.dergiler.pdf_url && (
            <a
              href={yazi.dergiler.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-widest font-black bg-zemin-bej text-zemin-bordo px-3 py-1 hover:bg-zemin-yesil hover:text-zemin-bej transition-colors"
            >
              Sayıyı Oku (PDF) ↗
            </a>
          )}
        </div>
      )}

      {/* Üst Bilgi */}
      <div className="border-b-2 border-zemin-cizgi pb-8 mb-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-4">
          <Link href="/" className="hover:text-zemin-bordo">Arşiv</Link>
          <span>/</span>
          <span>{yazi.kategori}</span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-black leading-tight text-zemin-bordo mb-6">
          {yazi.baslik}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-zemin-cizgi text-xs">
          <div>
            <span className="font-bold text-base text-zemin-metin block">{yazi.yazarlar?.ad_soyad}</span>
            <span className="text-zemin-metin/70">{yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}</span>
          </div>
          {yazi.yazarlar?.instagram && (
            <a
              href={`https://instagram.com/${yazi.yazarlar.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="text-zemin-yesil hover:text-zemin-bordo font-bold"
            >
              @{yazi.yazarlar.instagram}
            </a>
          )}
        </div>
      </div>

      {/* Metin Gövdesi */}
      <div className="font-serif text-lg md:text-xl text-zemin-metin/90 leading-relaxed space-y-6 whitespace-pre-wrap font-normal">
        {yazi.icerik}
      </div>

      {/* Yazar Hakkında Kutusu */}
      <div className="mt-16 border-2 border-zemin-cizgi bg-zemin-kagit p-6 md:p-8 my-12 shadow-[3px_3px_0px_#DDD7CA]">
        <span className="text-[10px] uppercase tracking-widest text-zemin-yesil font-black block mb-1">Yazar Hakkında</span>
        <h3 className="font-serif text-2xl font-bold text-zemin-bordo">{yazi.yazarlar?.ad_soyad}</h3>
        <p className="text-xs text-zemin-metin/80 mt-2 leading-relaxed">
          {yazi.yazarlar?.biyografi || `${yazi.yazarlar?.universite} ${yazi.yazarlar?.bolum} öğrencisi.`}
        </p>
      </div>

      <div className="text-center pt-4">
        <Link href="/" className="inline-block bg-zemin-bordo text-zemin-bej px-8 py-3 text-xs uppercase tracking-widest font-bold shadow-[2px_2px_0px_#2D4F38] hover:bg-zemin-bordokoyu">
          ← Tüm Metinlere Göz At
        </Link>
      </div>
    </article>
  );
}

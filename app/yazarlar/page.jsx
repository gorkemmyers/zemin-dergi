'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazarlar() {
      setLoading(true);
      const { data, error } = await supabase
        .from('yazarlar')
        .select(`
          id,
          ad_soyad,
          universite,
          bolum,
          instagram,
          biyografi,
          yazilar!inner(id, durum)
        `)
        .eq('yazilar.durum', 'onaylandi');

      if (!error && data) {
        // Benzersiz yazarları filtrele
        const unique = [];
        const map = new Map();
        for (const item of data) {
          if (!map.has(item.id)) {
            map.set(item.id, true);
            unique.push(item);
          }
        }
        setYazarlar(unique);
      }
      setLoading(false);
    }

    fetchYazarlar();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Topluluk</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">Yazarlar Dizini</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 max-w-2xl leading-relaxed">
          ZEMİN arşivine metinleriyle katkı sağlayan bağımsız lisans ve lisansüstü öğrenci araştırmacılar.
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">Yazarlar Yükleniyor...</div>
      ) : yazarlar.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E3DDD3] p-8">
          <p className="font-editorial text-xl text-[#1A1A1A]/70 mb-3">Henüz kayıtlı yazar bulunmuyor.</p>
          <Link href="/basvuru" className="text-xs uppercase tracking-widest font-semibold text-[#4E141E] underline">
            İlk yazar olmak için metin gönder
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {yazarlar.map((y) => (
            <div key={y.id} className="border border-[#E3DDD3] bg-[#F7F5F0] p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold">{y.universite}</span>
                <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A] mt-1">{y.ad_soyad}</h2>
                <p className="text-xs text-[#1A1A1A]/60 font-medium mb-4">{y.bolum}</p>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed italic line-clamp-3">
                  "{y.biyografi || 'Zemin Dergi açık düşünce arşivi yazarı.'}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E3DDD3] flex justify-between items-center text-xs">
                {y.instagram ? (
                  <a
                    href={`https://instagram.com/${y.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5E7362] hover:text-[#4E141E] font-medium"
                  >
                    @{y.instagram}
                  </a>
                ) : (
                  <span className="text-[#1A1A1A]/40">Yazar</span>
                )}
                <Link href="/" className="text-xs font-semibold text-[#4E141E] hover:underline">
                  Metinleri →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [yazilar, setYazilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYazi, setSelectedYazi] = useState(null);

  useEffect(() => {
    fetchBekleyenler();
  }, []);

  async function fetchBekleyenler() {
    setLoading(true);
    const { data, error } = await supabase
      .from('yazilar')
      .select(`
        id,
        baslik,
        slug,
        kategori,
        icerik,
        durum,
        olusturulma_tarihi,
        yazarlar (ad_soyad, universite, bolum, instagram, biyografi)
      `)
      .order('olusturulma_tarihi', { ascending: false });

    if (!error && data) {
      setYazilar(data);
      if (data.length > 0 && !selectedYazi) setSelectedYazi(data[0]);
    }
    setLoading(false);
  }

  async function durumGuncelle(id, yeniDurum) {
    const { error } = await supabase
      .from('yazilar')
      .update({ durum: yeniDurum, yayin_tarihi: yeniDurum === 'onaylandi' ? new Date().toISOString() : null })
      .eq('id', id);

    if (!error) {
      alert(`Metin durumu: ${yeniDurum.toUpperCase()}`);
      fetchBekleyenler();
    } else {
      alert('Hata: ' + error.message);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="border-b border-[#E3DDD3] pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Editoryal Masa</span>
          <h1 className="font-editorial text-3xl font-bold text-[#1A1A1A] mt-1">Yazı İnceleme & Onay</h1>
        </div>
        <button onClick={fetchBekleyenler} className="text-xs uppercase tracking-widest border border-[#E3DDD3] px-4 py-2 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
          Listeyi Yenile
        </button>
      </header>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">Yükleniyor...</div>
      ) : yazilar.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E3DDD3]">
          <p className="font-editorial text-xl text-[#1A1A1A]/70">Bekleyen başvuru bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon: Başvuru Listesi */}
          <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {yazilar.map((y) => (
              <div
                key={y.id}
                onClick={() => setSelectedYazi(y)}
                className={`p-4 border cursor-pointer transition-all ${
                  selectedYazi?.id === y.id
                    ? 'border-[#4E141E] bg-[#4E141E]/5 shadow-sm'
                    : 'border-[#E3DDD3] hover:border-[#1A1A1A]/40 bg-[#F7F5F0]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold mb-1">
                  <span className="text-[#5E7362]">{y.kategori}</span>
                  <span className={`px-2 py-0.5 ${
                    y.durum === 'onaylandi' ? 'bg-[#5E7362]/20 text-[#5E7362]' :
                    y.durum === 'reddedildi' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {y.durum}
                  </span>
                </div>
                <h4 className="font-editorial font-bold text-base text-[#1A1A1A] line-clamp-1">{y.baslik}</h4>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">{y.yazarlar?.ad_soyad} — {y.yazarlar?.universite}</p>
              </div>
            ))}
          </div>

          {/* Sağ Kolon: Detaylı İnceleme ve Aksiyon */}
          <div className="lg:col-span-2 border border-[#E3DDD3] bg-[#F7F5F0] p-8 flex flex-col justify-between min-h-[75vh]">
            {selectedYazi ? (
              <div className="space-y-6">
                <div className="border-b border-[#E3DDD3] pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">{selectedYazi.kategori}</span>
                      <h2 className="font-editorial text-3xl font-bold text-[#1A1A1A] mt-1">{selectedYazi.baslik}</h2>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-[#E3DDD3]/30 border border-[#E3DDD3] text-xs space-y-1">
                    <p><span className="font-semibold text-[#1A1A1A]">Yazar:</span> {selectedYazi.yazarlar?.ad_soyad} ({selectedYazi.yazarlar?.universite} - {selectedYazi.yazarlar?.bolum})</p>
                    {selectedYazi.yazarlar?.instagram && (
                      <p><span className="font-semibold text-[#1A1A1A]">Instagram:</span> @{selectedYazi.yazarlar?.instagram}</p>
                    )}
                    {selectedYazi.yazarlar?.biyografi && (
                      <p><span className="font-semibold text-[#1A1A1A]">Biyo:</span> {selectedYazi.yazarlar?.biyografi}</p>
                    )}
                  </div>
                </div>

                <div className="font-editorial text-[#1A1A1A] text-base leading-relaxed whitespace-pre-wrap max-h-[40vh] overflow-y-auto pr-4">
                  {selectedYazi.icerik}
                </div>

                <div className="border-t border-[#E3DDD3] pt-6 flex gap-4">
                  <button
                    onClick={() => durumGuncelle(selectedYazi.id, 'onaylandi')}
                    className="flex-1 bg-[#4E141E] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-opacity"
                  >
                    ✓ Yayımla (Sitede Aç)
                  </button>
                  <button
                    onClick={() => durumGuncelle(selectedYazi.id, 'reddedildi')}
                    className="border border-[#1A1A1A]/30 text-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-[#1A1A1A]/50">İncelemek için soldan bir yazı seçin.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

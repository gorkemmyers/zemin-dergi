'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Tekil Yazar Avatar Bileşeni (Instagram + Fallback)
function YazarAvatar({ yazar }) {
  const [hata, setHata] = useState(false);

  if (yazar.instagram && !hata) {
    return (
      <img
        src={`https://unavatar.io/instagram/${yazar.instagram}`}
        alt={yazar.ad_soyad}
        onError={() => setHata(true)}
        className="w-10 h-10 rounded-2xl object-cover flex-shrink-0 shadow-sm border border-white"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm">
      {yazar.ad_soyad?.charAt(0) || 'Z'}
    </div>
  );
}

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState([]);
  const [aramaMetni, setAramaMetni] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYazarlar() {
      const { data } = await supabase
        .from('yazarlar')
        .select(`
          id, ad_soyad, slug, universite, bolum, instagram, biyografi,
          yazilar (id, baslik, slug, durum)
        `)
        .order('ad_soyad', { ascending: true });

      if (data) setYazarlar(data);
      setLoading(false);
    }
    fetchYazarlar();
  }, []);

  // Canlı Filtreleme
  const filtrelenmisYazarlar = yazarlar.filter((yazar) => {
    if (!aramaMetni.trim()) return true;
    const q = aramaMetni.toLowerCase();
    return (
      yazar.ad_soyad?.toLowerCase().includes(q) ||
      yazar.universite?.toLowerCase().includes(q) ||
      yazar.bolum?.toLowerCase().includes(q) ||
      yazar.biyografi?.toLowerCase().includes(q) ||
      yazar.instagram?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Açık Düşünce
              </span>
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="hover:text-[#00a693] transition-colors flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="text-[#00a693] flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* BAŞLIK VE CANLI ARAMA */}
        <header className="text-center py-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1">
            Yazar <span className="text-[#00a693]">Topluluğu</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md mx-auto mb-6">
            Zemin arşivine katkı sunan bağımsız araştırmacılar ve yazarlar.
          </p>

          {/* ARAMA ÇUBUĞU */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Yazar adı, üniversite veya mahlas ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full bg-white border border-gray-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a693] shadow-xs transition-all"
            />
            <svg 
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {aramaMetni && (
              <button
                onClick={() => setAramaMetni('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 text-xs font-bold"
                title="Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* TIKLANABİLİR 2 SÜTUNLU YAZAR KARTLARI */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium text-xs">Yazarlar yükleniyor...</div>
        ) : yazarlar.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <p className="text-gray-500 font-medium text-xs">Henüz kayıtlı yazar bulunmuyor.</p>
          </div>
        ) : filtrelenmisYazarlar.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <p className="text-gray-800 font-bold text-xs mb-1">Eşleşen Yazar Bulunamadı</p>
            <p className="text-[11px] text-gray-500 mb-3">Farklı bir isim veya üniversite aramayı deneyebilirsiniz.</p>
            <button
              onClick={() => setAramaMetni('')}
              className="text-[#74112f] text-xs font-bold hover:underline"
            >
              Tüm Listeyi Göster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtrelenmisYazarlar.map((yazar) => {
              const onayliYazilar = yazar.yazilar?.filter((y) => y.durum === 'onaylandi') || [];
              return (
                <Link
                  href={`/yazar/${yazar.slug}`}
                  key={yazar.id}
                  className="glass-card p-4 rounded-2xl flex flex-col justify-between hover:bg-white/95 hover:shadow-lg transition-all border border-white/70 group outline-none"
                >
                  <div>
                    {/* Üst Bilgi Satırı */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <YazarAvatar yazar={yazar} />
                        <div className="min-w-0">
                          <h2 className="font-bold text-sm text-gray-900 truncate leading-snug group-hover:text-[#74112f] transition-colors">
                            {yazar.ad_soyad}
                          </h2>
                          <p className="text-[11px] text-gray-500 truncate">
                            {yazar.universite || 'Bağımsız Yazar'}
                            {yazar.bolum ? ` • ${yazar.bolum}` : ''}
                          </p>
                        </div>
                      </div>

                      {yazar.instagram && (
                        <span className="text-[11px] font-bold text-[#00a693] flex-shrink-0">
                          @{yazar.instagram}
                        </span>
                      )}
                    </div>

                    {yazar.biyografi && (
                      <p className="text-[11px] text-gray-600 font-medium line-clamp-2 leading-relaxed mb-2.5">
                        {yazar.biyografi}
                      </p>
                    )}
                  </div>

                  {/* Alt Bilgi */}
                  <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#32127a]">
                      {onayliYazilar.length > 0 ? `${onayliYazilar.length} Yayımlanmış Metin` : 'İncelemede'}
                    </span>
                    <span className="font-bold text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all">
                      Profili İncele →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#74112f] tracking-tighter mr-2">ZEMİN</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

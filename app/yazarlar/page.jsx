'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAcik, setMenuAcik] = useState(false);

  useEffect(() => {
    async function fetchYazarlar() {
      // Yazarları ve onaylanmış yazılarını birlikte çeker
      const { data } = await supabase
        .from('yazarlar')
        .select(`
          id, ad_soyad, slug, universite, bolum, instagram, biyografi,
          yazilar (id, baslik, slug, durum)
        `)
        .order('ad_soyad', { ascending: true });

      if (data) {
        // Sadece en az 1 onaylı yazısı olan veya profili olan yazarları düzenler
        setYazarlar(data);
      }
      setLoading(false);
    }
    fetchYazarlar();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <nav className="glass-panel mx-auto max-w-4xl px-6 py-3.5 mb-8 md:mb-12 flex justify-between items-center sticky top-4 z-50 rounded-full">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
            ZEMİN
          </Link>
          
          <div className="hidden md:flex gap-7 text-sm font-bold text-gray-700 items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693]">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693]">Dergiler</Link>
            <Link href="/yazarlar" className="text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/basvuru" className="hidden sm:inline-block bg-[#32127a] text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20">
              METİN GÖNDER
            </Link>
            <button 
              onClick={() => setMenuAcik(!menuAcik)}
              className="md:hidden p-2 rounded-full text-gray-800 hover:bg-white/50"
              aria-label="Menü"
            >
              {menuAcik ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {/* MOBİL MENÜ */}
        {menuAcik && (
          <div className="md:hidden glass-panel p-6 mb-8 flex flex-col gap-4 text-center text-sm font-bold text-gray-800 shadow-xl">
            <Link href="/" onClick={() => setMenuAcik(false)}>Ana Sayfa</Link>
            <Link href="/yazilar" onClick={() => setMenuAcik(false)}>Yazılar</Link>
            <Link href="/dergiler" onClick={() => setMenuAcik(false)}>Dergiler</Link>
            <Link href="/yazarlar" onClick={() => setMenuAcik(false)} className="text-[#00a693]">Yazarlar</Link>
            <Link href="/iletisim" onClick={() => setMenuAcik(false)}>İletişim</Link>
            <Link href="/basvuru" onClick={() => setMenuAcik(false)} className="bg-[#32127a] text-white py-2.5 rounded-full text-xs">
              METİN GÖNDER
            </Link>
          </div>
        )}

        {/* BAŞLIK */}
        <header className="text-center py-6 md:py-10 mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
            Yazar <span className="text-[#00a693]">Topluluğu</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium max-w-xl mx-auto">
            Zemin arşivine metinleriyle katkı sunan bağımsız araştırmacılar ve yazarlar.
          </p>
        </header>

        {/* YAZAR KARTLARI */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Yazarlar yükleniyor...</div>
        ) : yazarlar.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <p className="text-gray-500 font-medium">Henüz kayıtlı yazar bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yazarlar.map((yazar) => {
              const onayliYazilar = yazar.yazilar?.filter((y) => y.durum === 'onaylandi') || [];
              return (
                <div key={yazar.id} className="glass-card p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-white/70 hover:bg-white/80">
                  <div>
                    {/* Profil Başlığı */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0">
                        {yazar.ad_soyad?.charAt(0) || 'Z'}
                      </div>
                      <div>
                        <h2 className="font-black text-lg text-gray-900 leading-tight">{yazar.ad_soyad}</h2>
                        <p className="text-xs text-gray-500 font-semibold">{yazar.universite}</p>
                      </div>
                    </div>

                    {yazar.bolum && (
                      <span className="inline-block text-[11px] font-bold text-[#32127a] bg-[#32127a]/10 px-2.5 py-0.5 rounded-md mb-3">
                        {yazar.bolum}
                      </span>
                    )}

                    {yazar.biyografi && (
                      <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3 mb-4">
                        {yazar.biyografi}
                      </p>
                    )}
                  </div>

                  {/* Yazarın Yayınlanmış Yazıları */}
                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Yayınlar ({onayliYazilar.length})
                      </span>
                      {yazar.instagram && (
                        <a 
                          href={`https://instagram.com/${yazar.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#00a693] hover:underline"
                        >
                          @{yazar.instagram}
                        </a>
                      )}
                    </div>
                    
                    {onayliYazilar.length > 0 ? (
                      <div className="space-y-1.5">
                        {onayliYazilar.slice(0, 2).map((y) => (
                          <Link 
                            key={y.id} 
                            href={`/yazi/${y.slug}`} 
                            className="block text-xs font-bold text-gray-800 hover:text-[#74112f] truncate transition-colors"
                          >
                            • {y.baslik}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Henüz onaylanmış yazısı yok</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
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

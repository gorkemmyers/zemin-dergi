'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent',
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(116, 17, 47, 0.12) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 166, 147, 0.12) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(50, 18, 122, 0.12) 0%, transparent 60%)'
      };
    default:
      return {
        cardBg: 'from-gray-100 to-transparent',
        badgeBg: 'bg-gray-100 text-gray-700',
        pattern: 'none'
      };
  }
};

export default function Home() {
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data: yazilarData } = await supabase
          .from('yazilar')
          .select('*, yazarlar(*), dergiler(*)')
          .eq('durum', 'onaylandi')
          .order('id', { ascending: false })
          .limit(10);

        const { data: dergilerData } = await supabase
          .from('dergiler')
          .select('*')
          .order('sayi_no', { ascending: false })
          .limit(4);

        if (yazilarData) setYazilar(yazilarData);
        if (dergilerData) setDergiler(dergilerData);
      } catch (e) {
        console.error('Veri çekme hatası:', e);
      } finally {
        setLoading(false);
      }
    }

    verileriGetir();
  }, []);

  const handleRastgele = async () => {
    const { data } = await supabase
      .from('yazilar')
      .select('slug')
      .eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative selection:bg-[#74112f]/10 selection:text-[#74112f]">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-5xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleRastgele}
                className="glass-panel px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-700 hover:text-[#74112f] transition-all shadow-xs"
                title="Rastgele Bir Metin Keşfet"
              >
                Rastgele
              </button>
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="text-[#00a693] flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* HERO BÖLÜMÜ */}
        <section className="glass-card p-6 sm:p-12 mb-8 border border-white/90 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 px-3.5 py-1 rounded-full inline-block mb-3">
              ZEMİN Dergisi
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Düşüncenin Zemini, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693]">
                Özgür İfade Alanı.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-6">
              Felsefe, sosyoloji ve psikoloji alanlarında düşünen herkes için bağımsız açık yayın platformu.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:bg-[#74112f] transition-all active:scale-95"
              >
                Metnini Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="glass-panel text-gray-800 px-5 py-2.5 rounded-full text-xs font-bold hover:text-[#00a693] border border-gray-200 shadow-xs transition-all"
              >
                Tüm Arşivi İncele
              </Link>
            </div>
          </div>
        </section>

        {/* 4 TEMEL İLKE KARTI (KOMPAKT & EKRANA TAM OTURAN IZGARA) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#00a693]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-[#00a693] block mb-1">01</span>
              <h3 className="font-black text-xs text-gray-900 mb-1">Açık Kürsü</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                Düşünen herkese açıktır. Akademik unvan şartı aranmaz; metnin niteliği esastır.
              </p>
            </div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#74112f]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-[#74112f] block mb-1">02</span>
              <h3 className="font-black text-xs text-gray-900 mb-1">İfade Özgürlüğü</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                Gerçek adınızla veya mahlasla yazabilirsiniz. Her iki tercih de eşit editoryal saygı görür.
              </p>
            </div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#32127a]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-[#32127a] block mb-1">03</span>
              <h3 className="font-black text-xs text-gray-900 mb-1">Yazar Masası</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                4 haneli PIN kodu ile şifresiz, pratik yönetim ve yayın takibi.
              </p>
            </div>
          </div>

          <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#74112f]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-[#74112f] block mb-1">04</span>
              <h3 className="font-black text-xs text-gray-900 mb-1">Dergi Seçkisi</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                Onaylanan metinler webde yayımlanır; öne çıkanlar ZEMİN Dergisi özel sayısına seçilir.
              </p>
            </div>
          </div>
        </section>

        {/* SON METİNLER (MAX 10) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Son Metinler</h2>
            <Link href="/yazilar" className="text-xs font-bold text-[#32127a] hover:underline">
              Tüm Arşivi Görüntüle →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="glass-card p-5 rounded-2xl h-44 animate-pulse bg-white/40"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl border border-white/90 text-center">
              <p className="text-xs font-bold text-gray-600 mb-3">Henüz onaylanmış bir düşünce metni bulunmuyor.</p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#74112f] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:opacity-90"
              >
                İlk Metni Sen Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yazilar.map((y) => {
                const stil = getDisiplinStili(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group outline-none">
                    <article 
                      style={{ backgroundImage: !y.kapak_url ? stil.pattern : 'none' }}
                      className={`glass-card p-4 rounded-2xl h-44 flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all border border-white/80 group-hover:-translate-y-0.5 relative overflow-hidden ${!y.kapak_url ? `bg-gradient-to-br ${stil.cardBg}` : 'bg-white/95'}`}
                    >
                      {y.kapak_url && (
                        <>
                          <img src={y.kapak_url} alt="" className="absolute right-0 inset-y-0 w-3/5 h-full object-cover opacity-80 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none"></div>
                        </>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${stil.badgeBg}`}>
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[8.5px] font-bold text-[#74112f] bg-[#74112f]/10 border border-[#74112f]/20 px-2 py-0.5 rounded-full">
                                ● Sayı {y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-500 font-bold bg-white/80 px-2 py-0.5 rounded-full">
                            {okumaSuresi} dk okuma
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#74112f] transition-colors line-clamp-1 mb-1">
                          {y.baslik}
                        </h3>
                        <p className="text-[11px] text-gray-600 line-clamp-2 font-serif">
                          {y.icerik}
                        </p>
                      </div>

                      <div className="relative z-10 pt-2 border-t border-gray-200/50 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 truncate max-w-[150px]">{y.yazarlar?.ad_soyad}</span>
                        <span className="font-black text-[#32127a]">Oku →</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {yazilar.length > 0 && (
            <div className="text-center mt-8">
              <Link 
                href="/yazilar" 
                className="inline-block glass-panel px-6 py-3 rounded-full text-xs font-bold text-gray-800 hover:text-[#74112f] border border-gray-200/80 shadow-xs transition-all"
              >
                Tüm Metin Arşivini Görüntüle →
              </Link>
            </div>
          )}
        </section>

        {/* E-DERGİLER (MAX 4) */}
        {dergiler.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">ZEMİN Dergisi Sayıları</h2>
              <Link href="/dergiler" className="text-xs font-bold text-[#32127a] hover:underline">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dergiler.map((d) => (
                <div key={d.id} className="glass-panel p-5 rounded-2xl border border-white/90 shadow-md flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 px-2 py-0.5 rounded-full">
                      Sayı {d.sayi_no}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">{d.baslik}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#32127a] hover:bg-[#74112f] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-all"
                  >
                    İncele / İndir
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#74112f] tracking-tighter mr-2">ZEMİN Dergisi</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Masası</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

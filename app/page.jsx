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
  const [sonDergi, setSonDergi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    async function verileriGetir() {
      try {
        // Güvenli ve doğrudan veri çekme sorgusu
        const { data: yazilarData, error: yaziHata } = await supabase
          .from('yazilar')
          .select('*, yazarlar(*)')
          .eq('durum', 'onaylandi')
          .order('id', { ascending: false })
          .limit(6);

        if (yaziHata) {
          console.error('Yazı çekme hatası:', yaziHata);
        } else if (yazilarData) {
          setYazilar(yazilarData);
        }

        const { data: dergilerData } = await supabase
          .from('dergiler')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (dergilerData && dergilerData.length > 0) {
          setSonDergi(dergilerData[0]);
        }
      } catch (e) {
        console.error('Genel hata:', e);
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
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative">
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
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#00a693] bg-[#00a693]/10 px-3 py-1 rounded-full inline-block mb-3">
              Açık Düşünce İnisiyatifi
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
                className="bg-[#32127a] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:bg-[#74112f] transition-all"
              >
                Yazını Gönder
              </Link>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="glass-panel text-gray-800 px-5 py-2.5 rounded-full text-xs font-bold hover:text-[#00a693] transition-all"
              >
                Nasıl Çalışır? 💡
              </button>
            </div>
          </div>
        </section>

        {/* 4 TEMEL BİLGİ KARTI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-12">
          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#00a693]/40 transition-all">
            <span className="text-base font-black text-[#00a693] block mb-1">01</span>
            <h3 className="font-black text-xs text-gray-900 mb-1">Kimler Yazabilir?</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              Öğrenci olma şartı yoktur. Düşünen, araştıran ve soru soran herkes metin gönderebilir.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#74112f]/40 transition-all">
            <span className="text-base font-black text-[#74112f] block mb-1">02</span>
            <h3 className="font-black text-xs text-gray-900 mb-1">İsim veya Mahlas</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              İster gerçek adını, ister bir mahlas kullan. Her iki seçenek de eşit editoryal saygı görür.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-xs hover:border-[#32127a]/40 transition-all">
            <span className="text-base font-black text-[#32127a] block mb-1">03</span>
            <h3 className="font-black text-xs text-gray-900 mb-1">İsim & PIN Eşleşmesi</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              İlk yazında belirlediğin isim ve 4 haneli PIN eşleşir; sonraki yazıların doğrudan profiline eklenir.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-xs hover:border-gray-400 transition-all">
            <span className="text-base font-black text-gray-900 block mb-1">04</span>
            <h3 className="font-black text-xs text-gray-900 mb-1">Web & Dergi Yayını</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              Onaylanan metin anında webde yayımlanır; seçilenler dönemsel e-dergi sayısına dahil edilir.
            </p>
          </div>
        </section>

        {/* SON YAZILAR BÖLÜMÜ */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Son Metinler</h2>
            <Link href="/yazilar" className="text-xs font-bold text-[#32127a] hover:underline">Tüm Arşiv →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {yazilar.map((y) => {
                const stil = getDisiplinStili(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group outline-none">
                    <article 
                      style={{ backgroundImage: !y.kapak_url ? stil.pattern : 'none' }}
                      className={`glass-card p-5 rounded-2xl h-full flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all border border-white/80 group-hover:-translate-y-0.5 relative overflow-hidden ${!y.kapak_url ? `bg-gradient-to-br ${stil.cardBg}` : 'bg-white/90'}`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${stil.badgeBg}`}>
                            {y.kategori}
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold">
                            ⏱ {okumaSuresi} dk
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#74112f] transition-colors line-clamp-2 mb-1.5">
                          {y.baslik}
                        </h3>
                        <p className="text-[11px] text-gray-600 line-clamp-2 font-serif">
                          {y.icerik}
                        </p>
                      </div>

                      <div className="relative z-10 mt-4 pt-2.5 border-t border-gray-200/50 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 truncate max-w-[140px]">{y.yazarlar?.ad_soyad}</span>
                        <span className="font-black text-[#32127a]">Oku →</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* E-DERGİ VİTRİNİ */}
        {sonDergi && (
          <section className="glass-panel p-6 rounded-3xl border border-white/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#74112f]">Resmi E-Dergi</span>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">Sayı {sonDergi.sayi_no}: {sonDergi.baslik}</h3>
              <p className="text-xs text-gray-600 mt-1 max-w-md">Editör masasının seçtiği tematik yazılardan oluşan dijital sayı.</p>
            </div>
            <Link 
              href="/dergiler"
              className="bg-gray-900 hover:bg-[#74112f] text-white px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap shadow-md transition-all"
            >
              Dergileri İncele & İndir
            </Link>
          </section>
        )}

      </main>

      {/* 💡 REHBER VE İŞLEYİŞ ÇEKMECESİ (MODAL) */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-white/90 shadow-2xl relative animate-in fade-in zoom-in duration-150 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setIsGuideOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-sm font-bold bg-black/5 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <h3 className="text-base font-black text-gray-900 mb-4 pb-2 border-b border-gray-200">
              ZEMİN Yayın Rehberi
            </h3>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">1. Kimler Yazabilir?</h4>
                <p className="text-gray-600">Öğrenci olma veya unvan şartı yoktur. Felsefe, sosyoloji ve psikoloji alanlarında eleştirel düşünen, soru soran ve metin üreten herkes başvurabilir.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">2. İsim & Mahlas Özgürlüğü</h4>
                <p className="text-gray-600">Yazılarında gerçek adını kullanabileceğin gibi tamamen bir mahlasla da yazabilirsin. İkisi de aynı editoryal değerlendirmeden geçer.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">3. İsim & PIN Eşleşmesi</h4>
                <p className="text-gray-600">Hesap açma zorunluluğu yoktur. İlk yazında belirlediğin isim/mahlas ile 4 haneli PIN eşleşir. Sonraki yazılarını gönderirken aynı ismi ve PIN kodunu girmen yeterlidir; sistem seni tanır ve yeni yazını mevcut profiline ekler.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">4. Web ve Dergi Yayını</h4>
                <p className="text-gray-600">Gönderilen metin editör onayından geçtiğinde doğrudan web arşivinde ve yazar sayfanda yerini alır. Editör masasının seçtiği metinler dönemsel resmi PDF e-dergiye dahil edilir.</p>
              </div>
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full mt-6 bg-[#32127a] text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#74112f] transition-all"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6 relative z-10">
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

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const MADDELER = [
  {
    no: '01',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan, araştıran ve metin üreten herkese açıktır. Akademik unvan veya okul şartı aranmaz; yalnızca düşünsel derinlik ve tutarlılık esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#00d2bc',
    glow: 'rgba(0, 210, 188, 0.35)'
  },
  {
    no: '02',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'İsim veya Mahlas Serbestisi',
    aciklama: 'Düşüncelerinizi ister gerçek adınızla, ister bağımsız bir mahlasla kaleme alabilirsiniz. Her iki tercih de ZEMİN editör masasında eşit editoryal saygı ve titizlikle değerlendirilir.',
    rozet: 'ÖZGÜR İFADE',
    renk: '#ff3b6d',
    glow: 'rgba(255, 59, 109, 0.35)'
  },
  {
    no: '03',
    kisaBaslik: 'Yazar Masası',
    baslik: 'Pratik & Şifresiz Yönetim',
    aciklama: 'İlk metninizle belirlediğiniz 4 haneli PIN kodu isminizle eşleşir. E-posta olmadan profilinizi düzenleyebilir, yeni metin gönderebilir ve okur etkileşimlerini takip edebilirsiniz.',
    rozet: 'PIN MASASI',
    renk: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.35)'
  },
  {
    no: '04',
    kisaBaslik: 'Dergi Seçkisi',
    baslik: 'Dönemsel ZEMİN Dergisi Yayını',
    aciklama: 'Onaylanan tüm metinler web arşivinde kesintisiz yer alır. Editör masası tarafından öne çıkan düşünce metinleri ise dönemsel ZEMİN Dergisi resmi seçkisine dahil edilir.',
    rozet: 'RESMİ SEÇKİ',
    renk: '#ff3b6d',
    glow: 'rgba(255, 59, 109, 0.35)'
  }
];

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        cardBg: 'from-[#ff3b6d]/20 via-[#74112f]/10 to-transparent',
        badgeBg: 'bg-[#ff3b6d]/15 text-[#ff7597] border border-[#ff3b6d]/30',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(255, 59, 109, 0.18) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        cardBg: 'from-[#00d2bc]/20 via-[#00a693]/10 to-transparent',
        badgeBg: 'bg-[#00d2bc]/15 text-[#00d2bc] border border-[#00d2bc]/30',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 210, 188, 0.18) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        cardBg: 'from-[#a855f7]/20 via-[#32127a]/10 to-transparent',
        badgeBg: 'bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)'
      };
    default:
      return {
        cardBg: 'from-white/10 to-transparent',
        badgeBg: 'bg-white/10 text-gray-300 border border-white/10',
        pattern: 'none'
      };
  }
};

export default function Home() {
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktifMaddeIndex, setAktifMaddeIndex] = useState(0);

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

  const aktif = MADDELER[aktifMaddeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0C10] text-[#E0E2EC] relative selection:bg-[#ff3b6d]/30 selection:text-[#ff7597] overflow-x-hidden">
      
      {/* SABİT ARKA PLAN SIVI IŞIK KÜRELERİ (GPU DOSTU MESH GLOW) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-[#74112f]/20 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-96 h-96 rounded-full bg-[#32127a]/25 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-96 h-96 rounded-full bg-[#00a693]/15 blur-[130px] pointer-events-none" />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">
        
        {/* NAVBAR (DARK LIQUID GLASS) */}
        <header className="mx-auto max-w-5xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl bg-[#13151D]/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-white/10">
            <Link href="/" className="text-[#ff3b6d] font-black text-2xl tracking-tighter hover:opacity-90 flex items-center gap-1.5">
              <span>ZEMİN</span>
              <span className="text-[10px] text-[#00d2bc] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#00d2bc]/10 border border-[#00d2bc]/20">Dergisi</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleRastgele}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Rastgele Bir Metin Keşfet"
              >
                Rastgele
              </button>
              <Link 
                href="/basvuru" 
                className="bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:opacity-90 shadow-lg shadow-[#74112f]/20 transition-all border border-white/20"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-400 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="text-[#00d2bc] flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-white transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-white transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-white transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-white transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* HERO BÖLÜMÜ (KOYU PRIZMA CAM) */}
        <section className="p-6 sm:p-12 mb-8 rounded-3xl bg-[#151722]/75 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden text-center sm:text-left">
          
          {/* İç Işık Vurgusu */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#ff3b6d]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#ff7597] bg-[#ff3b6d]/15 border border-[#ff3b6d]/30 px-3.5 py-1 rounded-full inline-block mb-3">
              FELSEFE • SOSYOLOJİ • PSİKOLOJİ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Düşüncenin Zemini, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3b6d] via-[#a855f7] to-[#00d2bc]">
                Özgür İfade Alanı.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed mb-6">
              Felsefe, sosyoloji ve psikoloji alanlarında düşünen herkes için bağımsız açık yayın platformu.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link 
                href="/basvuru" 
                className="bg-gradient-to-r from-[#74112f] to-[#32127a] hover:from-[#ff3b6d] hover:to-[#a855f7] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg border border-white/20 transition-all active:scale-95"
              >
                Metnini Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="bg-white/5 hover:bg-white/10 text-gray-200 px-5 py-2.5 rounded-full text-xs font-bold border border-white/10 transition-all"
              >
                Tüm Arşivi İncele
              </Link>
            </div>
          </div>
        </section>

        {/* EKRANA TAM SIĞAN KOYU LIQUID GLASS KONSOLU */}
        <section className="mb-12 relative">
          <div className="p-4 sm:p-7 rounded-3xl bg-[#151722]/80 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Dinamik Aktif Renk Küresi */}
            <div 
              className="absolute -top-12 -right-12 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out opacity-80"
              style={{ backgroundColor: aktif.glow }}
            />

            {/* Üst 4 Buton (Yatayda Asla Kaydırmayan Grid-cols-4) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1 bg-black/40 rounded-2xl border border-white/5 mb-5">
              {MADDELER.map((m, idx) => {
                const isSecili = aktifMaddeIndex === idx;
                return (
                  <button
                    key={m.no}
                    onClick={() => setAktifMaddeIndex(idx)}
                    className={`py-2 px-1 sm:px-3 rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 text-center select-none ${
                      isSecili
                        ? 'bg-white/10 text-white shadow-md border border-white/20 font-black scale-[1.02]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 font-bold'
                    }`}
                  >
                    <span 
                      className="text-[9px] sm:text-[11px] font-black leading-none"
                      style={{ color: isSecili ? m.renk : undefined }}
                    >
                      {m.no}
                    </span>
                    <span className="text-[9.5px] sm:text-xs truncate leading-tight">
                      {m.kisaBaslik}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Alt Aktif Açıklama Paneli */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                    style={{ 
                      backgroundColor: `${aktif.renk}18`, 
                      color: aktif.renk,
                      borderColor: `${aktif.renk}40` 
                    }}
                  >
                    {aktif.rozet}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    {aktif.baslik}
                  </h3>
                </div>
                <p className="text-[11.5px] sm:text-xs text-gray-300 font-serif leading-relaxed">
                  {aktif.aciklama}
                </p>
              </div>

              <Link
                href="/basvuru"
                className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs transition-all active:scale-95 whitespace-nowrap self-end sm:self-center"
              >
                <span>Yazı Masasına Git</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

        {/* SON METİNLER (MAX 10 - KOYU CAM KARTLAR) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-white tracking-tight">Son Metinler</h2>
            <Link href="/yazilar" className="text-xs font-bold text-[#00d2bc] hover:underline">
              Tüm Arşivi Görüntüle →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-5 rounded-2xl h-44 animate-pulse bg-white/5 border border-white/5"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#151722]/80 border border-white/10 text-center">
              <p className="text-xs font-bold text-gray-400 mb-3">Henüz onaylanmış bir düşünce metni bulunmuyor.</p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#ff3b6d] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:opacity-90"
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
                      className={`p-4 rounded-2xl h-44 flex flex-col justify-between hover:bg-[#1C1F2E] transition-all border border-white/10 hover:border-white/25 group-hover:-translate-y-0.5 relative overflow-hidden backdrop-blur-xl ${!y.kapak_url ? `bg-gradient-to-br ${stil.cardBg} bg-[#151722]` : 'bg-[#151722]/90'}`}
                    >
                      {y.kapak_url && (
                        <>
                          <img src={y.kapak_url} alt="" className="absolute right-0 inset-y-0 w-3/5 h-full object-cover opacity-30 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#151722] via-[#151722]/90 to-transparent pointer-events-none"></div>
                        </>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${stil.badgeBg}`}>
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[8.5px] font-bold text-[#ff7597] bg-[#ff3b6d]/10 border border-[#ff3b6d]/20 px-2 py-0.5 rounded-full">
                                ● Sayı {y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                            {okumaSuresi} dk okuma
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white group-hover:text-[#00d2bc] transition-colors line-clamp-1 mb-1">
                          {y.baslik}
                        </h3>
                        <p className="text-[11px] text-gray-300 line-clamp-2 font-serif">
                          {y.icerik}
                        </p>
                      </div>

                      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-300 truncate max-w-[150px]">{y.yazarlar?.ad_soyad}</span>
                        <span className="font-black text-[#00d2bc]">Oku →</span>
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
                className="inline-block px-6 py-3 rounded-full text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Tüm Metin Arşivini Görüntüle →
              </Link>
            </div>
          )}
        </section>

        {/* E-DERGİLER (KOYU CAM VİTRİNİ) */}
        {dergiler.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-black text-white tracking-tight">ZEMİN Dergisi Sayıları</h2>
              <Link href="/dergiler" className="text-xs font-bold text-[#00d2bc] hover:underline">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dergiler.map((d) => (
                <div key={d.id} className="p-5 rounded-2xl bg-[#151722]/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ff7597] bg-[#ff3b6d]/10 border border-[#ff3b6d]/20 px-2 py-0.5 rounded-full">
                      Sayı {d.sayi_no}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1">{d.baslik}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-r from-[#74112f] to-[#32127a] hover:from-[#ff3b6d] hover:to-[#a855f7] text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-md border border-white/20 transition-all"
                  >
                    İncele / İndir
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER (KOYU CAM) */}
      <footer className="mt-auto w-full border-t border-white/10 bg-[#0B0C10]/80 backdrop-blur-xl py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
          <div>
            <span className="text-lg font-black text-[#ff3b6d] tracking-tighter mr-2">ZEMİN Dergisi</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#00d2bc]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00d2bc]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#a855f7] hover:text-white">Editör Masası</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

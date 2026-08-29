'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Rokoko Detaylı C-Scroll & Acanthus Köşe Süsü (Ölçeklenebilir Vektör)
const RococoStuccoCorner = ({ className = "w-16 h-16 text-[#D4AF37]" }) => (
  <svg viewBox="0 0 120 120" fill="currentColor" className={className}>
    <path d="M0,0 C30,2 55,18 62,38 C68,54 58,72 42,75 C28,78 18,65 24,52 C28,42 40,40 45,48 C48,53 45,60 38,60 C35,60 32,56 34,52 C36,46 45,46 45,55 C45,68 25,72 15,55 C6,38 20,15 48,10 C75,5 98,28 92,60 C88,85 62,105 35,108 C20,110 8,104 0,98 L0,120 C18,120 40,116 60,105 C95,85 115,50 108,20 C102,-5 70,-2 0,0 Z" opacity="0.85" />
    <path d="M12,12 C25,12 40,22 45,35 C48,45 42,55 32,55 C22,55 18,45 22,35 C25,28 32,25 38,28 C42,30 42,35 38,38 C35,40 32,38 32,35 C32,30 40,28 42,35 C45,45 28,50 20,38 C15,28 20,18 35,16 C48,15 58,25 56,40 C54,58 35,68 18,65 L12,80 C32,82 60,70 65,45 C70,18 45,2 12,0 Z" opacity="0.95" />
    <circle cx="28" cy="28" r="3.5" fill="#FFF8E7" />
    <circle cx="70" cy="18" r="2.5" />
    <circle cx="18" cy="70" r="2.5" />
  </svg>
);

// Tavan Kubbesi Barok Kartuş ve Taç Süsü
const RococoCrownCartouche = () => (
  <svg viewBox="0 0 400 60" fill="currentColor" className="w-64 sm:w-80 h-10 text-[#D4AF37] mx-auto opacity-90 drop-shadow-sm">
    <path d="M200,0 C185,15 160,18 135,10 C150,25 145,45 120,48 C145,52 165,40 180,45 C190,48 195,58 200,60 C205,58 210,48 220,45 C235,40 255,52 280,48 C255,45 250,25 265,10 C240,18 215,15 200,0 Z" />
    <circle cx="200" cy="30" r="4.5" fill="#FFF8E7" />
    <circle cx="170" cy="28" r="2.5" />
    <circle cx="230" cy="28" r="2.5" />
  </svg>
);

// Klasik Kavisli Süsleme Çıtası
const OrnateBorderLine = () => (
  <div className="flex items-center justify-center gap-2 my-2 opacity-80">
    <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-[#B8860B]" />
    <span className="text-[#B8860B] text-xs">❦</span>
    <div className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#FFFDF9]" />
    <span className="text-[#B8860B] text-xs">❦</span>
    <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-[#D4AF37] to-[#B8860B]" />
  </div>
);

const MADDELER = [
  {
    no: 'I',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Hür Düşünce Meclisi',
    aciklama: 'Felsefe, sosyoloji ve ruhi tahlillerde sorgulayan her zihne açıktır. Akademik paye aranmaz; düşünsel derinlik ve üslup asaleti esastır.',
    rozet: 'KÜRSÜ',
    renk: '#8A6B2D',
    vurgu: '#D4AF37'
  },
  {
    no: 'II',
    kisaBaslik: 'İfade Hürriyeti',
    baslik: 'Müstear & Mahlas Serbestisi',
    aciklama: 'Risalelerinizi ister hakiki isminizle, ister edebi bir mahlasla neşredebilirsiniz. Her iki tercih de heyetimizce denk ihtimamla karşılanır.',
    rozet: 'MAHLAS',
    renk: '#681320',
    vurgu: '#A82C35'
  },
  {
    no: 'III',
    kisaBaslik: 'Müellif Masası',
    baslik: 'Dört Haneli Mühür',
    aciklama: 'İlk metninizle tayin ettiğiniz 4 haneli PIN mühür vazifesi görür. E-posta yükü olmadan neşriyatınızı doğrudan idare edebilirsiniz.',
    rozet: 'MÜHÜR',
    renk: '#241940',
    vurgu: '#4D3680'
  },
  {
    no: 'IV',
    kisaBaslik: 'Matbu Külliyat',
    baslik: 'ZEMİN Dergi Seçkisi',
    aciklama: 'Onaylanan risaleler dijital mahfuzada yer bulur. Heyetin takdir ettiği tetkikler ise dönemsel matbu ZEMİN külliyatına nakşedilir.',
    rozet: 'SEÇKİ',
    renk: '#143830',
    vurgu: '#286B5D'
  }
];

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
    const { data } = await supabase.from('yazilar').select('slug').eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    }
  };

  const aktif = MADDELER[aktifMaddeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#1C1917] font-serif selection:bg-[#D4AF37]/30 selection:text-[#681320] relative">
      
      {/* İnce Mermer & Sıva (Stucco) Damar Dokusu */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#681320 0.5px, #FDFBF7 0.5px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px'
        }}
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20 relative z-10">

        {/* BAŞLIK & ROKOKO KORİNT KORNİŞİ */}
        <header className="mb-10 text-center relative">
          <div className="bg-[#FFFFFF]/90 border-2 border-[#D4AF37] p-2 shadow-[0_10px_30px_rgba(212,175,55,0.12)] relative rounded-sm">
            <div className="border border-[#B8860B]/40 px-4 py-4 relative bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#FAF6ED]">
              
              {/* Üst Taç Madalyonu */}
              <RococoCrownCartouche />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3 order-2 md:order-1">
                  <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase text-[#8A6B2D]">
                    ANNO MMXXVI
                  </span>
                  <button 
                    onClick={handleRastgele}
                    className="px-3 py-1 border border-[#D4AF37] bg-[#FAF6ED] text-[10px] font-sans tracking-widest uppercase text-[#1C1917] hover:bg-[#D4AF37] hover:text-white transition-all shadow-2xs font-semibold"
                  >
                    Rastgele Risale
                  </button>
                </div>

                {/* ZEMİN Lapidary Tipografi */}
                <div className="order-1 md:order-2">
                  <Link href="/" className="inline-block group">
                    <h1 className="text-4xl sm:text-6xl font-normal tracking-[0.25em] text-[#1C1917] font-serif uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                      ZEMİN
                    </h1>
                    <p className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.4em] text-[#8A6B2D] uppercase mt-1">
                      Felsefe • Sosyoloji • Psikoloji
                    </p>
                  </Link>
                </div>

                <div className="order-3">
                  <Link 
                    href="/basvuru" 
                    className="inline-flex items-center gap-2 px-5 py-2 border-2 border-[#8A6B2D] bg-[#681320] text-white text-[11px] font-sans font-bold uppercase tracking-widest shadow-md hover:bg-[#8A6B2D] transition-all"
                  >
                    <span>✦ Risale İntisabı</span>
                  </Link>
                </div>
              </div>

              <OrnateBorderLine />

              {/* Alt Klasik Menü */}
              <nav className="flex justify-center items-center gap-6 sm:gap-10 text-[11px] uppercase font-sans tracking-[0.2em] font-bold text-[#44403C] pt-1">
                <Link href="/" className="text-[#8A6B2D] border-b-2 border-[#8A6B2D] pb-0.5">Kürsü</Link>
                <Link href="/yazilar" className="hover:text-[#8A6B2D] transition-colors">Arşiv</Link>
                <Link href="/dergiler" className="hover:text-[#8A6B2D] transition-colors">Mecmualar</Link>
                <Link href="/yazarlar" className="hover:text-[#8A6B2D] transition-colors">Müellifler</Link>
                <Link href="/iletisim" className="hover:text-[#8A6B2D] transition-colors">Mektubat</Link>
              </nav>

            </div>
          </div>
        </header>

        {/* HERO: WIESKIRCHE KUBBE FRESKİ & ALTIN VARAKLI RETABL */}
        <section className="mb-14 relative bg-[#FFFFFF] border-2 border-[#D4AF37] p-6 sm:p-14 shadow-2xl overflow-hidden rounded-t-[70px] sm:rounded-t-[120px] rounded-b-md">
          
          {/* Kubbe Tavanı Göksel Fresk Atmosferi (Soft Sky & Rose Cloud Gradient) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 z-0"
            style={{
              background: `radial-gradient(ellipse at 50% 25%, rgba(220, 238, 248, 0.9) 0%, rgba(253, 238, 230, 0.7) 45%, rgba(253, 251, 247, 0.95) 85%)`
            }}
          />

          {/* Dört Köşe Rokoko Varakları */}
          <div className="absolute top-2 left-2 z-10"><RococoStuccoCorner /></div>
          <div className="absolute top-2 right-2 -scale-x-100 z-10"><RococoStuccoCorner /></div>
          <div className="absolute bottom-2 left-2 -scale-y-100 z-10"><RococoStuccoCorner /></div>
          <div className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100 z-10"><RococoStuccoCorner /></div>

          {/* Çift Çerçeveli Boiserie Duvar Çıtası */}
          <div className="absolute inset-3.5 border border-[#D4AF37]/50 pointer-events-none rounded-t-[55px] sm:rounded-t-[105px]" />
          <div className="absolute inset-5 border-2 border-[#D4AF37]/25 pointer-events-none rounded-t-[45px] sm:rounded-t-[95px]" />

          <div className="relative z-10 max-w-2xl mx-auto text-center pt-4 sm:pt-6">
            <span className="inline-block border border-[#D4AF37] bg-[#FFFDF9]/90 px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#8A6B2D] shadow-xs mb-3">
              Müstakil Tefekkür Mahfili
            </span>

            <h2 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#1C1917] leading-tight mb-4">
              Zihnin En Yüksek Kubbesi, <br />
              <span className="italic font-light text-[#681320]">Hürriyetin Zeminidir.</span>
            </h2>

            <OrnateBorderLine />

            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed max-w-lg mx-auto font-serif italic my-6">
              Akademik duvarların ve dogmaların ötesinde; felsefi tetkik, sosyolojik tahlil ve ruhi sorgulamalar için nakşedilmiş bağımsız neşir alanı.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs pt-2">
              <Link 
                href="/basvuru" 
                className="px-8 py-3 bg-[#1C1917] text-[#FFFDF9] tracking-[0.2em] uppercase font-bold border-2 border-[#D4AF37] shadow-xl hover:bg-[#681320] transition-all"
              >
                Risale Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-8 py-3 bg-[#FFFDF9] text-[#1C1917] tracking-[0.2em] uppercase font-bold border-2 border-[#D4AF37] hover:bg-[#FAF6ED] transition-all shadow-xs"
              >
                Külliyatı Mütalaa Et
              </Link>
            </div>
          </div>
        </section>

        {/* 4'LÜ RÖNESANS & ROKOKO NİZAM DÜZENEĞİ */}
        <section className="mb-16">
          <div className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-4 sm:p-6 shadow-lg relative">
            <div className="absolute inset-1 border border-[#D4AF37]/30 pointer-events-none" />

            {/* Roma Rakamlı 4 Sekme */}
            <div className="grid grid-cols-4 gap-2 border-b-2 border-[#D4AF37]/40 pb-4 mb-6 relative z-10">
              {MADDELER.map((m, idx) => {
                const isSecili = aktifMaddeIndex === idx;
                return (
                  <button
                    key={m.no}
                    onClick={() => setAktifMaddeIndex(idx)}
                    className={`py-3 px-1 sm:px-3 transition-all flex flex-col items-center justify-center border text-center relative ${
                      isSecili
                        ? 'border-[#D4AF37] bg-gradient-to-b from-[#FAF6ED] to-[#F3ECD8] text-[#1C1917] shadow-md font-bold'
                        : 'border-transparent hover:border-[#D4AF37]/40 bg-transparent text-[#78716C]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-serif" style={{ color: isSecili ? m.renk : undefined }}>
                      {m.no}
                    </span>
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider truncate max-w-full">
                      {m.kisaBaslik}
                    </span>
                    {isSecili && (
                      <span className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 text-[#D4AF37] text-xs">
                        ♦
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aktif Açıklama Paneli */}
            <div className="px-2 sm:px-6 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] px-3 py-0.5 border"
                    style={{ borderColor: aktif.vurgu, backgroundColor: `${aktif.vurgu}15`, color: aktif.renk }}
                  >
                    {aktif.rozet}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal text-[#1C1917] tracking-wide">
                    {aktif.baslik}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
                  {aktif.aciklama}
                </p>
              </div>

              <Link
                href="/basvuru"
                className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase px-6 py-3 border border-[#8A6B2D] bg-[#1C1917] text-[#FFFDF9] hover:bg-[#8A6B2D] transition-all whitespace-nowrap self-stretch sm:self-center justify-center shadow-md"
              >
                <span>Yazı Masası</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

        {/* SON RİSALELER: SUNAK KEMERLİ (ALTARPIECE ARCH) KARTLAR */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#D4AF37]/50 pb-3">
            <div>
              <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[#8A6B2D] block font-bold">Muntazam Neşriyat</span>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1917]">Son Eklenen Risaleler</h2>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8A6B2D] hover:text-[#681320] transition-colors">
              Arşivin Tamamı →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border-2 border-[#D4AF37]/30 rounded-t-[70px] h-64 animate-pulse bg-[#FFFFFF] p-6"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-12 text-center shadow-md">
              <p className="text-sm italic text-[#44403C] mb-4">Henüz mühürlenmiş bir risale bulunmamaktadır.</p>
              <Link 
                href="/basvuru" 
                className="inline-block border border-[#8A6B2D] bg-[#681320] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold shadow-md"
              >
                İlk Metni İntisap Et
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {yazilar.map((y) => {
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    
                    {/* Sunak Nişi (Baroque Altar Niche) */}
                    <article className="border-2 border-[#D4AF37] bg-[#FFFFFF] rounded-t-[60px] p-6 sm:p-7 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-[#8A6B2D] group-hover:-translate-y-1 relative overflow-hidden">
                      
                      {/* Çift Çerçeve Stucco Efekti */}
                      <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none rounded-t-[50px]" />

                      {/* Üst Kemer Kilittaşı Rozeti */}
                      <div className="text-center relative z-10 mb-3">
                        <span className="inline-block text-[#D4AF37] text-xs">⚜</span>
                        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-1" />
                      </div>

                      <div className="relative z-10">
                        {/* Kategori ve Mütalaa Süresi */}
                        <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/25 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 border border-[#8A6B2D]/40 bg-[#FAF6ED] text-[#8A6B2D]">
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[9px] font-sans tracking-widest uppercase text-[#681320] bg-[#681320]/10 border border-[#681320]/30 px-2 py-0.5">
                                Cilt {y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-sans text-[#78716C] italic">
                            {okumaSuresi} dk mütalaa
                          </span>
                        </div>

                        {/* Risale Başlığı & Hülasa */}
                        <h3 className="font-normal text-xl text-[#1C1917] group-hover:text-[#681320] transition-colors line-clamp-2 mb-3 leading-snug">
                          {y.baslik}
                        </h3>
                        <p className="text-xs text-[#44403C] line-clamp-3 leading-relaxed font-serif italic mb-6">
                          {y.icerik}
                        </p>
                      </div>

                      {/* Yazar İmzası */}
                      <div className="relative z-10 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-[#1C1917] font-bold truncate max-w-[170px]">
                          {y.yazarlar?.ad_soyad}
                        </span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8A6B2D] group-hover:text-[#681320] flex items-center gap-1 transition-colors">
                          Mütalaa Et <span>→</span>
                        </span>
                      </div>

                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* DÖNEMSEL NEŞRİYAT (MECMUAlAR) */}
        {dergiler.length > 0 && (
          <section className="mb-12 border-t-2 border-[#D4AF37]/50 pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[#8A6B2D] block font-bold">Matbua Koleksiyonu</span>
                <h2 className="text-2xl font-normal text-[#1C1917]">ZEMİN Sayıları</h2>
              </div>
              <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8A6B2D] hover:text-[#681320]">
                Tüm Ciltler →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dergiler.map((d) => (
                <div 
                  key={d.id} 
                  className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-6 shadow-md flex items-center justify-between gap-4 relative"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#681320] bg-[#681320]/10 border border-[#681320]/30 px-2.5 py-0.5">
                      Cilt #{d.sayi_no}
                    </span>
                    <h3 className="font-normal text-base text-[#1C1917] mt-2">{d.baslik}</h3>
                    <p className="text-[11px] text-[#57534E] font-serif italic line-clamp-1">{d.aciklama || 'Tematik risale derlemesi.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-5 py-2.5 border-2 border-[#8A6B2D] bg-[#1C1917] text-[#FFFDF9] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#681320] transition-all whitespace-nowrap shadow-xs"
                  >
                    Nüshayı İndir
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ROKOKO KOLOFON / FOOTER */}
      <footer className="mt-auto w-full border-t-2 border-[#D4AF37] bg-[#FAF6ED] py-8 relative z-10 text-[#44403C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
          <div className="text-center md:text-left">
            <span className="font-serif text-xl tracking-[0.2em] text-[#1C1917] block">ZEMİN</span>
            <p className="text-[10px] text-[#78716C] uppercase tracking-widest mt-1">
              © MMXXVI • Bağımsız Felsefe, Sosyoloji ve Psikoloji Mecmuası
            </p>
          </div>

          <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
            <Link href="/iletisim" className="hover:text-[#8A6B2D] transition-colors">Mektubat</Link>
            <Link href="/basvuru" className="hover:text-[#8A6B2D] transition-colors">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#681320] hover:underline">Editör Heyeti</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

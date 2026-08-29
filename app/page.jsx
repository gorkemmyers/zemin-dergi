'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Rokoko Köşe Filigranı (Acanthus & Scrollwork)
const RococoCorner = ({ className = "w-10 h-10 text-[#C5A059]" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M0,0 L0,40 Q5,35 12,32 Q25,28 32,15 Q35,5 40,0 Z" opacity="0.8" />
    <path d="M4,4 Q18,8 24,18 Q30,28 42,28 Q40,15 28,10 Q16,5 4,4 Z" opacity="0.9" />
    <path d="M0,0 Q15,2 25,12 Q35,22 35,38 Q22,35 12,25 Q2,15 0,0 Z" />
    <circle cx="15" cy="15" r="3" />
    <circle cx="6" cy="6" r="2" />
    <path d="M2,60 Q8,45 18,38 Q28,45 22,58 Q14,62 2,60 Z" opacity="0.6" />
    <path d="M60,2 Q45,8 38,18 Q45,28 58,22 Q62,14 60,2 Z" opacity="0.6" />
  </svg>
);

// Klasik Simetrik Rozet / Fleur-de-lis Madalyon
const ClassicalMedallion = () => (
  <svg viewBox="0 0 60 20" fill="currentColor" className="w-12 h-4 text-[#C5A059] mx-auto opacity-75">
    <path d="M30,0 C27,6 20,8 10,8 C14,10 18,14 20,19 C24,14 27,11 30,15 C33,11 36,14 40,19 C42,14 46,10 50,8 C40,8 33,6 30,0 Z" />
    <circle cx="30" cy="10" r="2" />
  </svg>
);

// Antik Yunan Sütun & Chiaroscuro Heykel Arka Plan Silüeti
const ClassicalStatueBg = () => (
  <svg viewBox="0 0 300 400" className="absolute right-0 bottom-0 h-full w-auto opacity-10 pointer-events-none" fill="none" stroke="#1A1816">
    <path d="M150,40 Q170,30 190,50 Q200,70 190,95 Q175,120 160,130 Q140,145 135,170 Q130,210 145,250 Q160,290 150,380" strokeWidth="2.5" />
    <path d="M130,50 Q120,70 125,95 Q135,115 145,125" strokeWidth="1.5" />
    <path d="M110,130 Q80,160 70,220 Q60,280 80,380" strokeWidth="2" />
    <path d="M190,130 Q220,160 230,220 Q240,280 220,380" strokeWidth="2" />
    <circle cx="160" cy="65" r="30" strokeWidth="1" strokeDasharray="4 2" />
    <path d="M50,380 L250,380 M60,390 L240,390" strokeWidth="3" />
  </svg>
);

const MADDELER = [
  {
    no: 'I',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan, araştıran ve metin üreten herkese açıktır. Akademik unvan aranmaz; düşünsel derinlik ve tutarlılık esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#8C6D37',
    glow: 'rgba(197, 160, 89, 0.25)'
  },
  {
    no: 'II',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'İsim veya Mahlas Serbestisi',
    aciklama: 'Düşüncelerinizi ister gerçek adınızla, ister bağımsız bir mahlasla kaleme alabilirsiniz. ZEMİN editör meclisinde tüm metinler eşit titizlikle değerlendirilir.',
    rozet: 'SERBEST MAHLAŞ',
    renk: '#5A121E',
    glow: 'rgba(90, 18, 30, 0.25)'
  },
  {
    no: 'III',
    kisaBaslik: 'Yazar Masası',
    baslik: 'Şifresiz PIN Yönetimi',
    aciklama: 'İlk metninizle belirlediğiniz 4 haneli mühür kodu isminizle eşleşir. E-posta gerekmeksizin yazılarınızı ve okur etkileşimlerini doğrudan yönetebilirsiniz.',
    rozet: 'MÜHÜRLÜ MASASI',
    renk: '#2C1E55',
    glow: 'rgba(44, 30, 85, 0.25)'
  },
  {
    no: 'IV',
    kisaBaslik: 'Dergi Seçkisi',
    baslik: 'Dönemsel ZEMİN Yayını',
    aciklama: 'Onaylanan tüm metinler daimi dijital arşivde yer alır. Öne çıkan felsefi incelemeler ise matbu nizamındaki dönemsel ZEMİN edisyonuna dahil edilir.',
    rozet: 'RESMİ KÜLLİYAT',
    renk: '#1E4E45',
    glow: 'rgba(30, 78, 69, 0.25)'
  }
];

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        badgeBorder: 'border-[#5A121E]/30',
        badgeBg: 'bg-[#5A121E]/10 text-[#5A121E]',
        accent: '#5A121E',
        glow: 'from-[#5A121E]/10'
      };
    case 'Sosyoloji':
      return {
        badgeBorder: 'border-[#1E4E45]/30',
        badgeBg: 'bg-[#1E4E45]/10 text-[#1E4E45]',
        accent: '#1E4E45',
        glow: 'from-[#1E4E45]/10'
      };
    case 'Psikoloji':
      return {
        badgeBorder: 'border-[#2C1E55]/30',
        badgeBg: 'bg-[#2C1E55]/10 text-[#2C1E55]',
        accent: '#2C1E55',
        glow: 'from-[#2C1E55]/10'
      };
    default:
      return {
        badgeBorder: 'border-[#C5A059]/30',
        badgeBg: 'bg-[#C5A059]/10 text-[#8C6D37]',
        accent: '#8C6D37',
        glow: 'from-[#C5A059]/10'
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
    <div className="flex flex-col min-h-screen bg-[#F9F6F0] text-[#1A1816] font-serif relative selection:bg-[#C5A059]/30 selection:text-[#5A121E]">
      
      {/* Carrara Mermer ve Sıva Doku Katmanı */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0" 
        style={{ backgroundImage: `radial-gradient(#1A1816 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 relative z-10">
        
        {/* MASTHEAD & BAROK HEADER */}
        <header className="mb-12 border-b-2 border-[#C5A059]/40 pb-6 relative">
          <div className="border border-[#C5A059]/30 p-2 bg-[#FAF7F2]/80 backdrop-blur-xs shadow-sm">
            <div className="border border-[#C5A059]/60 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Sol Meta & Rastgele */}
              <div className="flex items-center gap-3 order-2 md:order-1">
                <span className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-[#8C6D37] hidden sm:inline">
                  EST. MMXXVI
                </span>
                <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
                <button 
                  onClick={handleRastgele}
                  className="px-3 py-1 border border-[#C5A059]/40 bg-[#F5EFEB] text-[11px] font-sans tracking-widest uppercase hover:bg-[#C5A059] hover:text-white transition-all shadow-2xs"
                >
                  Rastgele Risale
                </button>
              </div>

              {/* Anıtsal Roman Lapidary Başlık */}
              <div className="text-center order-1 md:order-2">
                <Link href="/" className="group block">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.28em] text-[#1A1816] transition-opacity drop-shadow-xs font-serif">
                    ZEMİN
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.35em] text-[#8C6D37] uppercase mt-1">
                    Felsefe • Sosyoloji • Psikoloji
                  </p>
                </Link>
              </div>

              {/* Sağ Metin Gönder Butonu */}
              <div className="order-3">
                <Link 
                  href="/basvuru" 
                  className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-[#8C6D37] bg-gradient-to-b from-[#FAF7F2] to-[#EFE7D8] text-[11px] font-sans font-bold uppercase tracking-wider text-[#5A121E] hover:border-[#5A121E] hover:shadow-md transition-all"
                >
                  <span className="text-[#C5A059]">✦</span>
                  <span>Metin İntisabı</span>
                </Link>
              </div>
            </div>

            {/* Klasik Navigasyon Çıtası */}
            <nav className="mt-2 pt-2 border-t border-[#C5A059]/30 flex justify-center items-center gap-6 sm:gap-10 text-xs uppercase font-sans tracking-[0.18em] font-semibold text-[#4A453F]">
              <Link href="/" className="text-[#8C6D37] font-bold border-b border-[#8C6D37]">Ana Sayfa</Link>
              <Link href="/yazilar" className="hover:text-[#8C6D37] transition-colors">Arşiv-i Yazılar</Link>
              <Link href="/dergiler" className="hover:text-[#8C6D37] transition-colors">Dönemsel Neşriyat</Link>
              <Link href="/yazarlar" className="hover:text-[#8C6D37] transition-colors">Müellifler</Link>
              <Link href="/iletisim" className="hover:text-[#8C6D37] transition-colors">Mektubat</Link>
            </nav>
          </div>
        </header>

        {/* HERO BÖLÜMÜ: KLASİK BOISERIE VE KEMERLİ REVAK */}
        <section className="mb-14 relative bg-[#FAF7F2] border-2 border-[#C5A059]/50 p-6 sm:p-12 shadow-xl overflow-hidden">
          {/* 4 Köşe Rokoko Varakları */}
          <div className="absolute top-1 left-1"><RococoCorner /></div>
          <div className="absolute top-1 right-1 -scale-x-100"><RococoCorner /></div>
          <div className="absolute bottom-1 left-1 -scale-y-100"><RococoCorner /></div>
          <div className="absolute bottom-1 right-1 -scale-x-100 -scale-y-100"><RococoCorner /></div>

          {/* İç Çift Çerçeve (Boiserie Çıtalama) */}
          <div className="absolute inset-3 border border-[#C5A059]/30 pointer-events-none" />
          
          <ClassicalStatueBg />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <ClassicalMedallion />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#8C6D37] mt-3 block">
              Hür Tefekkür Mecmuası
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#1A1816] leading-tight my-4">
              Düşüncenin Zemini, <br />
              <span className="italic font-light text-[#5A121E]">Kadim ve Özgür İfade.</span>
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed mb-8 max-w-lg mx-auto font-serif">
              Akademik duvarların ötesinde; felsefi tetkik, sosyolojik tenkit ve ruhi tahliller için tesis edilmiş bağımsız düşünce meclisi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs">
              <Link 
                href="/basvuru" 
                className="px-6 py-2.5 bg-[#1A1816] text-[#F9F6F0] tracking-widest uppercase font-bold hover:bg-[#5A121E] border border-[#C5A059]/60 shadow-lg hover:shadow-xl transition-all"
              >
                Risale Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-6 py-2.5 bg-[#FAF7F2] text-[#1A1816] tracking-widest uppercase font-bold border border-[#C5A059] hover:bg-[#C5A059]/15 transition-all"
              >
                Külliyatı İncele
              </Link>
            </div>
          </div>
        </section>

        {/* 4'LÜ RÖNESANS NİZAM KONSOLU */}
        <section className="mb-16">
          <div className="border border-[#C5A059]/40 bg-[#FAF7F2] p-4 sm:p-6 relative shadow-md">
            
            {/* Roma Rakamlı 4 Sekme */}
            <div className="grid grid-cols-4 gap-2 border-b border-[#C5A059]/30 pb-4 mb-5">
              {MADDELER.map((m, idx) => {
                const isSecili = aktifMaddeIndex === idx;
                return (
                  <button
                    key={m.no}
                    onClick={() => setAktifMaddeIndex(idx)}
                    className={`py-3 px-2 transition-all flex flex-col items-center justify-center border text-center relative ${
                      isSecili
                        ? 'border-[#8C6D37] bg-[#EFE7D8]/80 text-[#1A1816] shadow-inner'
                        : 'border-transparent hover:border-[#C5A059]/40 bg-transparent text-[#6E685F]'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-bold font-serif" style={{ color: isSecili ? m.renk : undefined }}>
                      {m.no}
                    </span>
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider font-semibold truncate max-w-full">
                      {m.kisaBaslik}
                    </span>
                    {isSecili && (
                      <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 text-[#8C6D37] text-[10px]">
                        ▲
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aktif Madde Açıklama Paneli */}
            <div className="px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 border"
                    style={{ borderColor: `${aktif.renk}60`, backgroundColor: `${aktif.renk}10`, color: aktif.renk }}
                  >
                    {aktif.rozet}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal text-[#1A1816] tracking-wide">
                    {aktif.baslik}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed">
                  {aktif.aciklama}
                </p>
              </div>

              <Link
                href="/basvuru"
                className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2.5 border border-[#8C6D37] bg-[#1A1816] text-[#F9F6F0] hover:bg-[#8C6D37] transition-all whitespace-nowrap self-stretch sm:self-center justify-center shadow-xs"
              >
                <span>Müracaat Masası</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

        {/* SON METİNLER: KEMERLİ NİŞ (ARCHED NICHE) KARTLARI */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-[#C5A059]/40 pb-3">
            <div>
              <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#8C6D37] block font-bold">Muntazam Neşir</span>
              <h2 className="text-2xl font-normal text-[#1A1816] tracking-wide">Son Eklenen Metinler</h2>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8C6D37] hover:text-[#5A121E] transition-colors">
              Bütün Külliyat →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-[#C5A059]/30 rounded-t-[60px] h-64 animate-pulse bg-[#FAF7F2] p-6"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border-2 border-[#C5A059]/40 bg-[#FAF7F2] p-12 text-center">
              <p className="text-sm font-serif italic text-[#4A453F] mb-4">Henüz mühürlenmiş bir düşünce risalesi bulunmamaktadır.</p>
              <Link 
                href="/basvuru" 
                className="inline-block border border-[#8C6D37] bg-[#5A121E] text-white px-6 py-2 text-xs font-sans uppercase tracking-widest font-bold"
              >
                İlk Metni İntisap Et
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {yazilar.map((y) => {
                const stil = getDisiplinStili(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    {/* Kemerli Niş (Arched Niche) Kart Mimarisi */}
                    <article className="border border-[#C5A059]/50 bg-[#FAF7F2] rounded-t-[50px] p-5 sm:p-6 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#8C6D37] group-hover:-translate-y-1 relative overflow-hidden">
                      
                      {/* Üst Kemer Varak Süsü */}
                      <div className="w-16 h-1 bg-[#C5A059]/40 mx-auto rounded-full mb-3" />

                      <div className="relative z-10">
                        {/* Kategori ve Okuma Süresi */}
                        <div className="flex items-center justify-between mb-3 border-b border-[#C5A059]/20 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 border ${stil.badgeBorder} ${stil.badgeBg}`}>
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[9px] font-sans tracking-widest uppercase text-[#5A121E] bg-[#5A121E]/10 border border-[#5A121E]/30 px-2 py-0.5">
                                Cilt {y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-sans text-[#78716C] italic">
                            {okumaSuresi} dk mütalaa
                          </span>
                        </div>

                        {/* Başlık ve İçerik Özeti */}
                        <h3 className="font-normal text-lg sm:text-xl text-[#1A1816] group-hover:text-[#5A121E] transition-colors line-clamp-2 mb-2 leading-snug">
                          {y.baslik}
                        </h3>
                        <p className="text-xs text-[#4A453F] line-clamp-3 leading-relaxed font-serif italic mb-4">
                          {y.icerik}
                        </p>
                      </div>

                      {/* Yazar ve Oku İmzası */}
                      <div className="relative z-10 pt-3 border-t border-[#C5A059]/30 flex items-center justify-between text-xs">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-[#1A1816] font-semibold truncate max-w-[170px]">
                          {y.yazarlar?.ad_soyad}
                        </span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8C6D37] group-hover:text-[#5A121E] flex items-center gap-1 transition-colors">
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

        {/* DÖNEMSEL NEŞRİYAT (DERGİ KÜTÜPHANESİ) */}
        {dergiler.length > 0 && (
          <section className="mb-12 border-t-2 border-[#C5A059]/40 pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#8C6D37] block font-bold">Mecmua Koleksiyonu</span>
                <h2 className="text-2xl font-normal text-[#1A1816]">ZEMİN Matbu Nüshaları</h2>
              </div>
              <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8C6D37] hover:text-[#5A121E]">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dergiler.map((d) => (
                <div 
                  key={d.id} 
                  className="border-2 border-[#C5A059]/40 bg-[#FAF7F2] p-5 shadow-sm flex items-center justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#5A121E] bg-[#5A121E]/10 border border-[#5A121E]/30 px-2 py-0.5">
                      Sayı #{d.sayi_no}
                    </span>
                    <h3 className="font-normal text-base text-[#1A1816] mt-2">{d.baslik}</h3>
                    <p className="text-[11px] text-[#5C564E] font-serif italic line-clamp-1">{d.aciklama || 'Tematik risale derlemesi.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 border border-[#8C6D37] bg-[#1A1816] text-[#F9F6F0] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#5A121E] transition-all whitespace-nowrap"
                  >
                    Nüshayı Aç
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* RÖNESANS KOLOFON & FOOTER */}
      <footer className="mt-auto w-full border-t-2 border-[#C5A059]/40 bg-[#FAF7F2] py-8 relative z-10 text-[#4A453F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
          
          <div className="text-center md:text-left">
            <span className="font-serif text-lg font-normal tracking-[0.2em] text-[#1A1816] block">ZEMİN</span>
            <p className="text-[10px] text-[#78716C] uppercase tracking-widest mt-0.5">
              © MMXXVI • Bağımsız Düşünce ve İnceleme Neşriyatı
            </p>
          </div>

          <div className="flex gap-8 text-[11px] uppercase tracking-widest font-semibold">
            <Link href="/iletisim" className="hover:text-[#8C6D37] transition-colors">Mektubat</Link>
            <Link href="/basvuru" className="hover:text-[#8C6D37] transition-colors">Yayın Nizamnamesi</Link>
            <Link href="/admin" className="text-[#5A121E] hover:underline">Editör Meclisi</Link>
          </div>
          
        </div>
      </footer>
    </div>
  );
}

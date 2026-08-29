'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Fransız Rokoko Acanthus & C-Scroll Köşe Süsü (SVG)
const RococoAcanthusCorner = ({ className = "w-14 h-14 text-[#D4AF37]" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M0,0 C25,2 45,15 52,32 C58,45 50,60 36,62 C24,65 15,54 20,44 C24,35 34,34 38,40 C40,44 38,50 32,50 C30,50 27,47 29,44 C31,39 38,39 38,46 C38,57 21,60 13,46 C5,32 17,12 40,8 C63,4 82,23 77,50 C74,71 52,88 30,90 C17,92 7,87 0,82 L0,100 C15,100 34,97 50,88 C80,71 96,42 90,17 C85,-4 58,-2 0,0 Z" opacity="0.9" />
    <circle cx="24" cy="24" r="3" fill="#FFFDF9" />
  </svg>
);

// Antik Yunan Defne Çelengi & Cameo Rozeti
const ClassicalLaurelMedallion = () => (
  <svg viewBox="0 0 120 40" fill="currentColor" className="w-24 h-8 text-[#D4AF37] mx-auto opacity-90">
    <path d="M60,2 C52,10 40,12 25,6 C32,16 28,26 15,28 C28,30 38,24 45,28 C52,32 55,38 60,40 C65,38 68,32 75,28 C82,24 92,30 105,28 C92,26 88,16 95,6 C80,12 68,10 60,2 Z" />
    <circle cx="60" cy="20" r="4" fill="#FFFDF9" />
  </svg>
);

// Heykelsi Chiaroscuro Vektör İllüstrasyonu (Antik Yunan Büstü)
const ApolloSculptureBg = () => (
  <svg viewBox="0 0 240 320" className="absolute right-4 -bottom-6 h-64 sm:h-80 w-auto opacity-20 pointer-events-none drop-shadow-md" fill="none" stroke="#1A2B4C">
    <path d="M120,40 C140,20 170,30 180,60 C190,90 175,120 160,135 C145,150 140,180 150,220 C160,260 150,300 140,320" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M110,60 C90,80 95,110 115,125 C130,135 135,160 130,190" strokeWidth="2" />
    <path d="M80,140 C50,170 40,230 60,300" strokeWidth="2.5" />
    <path d="M170,140 C200,170 210,230 190,300" strokeWidth="2.5" />
    <circle cx="150" cy="75" r="28" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M40,300 L210,300 M50,312 L200,312" strokeWidth="3" />
  </svg>
);

const MADDELER = [
  {
    no: 'I',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan ve üreten herkese açıktır. Akademik unvan şartı aranmaz; entelektüel derinlik ve özgünlük esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#1E3A5F', // Lapis Lazuli
    vurgu: '#2B6CB0'
  },
  {
    no: 'II',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'Yazar Adı veya Mahlas',
    aciklama: 'Metinlerinizi gerçek adınızla veya edebi bir mahlasla yayımlayabilirsiniz. Tüm metinler editoryal olarak eşit titizlikle değerlendirilir.',
    rozet: 'ÖZGÜR YAZAR',
    renk: '#8B2635', // Venedik Kırmızısı
    vurgu: '#C86D51'
  },
  {
    no: 'III',
    kisaBaslik: 'Yazar Paneli',
    baslik: 'PIN ile Pratik Yönetim',
    aciklama: 'İlk metninizle oluşturduğunuz 4 haneli PIN kodu yazar profilinizle eşleşir. Şifre karmaşası olmadan metinlerinizi ve etkileşimleri yönetebilirsiniz.',
    rozet: 'HIZLI ERİŞİM',
    renk: '#4A2040', // Kraliyet Moru
    vurgu: '#7A3B69'
  },
  {
    no: 'IV',
    kisaBaslik: 'Basılı Seçki',
    baslik: 'Dönemsel ZEMİN Dergisi',
    aciklama: 'Tüm metinler dijital arşivde yer alır. Yayın kurulu tarafından öne çıkarılan denemeler ise dönemsel basılı dergi edisyonuna dahil edilir.',
    rozet: 'EDİTÖRYAL SEÇKİ',
    renk: '#1D4E43', // Rönesans Zümrütü
    vurgu: '#2A7B6B'
  }
];

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        badgeBorder: 'border-[#8B2635]/40',
        badgeBg: 'bg-[#8B2635]/10 text-[#8B2635]',
        accent: '#8B2635',
        gradient: 'from-[#8B2635]/15 via-transparent to-[#FDFBF7]'
      };
    case 'Sosyoloji':
      return {
        badgeBorder: 'border-[#1E3A5F]/40',
        badgeBg: 'bg-[#1E3A5F]/10 text-[#1E3A5F]',
        accent: '#1E3A5F',
        gradient: 'from-[#1E3A5F]/15 via-transparent to-[#FDFBF7]'
      };
    case 'Psikoloji':
      return {
        badgeBorder: 'border-[#4A2040]/40',
        badgeBg: 'bg-[#4A2040]/10 text-[#4A2040]',
        accent: '#4A2040',
        gradient: 'from-[#4A2040]/15 via-transparent to-[#FDFBF7]'
      };
    default:
      return {
        badgeBorder: 'border-[#D4AF37]/50',
        badgeBg: 'bg-[#D4AF37]/15 text-[#8C6D37]',
        accent: '#8C6D37',
        gradient: 'from-[#D4AF37]/15 via-transparent to-[#FDFBF7]'
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
    const { data } = await supabase.from('yazilar').select('slug').eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    }
  };

  const aktif = MADDELER[aktifMaddeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F5] text-[#1A1816] font-serif selection:bg-[#D4AF37]/30 selection:text-[#8B2635] relative">
      
      {/* Arka Plan Mermer ve Sıva Dokusu */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#1E3A5F 0.5px, #FBF9F5 0.5px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20 relative z-10">

        {/* MASTHEAD & YÜKSEK RÖNESANS HEADER */}
        <header className="mb-10 text-center relative">
          <div className="bg-[#FFFFFF]/95 border-2 border-[#D4AF37] p-2 shadow-[0_12px_32px_rgba(212,175,55,0.15)] rounded-sm">
            <div className="border border-[#D4AF37]/40 px-4 py-4 bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#FAF5EB]">
              
              <ClassicalLaurelMedallion />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-1">
                <div className="flex items-center gap-3 order-2 md:order-1">
                  <span className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-[#8C6D37]">
                    ROMA • FLORENSA • ATİNA
                  </span>
                  <button 
                    onClick={handleRastgele}
                    className="px-3 py-1 border border-[#D4AF37] bg-[#FAF5EB] text-[10px] font-sans tracking-widest uppercase text-[#1A1816] hover:bg-[#D4AF37] hover:text-white transition-all shadow-2xs font-semibold"
                  >
                    Rastgele Metin
                  </button>
                </div>

                {/* ZEMIN Lapidary Başlık */}
                <div className="order-1 md:order-2">
                  <Link href="/" className="inline-block group">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-[0.3em] text-[#1A1816] font-serif uppercase drop-shadow-xs">
                      ZEMİN
                    </h1>
                    <p className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.4em] text-[#8C6D37] uppercase mt-1">
                      Felsefe • Sosyoloji • Psikoloji Dergisi
                    </p>
                  </Link>
                </div>

                <div className="order-3">
                  <Link 
                    href="/basvuru" 
                    className="inline-flex items-center gap-2 px-5 py-2 border-2 border-[#8C6D37] bg-gradient-to-r from-[#8B2635] to-[#A7333F] text-white text-[11px] font-sans font-bold uppercase tracking-widest shadow-md hover:brightness-110 transition-all"
                  >
                    <span>✦ Metin Gönder</span>
                  </Link>
                </div>
              </div>

              {/* İnce Altın Çıta */}
              <div className="flex items-center justify-center gap-3 my-3 opacity-75">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-[#8C6D37]" />
                <span className="text-[#8C6D37] text-xs">🏛</span>
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-[#D4AF37] to-[#8C6D37]" />
              </div>

              {/* Navigasyon */}
              <nav className="flex justify-center items-center gap-6 sm:gap-10 text-[11px] uppercase font-sans tracking-[0.2em] font-bold text-[#44403C]">
                <Link href="/" className="text-[#8C6D37] border-b-2 border-[#8C6D37] pb-0.5">Ana Sayfa</Link>
                <Link href="/yazilar" className="hover:text-[#8C6D37] transition-colors">Tüm Yazılar</Link>
                <Link href="/dergiler" className="hover:text-[#8C6D37] transition-colors">Dergiler</Link>
                <Link href="/yazarlar" className="hover:text-[#8C6D37] transition-colors">Yazarlar</Link>
                <Link href="/iletisim" className="hover:text-[#8C6D37] transition-colors">İletişim</Link>
              </nav>

            </div>
          </div>
        </header>

        {/* HERO: RÖNESANS FRESKİ & KEMERLİ GALERİ ALANI */}
        <section className="mb-14 relative bg-[#FFFFFF] border-2 border-[#D4AF37] p-6 sm:p-14 shadow-2xl overflow-hidden rounded-t-[60px] sm:rounded-t-[100px]">
          
          {/* Göksel Rönesans Fresk Atmosferi (Lapis Lazuli Mavi & Gül Kurusu Gökyüzü) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 z-0"
            style={{
              background: `radial-gradient(ellipse at 50% 15%, rgba(186, 215, 233, 0.9) 0%, rgba(248, 222, 210, 0.75) 45%, rgba(251, 249, 245, 0.95) 85%)`
            }}
          />

          {/* Dört Köşe Rokoko Varakları */}
          <div className="absolute top-2 left-2 z-10"><RococoAcanthusCorner /></div>
          <div className="absolute top-2 right-2 -scale-x-100 z-10"><RococoAcanthusCorner /></div>
          <div className="absolute bottom-2 left-2 -scale-y-100 z-10"><RococoAcanthusCorner /></div>
          <div className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100 z-10"><RococoAcanthusCorner /></div>

          {/* İç Çıtalar (Boiserie) */}
          <div className="absolute inset-3 border border-[#D4AF37]/50 pointer-events-none rounded-t-[50px] sm:rounded-t-[90px]" />

          <ApolloSculptureBg />

          <div className="relative z-10 max-w-2xl mx-auto text-center pt-4 sm:pt-6">
            <span className="inline-block border border-[#D4AF37] bg-[#FFFDF9]/90 px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#8C6D37] shadow-xs mb-3">
              Özgür Düşünce Platformu
            </span>

            <h2 className="text-3xl sm:text-5xl font-normal tracking-wide text-[#1A1816] leading-tight mb-4">
              Düşüncenin Zirvesi, <br />
              <span className="italic font-light text-[#8B2635]">Özgür ve Eleştirel Zemin.</span>
            </h2>

            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4" />

            <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed max-w-lg mx-auto font-serif italic mb-8">
              Akademik sınırların ötesinde; felsefi sorgulama, sosyolojik analiz ve psikolojik derinlik için tasarlanmış bağımsız yayın alanı.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs">
              <Link 
                href="/basvuru" 
                className="px-8 py-3 bg-[#1A1816] text-[#FFFDF9] tracking-[0.2em] uppercase font-bold border-2 border-[#D4AF37] shadow-xl hover:bg-[#8B2635] transition-all"
              >
                Yazı Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-8 py-3 bg-[#FFFDF9] text-[#1A1816] tracking-[0.2em] uppercase font-bold border-2 border-[#D4AF37] hover:bg-[#FAF5EB] transition-all shadow-xs"
              >
                Arşivi Keşfet
              </Link>
            </div>
          </div>
        </section>

        {/* 4'LÜ RÖNESANS KONSOLU */}
        <section className="mb-16">
          <div className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-4 sm:p-6 shadow-md relative">
            <div className="absolute inset-1 border border-[#D4AF37]/30 pointer-events-none" />

            {/* Roma Rakamlı 4 Sekme */}
            <div className="grid grid-cols-4 gap-2 border-b border-[#D4AF37]/40 pb-4 mb-6 relative z-10">
              {MADDELER.map((m, idx) => {
                const isSecili = aktifMaddeIndex === idx;
                return (
                  <button
                    key={m.no}
                    onClick={() => setAktifMaddeIndex(idx)}
                    className={`py-3 px-1 sm:px-3 transition-all flex flex-col items-center justify-center border text-center relative ${
                      isSecili
                        ? 'border-[#D4AF37] bg-gradient-to-b from-[#FAF5EB] to-[#F3ECD8] text-[#1A1816] shadow-inner font-bold'
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
                      <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 text-[#D4AF37] text-xs">
                        ♦
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aktif Panel Açıklaması */}
            <div className="px-2 sm:px-6 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] px-3 py-0.5 border"
                    style={{ borderColor: aktif.vurgu, backgroundColor: `${aktif.vurgu}15`, color: aktif.renk }}
                  >
                    {aktif.rozet}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal text-[#1A1816] tracking-wide">
                    {aktif.baslik}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#4A453F] leading-relaxed italic">
                  {aktif.aciklama}
                </p>
              </div>

              <Link
                href="/basvuru"
                className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase px-6 py-3 border border-[#8C6D37] bg-[#1A1816] text-[#FFFDF9] hover:bg-[#8C6D37] transition-all whitespace-nowrap self-stretch sm:self-center justify-center shadow-md"
              >
                <span>Yazı Masasına Git</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>

        {/* SON YAZILAR: KEMERLİ SANAT NİŞLERİ & EDİTÖRYAL KARTLAR */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#D4AF37]/50 pb-3">
            <div>
              <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[#8C6D37] block font-bold">Editoryal Seçki</span>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1816]">Son Yayımlanan Metinler</h2>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8C6D37] hover:text-[#8B2635] transition-colors">
              Tüm Arşiv →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border-2 border-[#D4AF37]/30 rounded-t-[60px] h-64 animate-pulse bg-[#FFFFFF] p-6"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-12 text-center shadow-md">
              <p className="text-sm italic text-[#4A453F] mb-4">Henüz yayımlanmış bir düşünce metni bulunmamaktadır.</p>
              <Link 
                href="/basvuru" 
                className="inline-block border border-[#8C6D37] bg-[#8B2635] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold shadow-md"
              >
                İlk Metni Sen Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {yazilar.map((y) => {
                const stil = getDisiplinStili(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    
                    {/* Kemerli Niş Kartı */}
                    <article className="border-2 border-[#D4AF37] bg-[#FFFFFF] rounded-t-[50px] p-6 sm:p-7 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-[#8C6D37] group-hover:-translate-y-1 relative overflow-hidden">
                      
                      {/* Renkli Fresk Arka Plan Gradyanı */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${stil.gradient} pointer-events-none opacity-40`} />

                      {/* Çift Çerçeve Efekti */}
                      <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none rounded-t-[42px]" />

                      {/* Üst Kemer Altın Rozeti */}
                      <div className="text-center relative z-10 mb-2">
                        <span className="inline-block text-[#D4AF37] text-xs">✦</span>
                        <div className="w-10 h-[1px] bg-[#D4AF37] mx-auto mt-0.5" />
                      </div>

                      <div className="relative z-10">
                        {/* Kategori ve Okuma Süresi */}
                        <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/25 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 border ${stil.badgeBorder} ${stil.badgeBg}`}>
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[9px] font-sans tracking-widest uppercase text-[#8B2635] bg-[#8B2635]/10 border border-[#8B2635]/30 px-2 py-0.5 font-bold">
                                Sayı #{y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-sans text-[#78716C] italic font-medium">
                            {okumaSuresi} dk okuma
                          </span>
                        </div>

                        {/* Başlık ve Metin */}
                        <h3 className="font-normal text-xl text-[#1A1816] group-hover:text-[#8B2635] transition-colors line-clamp-2 mb-3 leading-snug">
                          {y.baslik}
                        </h3>
                        <p className="text-xs text-[#4A453F] line-clamp-3 leading-relaxed font-serif italic mb-6">
                          {y.icerik}
                        </p>
                      </div>

                      {/* Yazar İmzası */}
                      <div className="relative z-10 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-[#1A1816] font-bold truncate max-w-[170px]">
                          {y.yazarlar?.ad_soyad}
                        </span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8C6D37] group-hover:text-[#8B2635] flex items-center gap-1 transition-colors">
                          Yazıyı Oku <span>→</span>
                        </span>
                      </div>

                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* DÖNEMSEL DERGİLER (EDİSYONLAR) */}
        {dergiler.length > 0 && (
          <section className="mb-12 border-t-2 border-[#D4AF37]/50 pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[#8C6D37] block font-bold">Koleksiyon</span>
                <h2 className="text-2xl font-normal text-[#1A1816]">ZEMİN Dergi Edisyonları</h2>
              </div>
              <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#8C6D37] hover:text-[#8B2635]">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dergiler.map((d) => (
                <div 
                  key={d.id} 
                  className="border-2 border-[#D4AF37] bg-[#FFFFFF] p-6 shadow-md flex items-center justify-between gap-4 relative"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#8B2635] bg-[#8B2635]/10 border border-[#8B2635]/30 px-2.5 py-0.5">
                      Sayı #{d.sayi_no}
                    </span>
                    <h3 className="font-normal text-base text-[#1A1816] mt-2">{d.baslik}</h3>
                    <p className="text-[11px] text-[#57534E] font-serif italic line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-5 py-2.5 border-2 border-[#8C6D37] bg-[#1A1816] text-[#FFFDF9] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#8B2635] transition-all whitespace-nowrap shadow-xs"
                  >
                    PDF İncele
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* RÖNESANS KOLOFON & FOOTER */}
      <footer className="mt-auto w-full border-t-2 border-[#D4AF37] bg-[#FAF5EB] py-8 relative z-10 text-[#44403C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
          <div className="text-center md:text-left">
            <span className="font-serif text-xl tracking-[0.25em] text-[#1A1816] block font-bold">ZEMİN</span>
            <p className="text-[10px] text-[#78716C] uppercase tracking-widest mt-1">
              © MMXXVI • Bağımsız Felsefe, Sosyoloji ve Psikoloji Dergisi
            </p>
          </div>

          <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
            <Link href="/iletisim" className="hover:text-[#8C6D37] transition-colors">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#8C6D37] transition-colors">Yayın İlkeleri</Link>
            <Link href="/admin" className="text-[#8B2635] hover:underline">Editör Paneli</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

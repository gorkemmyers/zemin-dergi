'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Küratörlü Rokoko, Rönesans ve Barok Tablo Havuzu
const SANAT_HAVUZU = [
  "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85", // Tiepolo Tarzı Tavan Freski
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",  // Rönesans Heykel & Işık
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",  // Salon Topluluk Sahnesi
  "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",  // Chiaroscuro Portre
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",  // Klasik Yağlı Boya
  "https://images.unsplash.com/photo-1579783901586-7880cb4cd40a?auto=format&fit=crop&w=800&q=80",  // Mitolojik Alegori
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",  // Klasik Form & Heykelsi Gölgeler
  "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=800&q=80",  // Antik Detay & Arşitrav
  "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80",  // Galeri & Mermer Perspektif
  "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&w=800&q=80"   // Kemerli Revak & Tonoz
];

// Rokoko C-Scroll ve Kabuk (Rocaille) Vektör Çerçeve Detayı
const RocailleShell = ({ className = "w-6 h-6 text-[#C29B38]" }) => (
  <svg viewBox="0 0 100 60" fill="currentColor" className={className}>
    <path d="M50,0 C35,15 15,20 0,25 C15,35 25,50 30,60 C40,45 45,35 50,30 C55,35 60,45 70,60 C75,50 85,35 100,25 C85,20 65,15 50,0 Z" opacity="0.85" />
    <circle cx="50" cy="20" r="3.5" fill="#FAF7F2" />
  </svg>
);

// 4 İlke İçin Rokoko Salon Konsolu Verileri
const ILKELER = [
  {
    no: 'I',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan herkese açıktır. Akademik paye şartı aranmaz; entelektüel derinlik ve özgünlük esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#1E3A5F', // Lapis Lazuli
    resim: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  },
  {
    no: 'II',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'Yazar Adı veya Mahlas',
    aciklama: 'Metinlerinizi gerçek adınızla veya bağımsız bir mahlasla yayımlayabilirsiniz. Tüm denemeler yayın masasında eşit saygıyla incelenir.',
    rozet: 'ÖZGÜR MAHLAS',
    renk: '#7B1E2B', // Venedik Kırmızısı
    resim: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80"
  },
  {
    no: 'III',
    kisaBaslik: 'Yazar Masası',
    baslik: '4 Haneli Mühür / PIN',
    aciklama: 'İlk metninizle belirlediğiniz PIN kodu profilinizle eşleşir. E-posta şifresi karmaşası olmadan metinlerinizi doğrudan yönetebilirsiniz.',
    rozet: 'HIZLI ERİŞİM',
    renk: '#432344', // Fransız Moru
    resim: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80"
  },
  {
    no: 'IV',
    kisaBaslik: 'Basılı Külliyat',
    baslik: 'Dönemsel ZEMİN Dergisi',
    aciklama: 'Onaylanan tüm metinler web arşivinde yer alır. Öne çıkan makaleler ise dönemsel basılı ZEMİN Dergisi edisyonuna dahil edilir.',
    rozet: 'RESMİ SEÇKİ',
    renk: '#1D4E43', // Rokoko Zümrütü
    resim: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
  }
];

// Tekrarsız Görsel ve Renk Üretici Yardımcı Fonksiyonu
const getDinamikSanat = (kategori, id, index) => {
  const seed = (typeof id === 'number' ? id : (index || 1) * 7) % SANAT_HAVUZU.length;
  const resim = SANAT_HAVUZU[seed];

  switch (kategori) {
    case 'Felsefe':
      return {
        resim,
        renk: '#7B1E2B',
        badgeBg: 'bg-[#7B1E2B]/10 text-[#7B1E2B] border-[#7B1E2B]/30'
      };
    case 'Sosyoloji':
      return {
        resim,
        renk: '#1E3A5F',
        badgeBg: 'bg-[#1E3A5F]/10 text-[#1E3A5F] border-[#1E3A5F]/30'
      };
    case 'Psikoloji':
      return {
        resim,
        renk: '#432344',
        badgeBg: 'bg-[#432344]/10 text-[#432344] border-[#432344]/30'
      };
    default:
      return {
        resim,
        renk: '#8C6D37',
        badgeBg: 'bg-[#8C6D37]/10 text-[#8C6D37] border-[#8C6D37]/30'
      };
  }
};

export default function Home() {
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktifIlkeIndex, setAktifIlkeIndex] = useState(0);

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

  const aktifIlke = ILKELER[aktifIlkeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5EE] text-[#1D1A17] font-serif selection:bg-[#C29B38]/30 selection:text-[#7B1E2B] relative">
      
      {/* İnce Şampanya Sıvası ve Fresk Dokusu */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0" 
        style={{ backgroundImage: `radial-gradient(#1D1A17 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-20 relative z-10 space-y-12">

        {/* 1. MASTHEAD & ANITSAL RÖNESANS ALINLIĞI */}
        <header className="border-b border-[#DFD5C6] pb-5">
          <div className="bg-[#FAF7F2] border border-[#E5DCD0] rounded-t-[36px] rounded-b-xl p-4 sm:p-5 shadow-xs">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E5DCD0] pb-3">
              
              {/* Sol: Tarih & Rastgele Risale */}
              <div className="flex items-center gap-3 order-2 md:order-1">
                <span className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-[#8C7A65]">
                  ROMA • FLORENSA • ATİNA
                </span>
                <span className="text-[#D8CDBC] hidden sm:inline">•</span>
                <button 
                  onClick={handleRastgele}
                  className="px-3 py-1 bg-[#F1EAE0] border border-[#D8CDBC] text-[10px] font-sans tracking-widest uppercase hover:bg-[#1D1A17] hover:text-[#FAF7F2] transition-colors rounded-full font-semibold"
                >
                  Rastgele Metin
                </button>
              </div>

              {/* Merkez: Roma Lapidary Tipografi */}
              <div className="text-center order-1 md:order-2">
                <Link href="/" className="inline-block group">
                  <h1 className="text-4xl sm:text-6xl font-normal tracking-[0.32em] text-[#1D1A17] uppercase">
                    ZEMİN
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.4em] text-[#8C7A65] uppercase mt-0.5">
                    Felsefe • Sosyoloji • Psikoloji
                  </p>
                </Link>
              </div>

              {/* Sağ: Metin Gönder */}
              <div className="order-3">
                <Link 
                  href="/basvuru" 
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#7B1E2B] text-white text-[11px] font-sans font-bold uppercase tracking-widest hover:bg-[#5C141E] transition-colors rounded-full shadow-xs"
                >
                  <span>✦ Metin Gönder</span>
                </Link>
              </div>

            </div>

            {/* Kemerli Menü */}
            <nav className="flex justify-center items-center gap-6 sm:gap-12 text-[11px] uppercase font-sans tracking-[0.22em] font-bold text-[#574F45] pt-3">
              <Link href="/" className="text-[#7B1E2B] border-b-2 border-[#7B1E2B] pb-0.5">Ana Sayfa</Link>
              <Link href="/yazilar" className="hover:text-[#7B1E2B] transition-colors">Tüm Yazılar</Link>
              <Link href="/dergiler" className="hover:text-[#7B1E2B] transition-colors">Dergiler</Link>
              <Link href="/yazarlar" className="hover:text-[#7B1E2B] transition-colors">Yazarlar</Link>
              <Link href="/iletisim" className="hover:text-[#7B1E2B] transition-colors">İletişim</Link>
            </nav>

          </div>
        </header>

        {/* 2. HERO: GÖKSEL TAVAN FRESKİ (GRAND ROCOCO TAVAN) */}
        <section className="relative bg-[#171412] text-[#FAF7F2] rounded-t-[70px] sm:rounded-t-[110px] rounded-b-2xl overflow-hidden border border-[#DFD5C6] shadow-2xl">
          
          {/* Tavan Freski Görseli */}
          <img 
            src={SANAT_HAVUZU[0]} 
            alt="Ceiling Fresco" 
            className="absolute inset-0 w-full h-full object-cover opacity-45 object-center mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-1000"
          />

          {/* Chiaroscuro Işık & Gölge Gradyanı */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/60 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-16 sm:py-24">
            
            <div className="flex justify-center mb-3">
              <RocailleShell className="w-8 h-6 text-[#E4CA9E]" />
            </div>

            <span className="inline-block border border-[#E5DCD0]/30 bg-[#171412]/80 backdrop-blur-xs px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#E4CA9E] rounded-full mb-4">
              Hür Düşünce Galerisi
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight text-[#FAF7F2] mb-6">
              Düşüncenin Zirvesi, <br />
              <span className="italic font-light text-[#E4CA9E]">Özgür ve Eleştirel Zemin.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#D8CDBC] leading-relaxed max-w-xl mx-auto italic mb-10 font-serif">
              Akademik duvarların ötesinde; felsefi sorgulama, sosyolojik analiz ve psikolojik derinlik üzerine düşünen herkese açık entelektüel meclis.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs">
              <Link 
                href="/basvuru" 
                className="px-8 py-3 bg-[#7B1E2B] text-white tracking-[0.2em] uppercase font-bold hover:bg-[#5C141E] transition-all rounded-full shadow-md"
              >
                Yazı Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-8 py-3 bg-[#FAF7F2]/90 text-[#171412] tracking-[0.2em] uppercase font-bold hover:bg-[#FAF7F2] transition-all rounded-full shadow-xs"
              >
                Külliyatı İncele
              </Link>
            </div>

          </div>
        </section>

        {/* 3. İNTERAKTİF ROKOKO SALON KONSOLU (4 İLKE & RESİMLİ PANEL) */}
        <section className="bg-[#FAF7F2] border border-[#DFD5C6] rounded-t-[40px] rounded-b-2xl p-5 sm:p-7 shadow-sm">
          
          {/* Üst 4 Buton Sekmesi */}
          <div className="grid grid-cols-4 gap-2 border-b border-[#E5DCD0] pb-4 mb-6">
            {ILKELER.map((m, idx) => {
              const isSecili = aktifIlkeIndex === idx;
              return (
                <button
                  key={m.no}
                  onClick={() => setAktifIlkeIndex(idx)}
                  className={`py-2.5 px-2 transition-all flex flex-col items-center justify-center rounded-xl text-center border relative ${
                    isSecili
                      ? 'border-[#7B1E2B] bg-[#F1EAE0] text-[#1D1A17] shadow-inner font-bold'
                      : 'border-transparent hover:border-[#DFD5C6] bg-transparent text-[#7A7065]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-serif" style={{ color: isSecili ? m.renk : undefined }}>
                    {m.no}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider truncate max-w-full">
                    {m.kisaBaslik}
                  </span>
                  {isSecili && (
                    <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 text-[#7B1E2B] text-xs">
                      ▲
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Aktif İlke: Sol Tablo Paneli + Sağ Editoryal Açıklama */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Sol: Kemerli Niş Tablo */}
            <div className="md:col-span-4 h-44 sm:h-52 rounded-t-[50px] rounded-b-xl overflow-hidden border border-[#DFD5C6] relative shadow-md bg-[#171412] group">
              <img 
                src={aktifIlke.resim} 
                alt={aktifIlke.baslik} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#FAF7F2] bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
                  {aktifIlke.rozet}
                </span>
              </div>
            </div>

            {/* Sağ: Açıklama ve Hızlı Eylem */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4 px-1 sm:px-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#8C7A65] block mb-1">
                  Yayın Prensibi {aktifIlke.no}
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#1D1A17] tracking-wide mb-2">
                  {aktifIlke.baslik}
                </h3>
                <p className="text-xs sm:text-sm text-[#574F45] leading-relaxed italic">
                  {aktifIlke.aciklama}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E5DCD0]">
                <span className="text-[11px] font-sans text-[#8C7A65] italic">
                  ZEMİN Editoryal Nizamnamesi
                </span>
                <Link
                  href="/basvuru"
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold tracking-widest uppercase px-5 py-2 bg-[#1D1A17] text-[#FAF7F2] hover:bg-[#7B1E2B] transition-colors rounded-full shadow-xs"
                >
                  <span>Yazı Masası</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>

        </section>

        {/* 4. GALERİ SALONU: TEKRARSIZ KEMERLİ NİŞ KARTLARI */}
        <section>
          
          <div className="flex items-center justify-between mb-8 border-b border-[#DFD5C6] pb-3">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8C7A65] block font-bold">
                Editoryal Koleksiyon
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1D1A17]">Son Yayımlanan Metinler</h3>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#7B1E2B] hover:underline">
              Tüm Külliyat →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-[#DFD5C6] rounded-t-[50px] rounded-b-2xl h-84 animate-pulse bg-[#FAF7F2]" />
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border border-[#DFD5C6] bg-[#FAF7F2] rounded-t-[40px] rounded-b-xl p-12 text-center shadow-xs">
              <p className="text-sm italic text-[#574F45] mb-4">Henüz yayımlanmış bir düşünce metni bulunmuyor.</p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#7B1E2B] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold rounded-full"
              >
                İlk Metni Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {yazilar.map((y, idx) => {
                const dinamikSanat = getDinamikSanat(y.kategori, y.id, idx);
                const kapakGorseli = y.kapak_url || dinamikSanat.resim;
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    
                    {/* Kemerli Niş Kartı */}
                    <article className="border border-[#DFD5C6] bg-[#FAF7F2] rounded-t-[50px] rounded-b-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#BDB09E] transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                      
                      {/* Üst Kemerli Tablo Alanı */}
                      <div className="h-48 w-full relative overflow-hidden bg-[#171412]">
                        <img 
                          src={kapakGorseli} 
                          alt={y.baslik} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-black/30 pointer-events-none" />
                        
                        {/* Kategori ve Sayı Rozetleri */}
                        <div className="absolute top-4 left-5 flex items-center gap-2">
                          <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-xs border ${dinamikSanat.badgeBg} bg-[#FAF7F2]/90`}>
                            {y.kategori}
                          </span>
                          {y.dergiler && (
                            <span className="text-[9px] font-sans tracking-widest uppercase text-white bg-[#7B1E2B] px-2.5 py-1 rounded-full font-bold shadow-2xs">
                              Sayı #{y.dergiler.sayi_no}
                            </span>
                          )}
                        </div>

                        <span className="absolute top-4 right-5 text-[10px] font-sans text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          {okumaSuresi} dk okuma
                        </span>
                      </div>

                      {/* Editoryal Metin Gövdesi */}
                      <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-normal text-xl sm:text-2xl text-[#1D1A17] group-hover:text-[#7B1E2B] transition-colors line-clamp-2 mb-3 leading-snug">
                            {y.baslik}
                          </h4>
                          <p className="text-xs text-[#574F45] line-clamp-3 leading-relaxed font-serif italic mb-6">
                            {y.icerik}
                          </p>
                        </div>

                        {/* Alt Yazar İmzası */}
                        <div className="pt-4 border-t border-[#E5DCD0] flex items-center justify-between text-xs">
                          <span className="font-sans text-[11px] uppercase tracking-wider text-[#1D1A17] font-bold truncate max-w-[180px]">
                            {y.yazarlar?.ad_soyad}
                          </span>
                          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7B1E2B] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Metni Oku <span>→</span>
                          </span>
                        </div>
                      </div>

                    </article>
                  </Link>
                );
              })}
            </div>
          )}

        </section>

      </main>

      {/* 5. ARŞİV MAHZENİ & KÜTÜPHANE FOOTER */}
      <footer className="mt-auto w-full bg-[#171412] text-[#E5DCD0] pt-12 pb-10 border-t border-[#2A2622]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Basılı Dergi Edisyonları */}
          {dergiler.length > 0 && (
            <div className="mb-12 pb-10 border-b border-[#2A2622]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A89885] block font-bold">
                    Kütüphane Mahzeni
                  </span>
                  <h4 className="text-xl font-normal text-[#FAF7F2]">ZEMİN Dergi Sayıları</h4>
                </div>
                <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#D8CDBC] hover:text-[#FAF7F2]">
                  Tüm Ciltler →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dergiler.map((d) => (
                  <div 
                    key={d.id} 
                    className="bg-[#1F1C19] border border-[#2E2A25] rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#7B1E2B] bg-[#7B1E2B]/15 px-2.5 py-0.5 rounded-full">
                        Sayı #{d.sayi_no}
                      </span>
                      <h5 className="font-normal text-base text-[#FAF7F2] mt-1">{d.baslik}</h5>
                      <p className="text-[11px] text-[#A89885] italic line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                    </div>
                    <a 
                      href={d.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-[#FAF7F2] text-[#171412] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#7B1E2B] hover:text-white transition-colors rounded-full whitespace-nowrap"
                    >
                      PDF İncele
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kolofon ve Linkler */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
            <div className="text-center md:text-left">
              <span className="font-serif text-xl tracking-[0.25em] text-[#FAF7F2] block font-bold">ZEMİN</span>
              <p className="text-[10px] text-[#8C7A65] uppercase tracking-widest mt-1">
                © MMXXVI • Bağımsız Felsefe, Sosyoloji ve Psikoloji Dergisi
              </p>
            </div>

            <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold text-[#A89885]">
              <Link href="/iletisim" className="hover:text-[#FAF7F2] transition-colors">İletişim</Link>
              <Link href="/basvuru" className="hover:text-[#FAF7F2] transition-colors">Yayın İlkeleri</Link>
              <Link href="/admin" className="text-[#7B1E2B] hover:underline">Editör Paneli</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

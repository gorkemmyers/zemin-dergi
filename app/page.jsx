'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Küratörlü Sanat Galerisi Görselleri
const GALERI = {
  heroFresco: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85", // Göksel Tavan Freski
  felsefe: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80", // Heykel & Düşünce
  sosyoloji: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80", // Topluluk & Meclis Sahnesi
  psikoloji: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80", // Chiaroscuro Portre
  dergi: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
};

// 4 Sütunlu Kolonad (Portiko) Maddeleri
const ILKELER = [
  {
    no: 'I',
    baslik: 'Açık Kürsü',
    altBaslik: 'Bağımsız Düşünce',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan herkese açıktır. Akademik unvan şartı aranmaz; düşünsel tutarlılık ve derinlik esastır.',
    pigment: '#1B4F72', // Lapis Lazuli
    rozet: 'AÇIK ARŞİV'
  },
  {
    no: 'II',
    baslik: 'İfade Özgürlüğü',
    altBaslik: 'Ad veya Mahlas',
    aciklama: 'Metinlerinizi kendi adınızla veya bağımsız bir mahlasla yazabilirsiniz. Her tercih yayın masasında eşit editoryal saygıyla karşılanır.',
    pigment: '#7B241C', // Venedik Kırmızısı
    rozet: 'ÖZGÜR MAHLAS'
  },
  {
    no: 'III',
    baslik: 'Yazar Masası',
    altBaslik: '4 Haneli PIN Kodu',
    aciklama: 'İlk metninizle oluşturduğunuz PIN kodu profilinizle eşleşir. E-posta şifreleriyle uğraşmadan yazılarınızı ve okur etkileşimlerini yönetebilirsiniz.',
    pigment: '#4A235A', // Kraliyet Moru
    rozet: 'HIZLI ERİŞİM'
  },
  {
    no: 'IV',
    baslik: 'Dergi Seçkisi',
    altBaslik: 'Dönemsel Yayın',
    aciklama: 'Onaylanan tüm metinler web arşivinde kalıcı olarak yer alır. Öne çıkan makale ve denemeler ise ZEMİN Dergisi basılı edisyonuna dahil edilir.',
    pigment: '#196F3D', // Zümrüt Yeşili
    rozet: 'RESMİ SEÇKİ'
  }
];

const getKategoriStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        gorsel: GALERI.felsefe,
        renk: '#7B241C',
        badge: 'bg-[#7B241C]/10 text-[#7B241C] border-[#7B241C]/20'
      };
    case 'Sosyoloji':
      return {
        gorsel: GALERI.sosyoloji,
        renk: '#1B4F72',
        badge: 'bg-[#1B4F72]/10 text-[#1B4F72] border-[#1B4F72]/20'
      };
    case 'Psikoloji':
      return {
        gorsel: GALERI.psikoloji,
        renk: '#4A235A',
        badge: 'bg-[#4A235A]/10 text-[#4A235A] border-[#4A235A]/20'
      };
    default:
      return {
        gorsel: GALERI.heroFresco,
        renk: '#9A7D46',
        badge: 'bg-[#9A7D46]/10 text-[#9A7D46] border-[#9A7D46]/20'
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
    const { data } = await supabase.from('yazilar').select('slug').eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F3EC] text-[#1A1816] font-serif selection:bg-[#7B241C]/15 selection:text-[#7B241C]">
      
      {/* 1. PORTAL & MASTHEAD */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="bg-[#FAF7F0] border border-[#E4DCD0] rounded-t-[30px] rounded-b-xl p-4 sm:p-6 shadow-xs">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E4DCD0] pb-4">
            
            {/* Sol Aks: Konsept & Rastgele */}
            <div className="flex items-center gap-3 order-2 md:order-1">
              <span className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-[#8C7E6D]">
                Felsefe • Sosyoloji • Psikoloji
              </span>
              <span className="text-[#D3C7B6] hidden sm:inline">•</span>
              <button 
                onClick={handleRastgele}
                className="px-3 py-1 bg-[#EFE9DC] border border-[#D9CFC0] text-[10px] font-sans tracking-widest uppercase hover:bg-[#1A1816] hover:text-[#FAF7F0] transition-colors rounded-full font-semibold"
              >
                Rastgele Metin
              </button>
            </div>

            {/* Merkez: Roma Lapidary Tipografi Başlık */}
            <div className="text-center order-1 md:order-2">
              <Link href="/" className="inline-block group">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.32em] text-[#1A1816] uppercase font-serif">
                  ZEMİN
                </h1>
              </Link>
            </div>

            {/* Sağ Aks: Metin Gönder */}
            <div className="order-3">
              <Link 
                href="/basvuru" 
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#7B241C] text-white text-[11px] font-sans font-bold uppercase tracking-widest hover:bg-[#5E1B15] transition-colors rounded-full shadow-xs"
              >
                <span>✦ Metin Gönder</span>
              </Link>
            </div>

          </div>

          {/* Navigasyon Revakı */}
          <nav className="flex justify-center items-center gap-6 sm:gap-12 text-[11px] uppercase font-sans tracking-[0.22em] font-bold text-[#5C5449] pt-3">
            <Link href="/" className="text-[#7B241C] border-b border-[#7B241C] pb-0.5">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#7B241C] transition-colors">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#7B241C] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#7B241C] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#7B241C] transition-colors">İletişim</Link>
          </nav>

        </div>
      </header>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-16 space-y-16">

        {/* 2. HERO: GRAND FRESCO (KUBBE VE BAŞYAPIT) */}
        <section className="relative bg-[#141210] text-[#FAF7F0] rounded-t-[70px] sm:rounded-t-[120px] rounded-b-2xl overflow-hidden border border-[#E4DCD0]/60 shadow-xl">
          
          {/* Tavan Freski Görseli */}
          <img 
            src={GALERI.heroFresco} 
            alt="Ceiling Fresco" 
            className="absolute inset-0 w-full h-full object-cover opacity-45 object-center mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-1000"
          />

          {/* Chiaroscuro Işık ve Gölge Geçişi */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/60 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-16 sm:py-24">
            <span className="inline-block border border-[#E5DFD5]/30 bg-[#141210]/70 backdrop-blur-xs px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#E5DFD5] rounded-full mb-4">
              Bağımsız Düşünce Platformu
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight text-[#FAF7F0] mb-6">
              Düşüncenin Zirvesi, <br />
              <span className="italic font-light text-[#E4D3BA]">Özgür ve Eleştirel Zemin.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#D5CDBC] leading-relaxed max-w-xl mx-auto italic mb-10 font-serif">
              Akademik sınırların ötesinde; felsefi sorgulama, sosyolojik analiz ve psikolojik derinlik üzerine düşünen herkes için açık yayın alanı.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs">
              <Link 
                href="/basvuru" 
                className="px-8 py-3 bg-[#7B241C] text-white tracking-[0.2em] uppercase font-bold hover:bg-[#5E1B15] transition-colors rounded-full shadow-md"
              >
                Yazı Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-8 py-3 bg-[#FAF7F0]/90 text-[#141210] tracking-[0.2em] uppercase font-bold hover:bg-[#FAF7F0] transition-colors rounded-full shadow-xs"
              >
                Arşivi İncele
              </Link>
            </div>
          </div>
        </section>

        {/* 3. PORTİKO: 4 SÜTUNLU İLKELER KOLONADI */}
        <section>
          <div className="text-center mb-8">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#8C7E6D] block mb-1">
              Yayın Nizamı
            </span>
            <h3 className="text-2xl font-normal text-[#1A1816]">ZEMİN Manifestosu</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ILKELER.map((m) => (
              <div 
                key={m.no}
                className="bg-[#FAF7F0] border border-[#E4DCD0] rounded-t-[40px] rounded-b-xl p-6 flex flex-col justify-between shadow-xs hover:border-[#8C7E6D] transition-all group"
              >
                <div>
                  {/* Sütun Başlığı & Roma Rakamı */}
                  <div className="flex items-center justify-between border-b border-[#E4DCD0] pb-3 mb-4">
                    <span 
                      className="text-xl font-serif font-bold italic"
                      style={{ color: m.pigment }}
                    >
                      {m.no}
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#EFE9DC] text-[#5C5449]">
                      {m.rozet}
                    </span>
                  </div>

                  <h4 className="text-lg font-normal text-[#1A1816] mb-1 group-hover:text-[#7B241C] transition-colors">
                    {m.baslik}
                  </h4>
                  <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#8C7E6D] mb-3">
                    {m.altBaslik}
                  </p>
                  <p className="text-xs text-[#5C5449] leading-relaxed italic">
                    {m.aciklama}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E4DCD0]/60 flex items-center justify-end">
                  <span className="text-xs text-[#8C7E6D] group-hover:text-[#7B241C] transition-colors">✦</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. GALERİ SALONU: KEMERLİ NİŞ KARTLARI (YAZILAR) */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-[#E4DCD0] pb-3">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8C7E6D] block font-bold">
                Editoryal Koleksiyon
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1A1816]">Son Yayımlanan Metinler</h3>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#7B241C] hover:underline">
              Tüm Arşiv →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-[#E4DCD0] rounded-t-[50px] rounded-b-2xl h-80 animate-pulse bg-[#FAF7F0]" />
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border border-[#E4DCD0] bg-[#FAF7F0] rounded-t-[40px] rounded-b-xl p-12 text-center shadow-xs">
              <p className="text-sm italic text-[#5C5449] mb-4">Henüz yayımlanmış bir düşünce metni bulunmuyor.</p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#7B241C] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold rounded-full"
              >
                İlk Metni Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {yazilar.map((y) => {
                const stil = getKategoriStili(y.kategori);
                const kapakGorseli = y.kapak_url || stil.gorsel;
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    
                    {/* Kemerli Niş Kart Mimarisi */}
                    <article className="border border-[#E4DCD0] bg-[#FAF7F0] rounded-t-[50px] rounded-b-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#BDB09E] transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                      
                      {/* Üst Kemerli Tablo Alanı */}
                      <div className="h-48 w-full relative overflow-hidden bg-[#141210]">
                        <img 
                          src={kapakGorseli} 
                          alt={y.baslik} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-transparent to-black/30 pointer-events-none" />
                        
                        {/* Kategori ve Sayı Rozeti */}
                        <div className="absolute top-4 left-5 flex items-center gap-2">
                          <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-xs border ${stil.badge}`}>
                            {y.kategori}
                          </span>
                          {y.dergiler && (
                            <span className="text-[9px] font-sans tracking-widest uppercase text-white bg-[#7B241C] px-2.5 py-1 rounded-full font-bold shadow-2xs">
                              Sayı #{y.dergiler.sayi_no}
                            </span>
                          )}
                        </div>

                        <span className="absolute top-4 right-5 text-[10px] font-sans text-white/90 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          {okumaSuresi} dk okuma
                        </span>
                      </div>

                      {/* Editoryal Gövde */}
                      <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-normal text-xl sm:text-2xl text-[#1A1816] group-hover:text-[#7B241C] transition-colors line-clamp-2 mb-3 leading-snug">
                            {y.baslik}
                          </h4>
                          <p className="text-xs text-[#5C5449] line-clamp-3 leading-relaxed font-serif italic mb-6">
                            {y.icerik}
                          </p>
                        </div>

                        {/* Alt Yazar İmzası */}
                        <div className="pt-4 border-t border-[#E4DCD0] flex items-center justify-between text-xs">
                          <span className="font-sans text-[11px] uppercase tracking-wider text-[#1A1816] font-bold truncate max-w-[180px]">
                            {y.yazarlar?.ad_soyad}
                          </span>
                          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7B241C] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Metni İncele <span>→</span>
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

      {/* 5. ARŞİV MAHZENİ & KÜTÜPHANE (LOŞ KAPANIŞ / FOOTER) */}
      <footer className="mt-auto w-full bg-[#161412] text-[#E5DFD5] pt-12 pb-10 border-t border-[#2A2622]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Basılı Dergi Edisyonları (Mahzen Kartları) */}
          {dergiler.length > 0 && (
            <div className="mb-12 pb-10 border-b border-[#2A2622]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#A89885] block font-bold">
                    Kütüphane Mahzeni
                  </span>
                  <h4 className="text-xl font-normal text-[#FAF7F0]">ZEMİN Dergi Edisyonları</h4>
                </div>
                <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#D5CDBC] hover:text-[#FAF7F0]">
                  Tüm Sayılar →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dergiler.map((d) => (
                  <div 
                    key={d.id} 
                    className="bg-[#1E1B18] border border-[#2E2A25] rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#7B241C] bg-[#7B241C]/15 px-2 py-0.5 rounded-full">
                        Sayı #{d.sayi_no}
                      </span>
                      <h5 className="font-normal text-base text-[#FAF7F0] mt-1">{d.baslik}</h5>
                      <p className="text-[11px] text-[#A89885] italic line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                    </div>
                    <a 
                      href={d.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 bg-[#FAF7F0] text-[#161412] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#7B241C] hover:text-white transition-colors rounded-full whitespace-nowrap"
                    >
                      PDF İndir
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kolofon ve Linkler */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
            <div className="text-center md:text-left">
              <span className="font-serif text-xl tracking-[0.25em] text-[#FAF7F0] block font-bold">ZEMİN</span>
              <p className="text-[10px] text-[#8C7E6D] uppercase tracking-widest mt-1">
                © MMXXVI • Bağımsız Felsefe, Sosyoloji ve Psikoloji Dergisi
              </p>
            </div>

            <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold text-[#A89885]">
              <Link href="/iletisim" className="hover:text-[#FAF7F0] transition-colors">İletişim</Link>
              <Link href="/basvuru" className="hover:text-[#FAF7F0] transition-colors">Yayın İlkeleri</Link>
              <Link href="/admin" className="text-[#7B241C] hover:underline">Editör Masası</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

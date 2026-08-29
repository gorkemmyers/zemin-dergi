'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// Küratörlü Klasik Sanat & Rokoko Tablo Koleksiyonu
const SANAT_GALERISI = {
  heroTavan: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85", // Barok Göksel Tavan Freski
  felsefe: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80", // Rönesans / Antik Heykel & Tablo
  sosyoloji: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80", // Klasik Topluluk & Meclis Sahnesi
  psikoloji: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80", // Chiaroscuro Işık-Gölge Portre
  dergiKapak: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
};

const MADDELER = [
  {
    no: '01',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan herkese açıktır. Akademik unvan şartı aranmaz; düşünsel derinlik ve özgünlük esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#1E3A5F',
    resim: SANAT_GALERISI.felsefe
  },
  {
    no: '02',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'Yazar Adı veya Mahlas',
    aciklama: 'Metinlerinizi gerçek adınızla veya bağımsız bir mahlasla yazabilirsiniz. Tüm metinler editoryal olarak eşit titizlikle değerlendirilir.',
    rozet: 'ÖZGÜR YAZAR',
    renk: '#7A2232',
    resim: SANAT_GALERISI.sosyoloji
  },
  {
    no: '03',
    kisaBaslik: 'Yazar Paneli',
    baslik: 'PIN ile Pratik Yönetim',
    aciklama: 'İlk metninizle oluşturduğunuz 4 haneli PIN kodu isminizle eşleşir. E-posta şifreleriyle uğraşmadan yazılarınızı yönetebilirsiniz.',
    rozet: 'HIZLI ERİŞİM',
    renk: '#432344',
    resim: SANAT_GALERISI.psikoloji
  },
  {
    no: '04',
    kisaBaslik: 'Basılı Seçki',
    baslik: 'Dönemsel ZEMİN Dergisi',
    aciklama: 'Onaylanan tüm metinler web arşivinde yer alır. Öne çıkan denemeler ise dönemsel ZEMİN Dergisi edisyonuna dahil edilir.',
    rozet: 'EDİTÖRYAL SEÇKİ',
    renk: '#1D4E43',
    resim: SANAT_GALERISI.dergiKapak
  }
];

const getKategoriGorseli = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        resim: SANAT_GALERISI.felsefe,
        rozetBg: 'bg-[#7A2232]/10 text-[#7A2232] border-[#7A2232]/25',
        renkVurgu: '#7A2232'
      };
    case 'Sosyoloji':
      return {
        resim: SANAT_GALERISI.sosyoloji,
        rozetBg: 'bg-[#1E3A5F]/10 text-[#1E3A5F] border-[#1E3A5F]/25',
        renkVurgu: '#1E3A5F'
      };
    case 'Psikoloji':
      return {
        resim: SANAT_GALERISI.psikoloji,
        rozetBg: 'bg-[#432344]/10 text-[#432344] border-[#432344]/25',
        renkVurgu: '#432344'
      };
    default:
      return {
        resim: SANAT_GALERISI.heroTavan,
        rozetBg: 'bg-[#A08250]/10 text-[#A08250] border-[#A08250]/25',
        renkVurgu: '#A08250'
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
    <div className="flex flex-col min-h-screen bg-[#F7F4EE] text-[#1E1B18] font-serif selection:bg-[#C8A97E]/30 selection:text-[#7A2232] relative">
      
      {/* Yağlı Boya Tuval Dokusu */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: `radial-gradient(#1E1B18 1px, transparent 1px)`, backgroundSize: '16px 16px' }} 
      />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-24 relative z-10">

        {/* MASTHEAD & EDİTÖRYAL BAŞLIK */}
        <header className="mb-8 border-b border-[#D6CBB8] pb-5">
          <div className="bg-[#FAF8F3] border border-[#E2D9CA] shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Sol: Tarih & Rastgele */}
            <div className="flex items-center gap-3 order-2 md:order-1">
              <span className="text-[11px] tracking-[0.25em] font-sans font-bold uppercase text-[#8C7A65]">
                ROMA • FLORENSA • ATİNA
              </span>
              <button 
                onClick={handleRastgele}
                className="px-3 py-1 bg-[#EFE9DD] border border-[#D6CBB8] text-[10px] font-sans tracking-widest uppercase text-[#1E1B18] hover:bg-[#1E1B18] hover:text-[#FAF8F3] transition-all font-semibold"
              >
                Rastgele Metin
              </button>
            </div>

            {/* ZEMİN Lapidary Tipografi */}
            <div className="text-center order-1 md:order-2">
              <Link href="/" className="group block">
                <h1 className="text-4xl sm:text-6xl font-normal tracking-[0.3em] text-[#1E1B18] uppercase">
                  ZEMİN
                </h1>
                <p className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.35em] text-[#8C7A65] uppercase mt-0.5">
                  Felsefe • Sosyoloji • Psikoloji
                </p>
              </Link>
            </div>

            {/* Sağ: Metin Gönder */}
            <div className="order-3">
              <Link 
                href="/basvuru" 
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#7A2232] text-white text-[11px] font-sans font-bold uppercase tracking-widest hover:bg-[#5C1824] shadow-sm transition-all"
              >
                <span>✦ Metin Gönder</span>
              </Link>
            </div>
          </div>

          {/* Navigasyon Çubuğu */}
          <nav className="flex justify-center items-center gap-6 sm:gap-10 text-[11px] uppercase font-sans tracking-[0.2em] font-bold text-[#574F45] mt-3">
            <Link href="/" className="text-[#7A2232] border-b border-[#7A2232]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#7A2232] transition-colors">Tüm Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#7A2232] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#7A2232] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#7A2232] transition-colors">İletişim</Link>
          </nav>
        </header>

        {/* HERO: ROKOKO TAVAN FRESKİ & SANAT PANOSU */}
        <section className="mb-14 relative bg-[#1E1B18] text-[#F7F4EE] rounded-t-[50px] sm:rounded-t-[80px] overflow-hidden shadow-2xl border border-[#D6CBB8]/50">
          
          {/* Arka Plan: Fresk Tavan Resmi */}
          <img 
            src={SANAT_GALERISI.heroTavan} 
            alt="Rococo Ceiling Fresco" 
            className="absolute inset-0 w-full h-full object-cover opacity-35 object-center mix-blend-luminosity hover:opacity-40 transition-opacity duration-700"
          />

          {/* Chiaroscuro Işık ve Gölge Gradyanı */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/70 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-14 sm:py-20">
            <span className="inline-block border border-[#C8A97E]/60 bg-[#1E1B18]/80 backdrop-blur-xs px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#E4CA9E] mb-4">
              Özgür Düşünce & Sanat Platformu
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#FAF8F3] leading-tight mb-5">
              Düşüncenin Zirvesi, <br />
              <span className="italic font-light text-[#E4CA9E]">Özgür ve Eleştirel Zemin.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#D6CBB8] leading-relaxed max-w-lg mx-auto italic mb-8">
              Akademik kalıpların ötesinde; felsefi sorgulama, toplumsal analiz ve insan psikolojisi üzerine bağımsız denemeler.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs">
              <Link 
                href="/basvuru" 
                className="px-8 py-3 bg-[#7A2232] text-white tracking-[0.2em] uppercase font-bold border border-[#C8A97E]/50 hover:bg-[#5C1824] shadow-lg transition-all"
              >
                Yazı Gönder
              </Link>
              <Link 
                href="/yazilar" 
                className="px-8 py-3 bg-[#FAF8F3]/90 text-[#1E1B18] tracking-[0.2em] uppercase font-bold border border-[#D6CBB8] hover:bg-[#FAF8F3] transition-all shadow-md"
              >
                Arşivi İncele
              </Link>
            </div>
          </div>
        </section>

        {/* 4'LÜ RESİMLİ SEKME KONSOLU */}
        <section className="mb-16">
          <div className="border border-[#D6CBB8] bg-[#FAF8F3] p-4 sm:p-6 shadow-sm">
            
            {/* Üst 4 Buton */}
            <div className="grid grid-cols-4 gap-2 border-b border-[#E2D9CA] pb-4 mb-6">
              {MADDELER.map((m, idx) => {
                const isSecili = aktifMaddeIndex === idx;
                return (
                  <button
                    key={m.no}
                    onClick={() => setAktifMaddeIndex(idx)}
                    className={`py-3 px-1 sm:px-3 transition-all flex flex-col items-center justify-center border text-center relative ${
                      isSecili
                        ? 'border-[#7A2232] bg-[#F1EAE0] text-[#1E1B18] shadow-inner font-bold'
                        : 'border-transparent hover:border-[#D6CBB8] bg-transparent text-[#736A5E]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-serif" style={{ color: isSecili ? m.renk : undefined }}>
                      {m.no}
                    </span>
                    <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider truncate max-w-full">
                      {m.kisaBaslik}
                    </span>
                    {isSecili && (
                      <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 text-[#7A2232] text-xs">
                        ▲
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aktif Madde & Resim Kartuşu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center px-2">
              
              {/* Sol: Tablo Minyatürü */}
              <div className="h-36 rounded-lg overflow-hidden border border-[#D6CBB8] shadow-sm relative group">
                <img 
                  src={aktif.resim} 
                  alt={aktif.baslik} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#FAF8F3]">
                    {aktif.rozet}
                  </span>
                </div>
              </div>

              {/* Orta: Açıklama */}
              <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h3 className="text-lg sm:text-xl font-normal text-[#1E1B18] tracking-wide">
                    {aktif.baslik}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#574F45] leading-relaxed italic">
                    {aktif.aciklama}
                  </p>
                </div>

                <Link
                  href="/basvuru"
                  className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase px-6 py-3 bg-[#1E1B18] text-[#FAF8F3] hover:bg-[#7A2232] transition-all whitespace-nowrap shadow-sm self-stretch sm:self-center justify-center"
                >
                  <span>Yazı Masası</span>
                  <span>→</span>
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* SON YAZILAR: KEMERLİ RESİM NİŞLERİ */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-[#D6CBB8] pb-3">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8C7A65] block font-bold">Editoryal Arşiv</span>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1E1B18]">Son Yayımlanan Metinler</h2>
            </div>
            <Link href="/yazilar" className="text-xs font-sans tracking-widest uppercase font-bold text-[#7A2232] hover:underline">
              Tüm Külliyat →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-[#D6CBB8] rounded-t-[40px] h-80 animate-pulse bg-[#FAF8F3]"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="border border-[#D6CBB8] bg-[#FAF8F3] p-12 text-center shadow-xs">
              <p className="text-sm italic text-[#574F45] mb-4">Henüz yayımlanmış bir düşünce metni bulunmuyor.</p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#7A2232] text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-bold"
              >
                İlk Metni Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {yazilar.map((y) => {
                const stil = getKategoriGorseli(y.kategori);
                const gorsel = y.kapak_url || stil.resim;
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group block outline-none">
                    
                    {/* Kemerli Niş Kart Mimarisi (Fresk & Tipografi) */}
                    <article className="border border-[#D6CBB8] bg-[#FAF8F3] rounded-t-[40px] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#8C7A65] transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                      
                      {/* Üst Kemerli Tablo Alanı */}
                      <div className="h-44 w-full relative overflow-hidden bg-[#1E1B18]">
                        <img 
                          src={gorsel} 
                          alt={y.baslik} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F3] via-transparent to-black/30 pointer-events-none" />
                        
                        <div className="absolute top-3 left-4 flex items-center gap-2">
                          <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 bg-[#FAF8F3]/90 backdrop-blur-xs border ${stil.rozetBg}`}>
                            {y.kategori}
                          </span>
                          {y.dergiler && (
                            <span className="text-[9px] font-sans tracking-widest uppercase text-white bg-[#7A2232] px-2 py-0.5 font-bold shadow-xs">
                              Sayı #{y.dergiler.sayi_no}
                            </span>
                          )}
                        </div>

                        <span className="absolute top-3 right-4 text-[10px] font-sans text-white/90 bg-black/50 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                          {okumaSuresi} dk okuma
                        </span>
                      </div>

                      {/* İçerik Gövdesi */}
                      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-normal text-xl text-[#1E1B18] group-hover:text-[#7A2232] transition-colors line-clamp-2 mb-2.5 leading-snug">
                            {y.baslik}
                          </h3>
                          <p className="text-xs text-[#574F45] line-clamp-3 leading-relaxed font-serif italic mb-6">
                            {y.icerik}
                          </p>
                        </div>

                        {/* Alt Yazar İmzası */}
                        <div className="pt-3 border-t border-[#E2D9CA] flex items-center justify-between text-xs">
                          <span className="font-sans text-[11px] uppercase tracking-wider text-[#1E1B18] font-bold truncate max-w-[170px]">
                            {y.yazarlar?.ad_soyad}
                          </span>
                          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#7A2232] group-hover:translate-x-1 transition-transform flex items-center gap-1">
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

        {/* DÖNEMSEL DERGİLER (RESİMLİ KAPAKLAR) */}
        {dergiler.length > 0 && (
          <section className="mb-12 border-t border-[#D6CBB8] pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8C7A65] block font-bold">Koleksiyon</span>
                <h2 className="text-2xl font-normal text-[#1E1B18]">ZEMİN Sayıları</h2>
              </div>
              <Link href="/dergiler" className="text-xs font-sans tracking-widest uppercase font-bold text-[#7A2232] hover:underline">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dergiler.map((d) => (
                <div 
                  key={d.id} 
                  className="border border-[#D6CBB8] bg-[#FAF8F3] p-5 shadow-sm flex items-center justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#7A2232] bg-[#7A2232]/10 border border-[#7A2232]/25 px-2 py-0.5">
                      Sayı #{d.sayi_no}
                    </span>
                    <h3 className="font-normal text-base text-[#1E1B18] mt-2">{d.baslik}</h3>
                    <p className="text-[11px] text-[#736A5E] font-serif italic line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-5 py-2.5 bg-[#1E1B18] text-[#FAF8F3] text-[10px] font-sans uppercase tracking-widest font-bold hover:bg-[#7A2232] transition-all whitespace-nowrap shadow-xs"
                  >
                    PDF İncele
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-[#D6CBB8] bg-[#EFE9DD] py-8 relative z-10 text-[#574F45]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans">
          <div className="text-center md:text-left">
            <span className="font-serif text-xl tracking-[0.25em] text-[#1E1B18] block font-bold">ZEMİN</span>
            <p className="text-[10px] text-[#8C7A65] uppercase tracking-widest mt-1">
              © MMXXVI • Bağımsız Felsefe, Sosyoloji ve Psikoloji Dergisi
            </p>
          </div>

          <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
            <Link href="/iletisim" className="hover:text-[#7A2232] transition-colors">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#7A2232] transition-colors">Yayın İlkeleri</Link>
            <Link href="/admin" className="text-[#7A2232] hover:underline">Editör Paneli</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

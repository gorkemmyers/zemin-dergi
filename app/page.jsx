'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const MADDELER = [
  {
    no: 'I',
    numara: '01',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce & Açık Arşiv',
    aciklama: 'Felsefe, sosyoloji ve psikoloji alanlarında sorgulayan, araştıran herkese açıktır. Akademik unvan veya zümre şartı aranmaz; yalnızca düşünsel derinlik, tutarlılık ve samimiyet esastır.',
    rozet: 'AÇIK KÜRSÜ',
    renk: '#74112f'
  },
  {
    no: 'II',
    numara: '02',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'İsim veya Mahlas Serbestisi',
    aciklama: 'Düşüncelerinizi ister kendi adınızla, ister bağımsız bir mahlasla kaleme alabilirsiniz. Her iki tercih de ZEMİN editör masasında eşit ciddiyet ve hürmetle değerlendirilir.',
    rozet: 'SERBEST İFADE',
    renk: '#32127a'
  },
  {
    no: 'III',
    numara: '03',
    kisaBaslik: 'Yazar Masası',
    baslik: '4 Haneli PIN ile Kimlik Masası',
    aciklama: 'İlk metninizle belirlediğiniz 4 haneli PIN kodu adınızla eşleşir. E-posta bürokrasisi olmadan profilinizi yönetebilir, yeni metin gönderebilir ve arşivinizi büyütebilirsiniz.',
    rozet: 'PIN SİSTEMİ',
    renk: '#00a693'
  },
  {
    no: 'IV',
    numara: '04',
    kisaBaslik: 'Dergi Seçkisi',
    baslik: 'Dönemsel ZEMİN Dergisi Neşriyatı',
    aciklama: 'Onaylanan tüm metinler web arşivinde kesintisiz yer alır. Editör masası tarafından öne çıkan düşünce metinleri ise dönemsel ZEMİN Dergisi resmi seçkisine (e-dergi) dahil edilir.',
    rozet: 'RESMİ SEÇKİ',
    renk: '#8C6D31'
  }
];

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Kavram Analizi':
    case 'Felsefe':
      return {
        badgeBorder: 'border-[#74112f]/40',
        badgeBg: 'bg-[#74112f]/8 text-[#74112f]',
        cardAccent: 'hover:border-[#74112f]/50'
      };
    case 'Çağ & Yaşam Eleştirisi':
    case 'Sosyoloji':
      return {
        badgeBorder: 'border-[#00a693]/40',
        badgeBg: 'bg-[#00a693]/8 text-[#00a693]',
        cardAccent: 'hover:border-[#00a693]/50'
      };
    case 'Kültür & Eser Çözümlemesi':
    case 'Psikoloji':
      return {
        badgeBorder: 'border-[#32127a]/40',
        badgeBg: 'bg-[#32127a]/8 text-[#32127a]',
        cardAccent: 'hover:border-[#32127a]/50'
      };
    case 'Serbest Sorgulama':
    default:
      return {
        badgeBorder: 'border-[#8C6D31]/40',
        badgeBg: 'bg-[#8C6D31]/8 text-[#8C6D31]',
        cardAccent: 'hover:border-[#8C6D31]/50'
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
    <div className="flex flex-col min-h-screen bg-[#F7F4EB] text-[#1C1917] font-serif selection:bg-[#8C6D31]/20 selection:text-[#1C1917]">
      
      {/* ÜST BİLGİ & KLASİK EDİTORYAL MASTHEAD */}
      <header className="w-full border-b border-[#D8CEBA] bg-[#FAF7EE] relative z-20">
        
        {/* En Üst İnce Latin / Tarih Şeridi */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-1.5 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#78716C] border-b border-[#E8DFC8]">
          <span>Acta Philosophica & Humaniora</span>
          <span>Eskişehir • Açık Neşriyat</span>
          <span className="hidden sm:inline">MMXXVI</span>
        </div>

        {/* Ana Roma Lapidar Başlık (Z E M İ N) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center relative">
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#8C6D31]/60"></span>
            <span className="text-[#8C6D31] text-xs">❖</span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-[#8C6D31]">
              Düşünce Dergisi
            </span>
            <span className="text-[#8C6D31] text-xs">❖</span>
            <span className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#8C6D31]/60"></span>
          </div>

          <Link href="/" className="inline-block group">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.2em] sm:tracking-[0.28em] text-[#1C1917] hover:text-[#74112f] transition-colors duration-300 font-serif">
              ZEMİN
            </h1>
          </Link>

          <p className="text-xs sm:text-sm text-[#57534E] italic mt-2 tracking-wide font-serif max-w-lg mx-auto">
            Felsefe, Sosyoloji ve Psikoloji Alanında Bağımsız Açık Kürsü
          </p>

          {/* Sağ ve Sol Hızlı Butonlar */}
          <div className="mt-4 sm:mt-0 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center gap-2">
            <button
              onClick={handleRastgele}
              className="px-3 py-1.5 border border-[#C5A059]/60 hover:border-[#8C6D31] bg-[#FCFAF5] text-[11px] font-sans font-semibold tracking-wider uppercase text-[#57534E] hover:text-[#1C1917] transition-all shadow-xs"
              title="Rastgele Bir Metin Keşfet"
            >
              Rastgele ✦
            </button>
            <Link
              href="/basvuru"
              className="px-4 py-1.5 bg-[#1C1917] hover:bg-[#74112f] text-[#FAF7EE] text-[11px] font-sans font-bold tracking-widest uppercase transition-all shadow-sm"
            >
              Metin Gönder
            </Link>
          </div>
        </div>

        {/* Klasik Çift Çizgili Menü Şeridi */}
        <nav className="border-t-2 border-b-2 border-double border-[#D8CEBA] bg-[#F5F0E4]">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-6 sm:gap-10 py-2.5 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#57534E] overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            <Link href="/" className="text-[#74112f] font-bold border-b border-[#74112f] pb-0.5">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#1C1917] transition-colors">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#1C1917] transition-colors">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#1C1917] transition-colors">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#1C1917] transition-colors">İletişim</Link>
          </div>
        </nav>
      </header>

      {/* ANA GÖVDE */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 relative z-10">
        
        {/* HERO: KLASİK BOISERIE / ANTİK NİŞ PANELİ */}
        <section className="p-6 sm:p-12 mb-12 bg-[#FCFAF5] border-2 border-[#D8CEBA] relative shadow-[0_4px_25px_rgba(0,0,0,0.03)] text-center">
          
          {/* Klasik Köşe Süsleri */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#8C6D31]"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#8C6D31]"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#8C6D31]"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#8C6D31]"></div>

          <div className="max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#8C6D31] bg-[#8C6D31]/10 px-3 py-1 border border-[#8C6D31]/30 inline-block mb-4">
              Açık Felsefe & Toplum Kürsüsü
            </span>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#1C1917] tracking-tight leading-tight mb-4 font-serif">
              Düşüncenin Zemini, <br />
              <span className="italic font-serif text-[#74112f]">
                Özgür İfade Alanı.
              </span>
            </h2>

            <div className="w-16 h-px bg-[#8C6D31] mx-auto my-4"></div>

            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6 font-serif max-w-lg mx-auto">
              Akademik unvan, kurum veya bürokrasi şartı aranmaksızın; felsefe, sosyoloji ve psikoloji merceğinden dünyayı anlamlandıran herkes için açık yayın mecrası.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/basvuru"
                className="px-6 py-2.5 bg-[#74112f] hover:bg-[#1C1917] text-[#FAF7EE] text-xs font-sans font-bold uppercase tracking-widest transition-all shadow-sm"
              >
                Metnini Masaya Gönder
              </Link>
              <Link
                href="/yazilar"
                className="px-6 py-2.5 bg-[#FAF7EE] hover:bg-[#F5F0E4] text-[#1C1917] border border-[#C5A059] text-xs font-sans font-bold uppercase tracking-widest transition-all"
              >
                Arşivi İncele →
              </Link>
            </div>
          </div>
        </section>

        {/* 4 TEMEL İLKE KONSOLU (ROMA NUMARALARI VE KLASİK ÇERÇEVELER) */}
        <section className="mb-14 bg-[#FCFAF5] border border-[#D8CEBA] p-4 sm:p-8 relative">
          
          <div className="text-center mb-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#8C6D31]">
              Yayın Manifestosu & İşleyiş
            </span>
            <h3 className="text-lg sm:text-xl font-normal text-[#1C1917] mt-1 font-serif">
              Dört Temel Esas
            </h3>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mt-2"></div>
          </div>

          {/* 4 Seçim Sekmesi (I, II, III, IV) */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 p-1.5 bg-[#F5F0E4] border border-[#E8DFC8] mb-6">
            {MADDELER.map((m, idx) => {
              const isSecili = aktifMaddeIndex === idx;
              return (
                <button
                  key={m.numara}
                  onClick={() => setAktifMaddeIndex(idx)}
                  className={`py-2 sm:py-3 px-1 sm:px-4 transition-all duration-200 text-center select-none border ${
                    isSecili
                      ? 'bg-[#FAF7EE] border-[#8C6D31] text-[#1C1917] shadow-xs'
                      : 'border-transparent text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7EE]/60'
                  }`}
                >
                  <span className={`block text-xs sm:text-sm font-serif font-bold ${isSecili ? 'text-[#8C6D31]' : 'text-[#78716C]'}`}>
                    {m.no}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans uppercase tracking-wider font-semibold truncate block mt-0.5">
                    {m.kisaBaslik}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Aktif Açıklama Kitabesi */}
          <div className="border border-[#E8DFC8] bg-[#FAF7EE] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 border border-[#8C6D31]/40 bg-[#8C6D31]/10 text-[#8C6D31]">
                  {aktif.rozet}
                </span>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#1C1917]">
                  {aktif.baslik}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed font-serif">
                {aktif.aciklama}
              </p>
            </div>

            <Link
              href="/basvuru"
              className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider px-4 py-2 bg-[#1C1917] hover:bg-[#74112f] text-[#FAF7EE] transition-all whitespace-nowrap self-end sm:self-center"
            >
              <span>Yazı Gönder</span>
              <span>→</span>
            </Link>
          </div>

        </section>

        {/* SON DÜŞÜNCE METİNLERİ (ANTİK KEMER / KLASİK EDİTORYAL KARTLAR) */}
        <section className="mb-14">
          
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D8CEBA]">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C6D31] block">
                Arşivden Seçkiler
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#1C1917]">
                Son Yayımlanan Metinler
              </h2>
            </div>
            <Link 
              href="/yazilar" 
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#74112f] hover:underline"
            >
              Tüm Kütüphane ({yazilar.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-[#FCFAF5] border border-[#D8CEBA] p-6 h-48 animate-pulse"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="bg-[#FCFAF5] border-2 border-dashed border-[#D8CEBA] p-10 text-center">
              <p className="text-sm font-serif italic text-[#57534E] mb-4">
                Kürsü henüz sessiz. İlk düşünce metnini kaleme alan siz olun.
              </p>
              <Link 
                href="/basvuru" 
                className="inline-block bg-[#74112f] text-[#FAF7EE] px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-widest"
              >
                İlk Metni Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {yazilar.map((y) => {
                const stil = getDisiplinStili(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group outline-none">
                    <article className={`bg-[#FCFAF5] border border-[#D8CEBA] ${stil.cardAccent} p-5 sm:p-6 h-52 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group-hover:-translate-y-0.5 group-hover:shadow-md`}>
                      
                      {/* Üst Kemer Detayı / İnce Çift Çizgi */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E8DFC8]">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 border ${stil.badgeBorder} ${stil.badgeBg}`}>
                              {y.kategori}
                            </span>
                            {y.dergiler && (
                              <span className="text-[9px] font-sans font-semibold text-[#74112f] bg-[#74112f]/8 border border-[#74112f]/20 px-2 py-0.5">
                                Sayı {y.dergiler.sayi_no}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-serif italic text-[#78716C]">
                            ~ {okumaSuresi} dk okuma
                          </span>
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-[#74112f] transition-colors line-clamp-1 mb-1.5">
                          {y.baslik}
                        </h3>

                        <p className="text-xs text-[#57534E] line-clamp-2 font-serif leading-relaxed italic">
                          "{y.icerik}"
                        </p>
                      </div>

                      {/* Alt Yazar & Okuma İmzası */}
                      <div className="relative z-10 pt-2.5 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-[#1C1917] truncate max-w-[170px]">
                          — {y.yazarlar?.ad_soyad || 'Anonim / Mahlas'}
                        </span>
                        <span className="font-sans font-bold uppercase text-[10px] tracking-wider text-[#74112f] group-hover:translate-x-1 transition-transform">
                          Metni Oku →
                        </span>
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
                className="inline-block px-8 py-3 bg-[#FAF7EE] hover:bg-[#F5F0E4] border border-[#8C6D31] text-xs font-sans font-bold uppercase tracking-widest text-[#1C1917] transition-all shadow-xs"
              >
                Tüm Düşünce Arşivini Görüntüle ❖
              </Link>
            </div>
          )}

        </section>

        {/* DÖNEMSEL NEŞRİYAT: ZEMİN DERGİSİ CİLTLERİ */}
        {dergiler.length > 0 && (
          <section className="mb-12 border-t-2 border-double border-[#D8CEBA] pt-8">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#8C6D31] block">
                  Resmi Seçki Arşivi
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#1C1917]">
                  ZEMİN Dergisi Sayıları
                </h2>
              </div>
              <Link href="/dergiler" className="text-xs font-sans font-semibold uppercase tracking-wider text-[#74112f] hover:underline">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dergiler.map((d) => (
                <div key={d.id} className="bg-[#FCFAF5] border border-[#D8CEBA] p-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 border border-[#74112f]/20 px-2 py-0.5">
                      Fasikül / Sayı {d.sayi_no}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1C1917] mt-1.5">{d.baslik}</h3>
                    <p className="text-xs font-serif italic text-[#78716C] mt-0.5 line-clamp-1">{d.aciklama || 'Tematik neşriyat sayısı.'}</p>
                  </div>
                  <a 
                    href={d.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-[#1C1917] hover:bg-[#74112f] text-[#FAF7EE] text-[11px] font-sans font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-xs"
                  >
                    PDF İndir
                  </a>
                </div>
              ))}
            </div>

          </section>
        )}

      </main>

      {/* KLASİK MATBAA / KOLOFON ALT BİLGİ (FOOTER) */}
      <footer className="mt-auto w-full border-t-2 border-double border-[#D8CEBA] bg-[#FAF7EE] py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#78716C]">
          <div className="text-center md:text-left">
            <span className="font-serif font-bold text-sm text-[#1C1917] tracking-widest mr-2 uppercase">ZEMİN</span>
            <span className="italic font-serif">© MMXXVI • Bağımsız Düşünce ve İfade Kürsüsü.</span>
          </div>
          <div className="flex gap-6 font-sans text-[11px] uppercase tracking-wider font-semibold">
            <Link href="/iletisim" className="hover:text-[#1C1917] transition-colors">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#1C1917] transition-colors">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#74112f] hover:underline">Editör Masası</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

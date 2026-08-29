'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const MADDELER = [
  {
    no: '01',
    kisaBaslik: 'Açık Kürsü',
    baslik: 'Bağımsız Düşünce Alanı',
    aciklama: 'Kavram analizi, yaşam eleştirisi, kültür ve eser çözümlemesi ya da serbest sorgulama alanlarında sorgulayan, araştıran ve metin üreten herkese açıktır. Akademik unvan veya okul şartı aranmaz; yalnızca düşünsel derinlik ve tutarlılık esastır.',
    rozet: 'AÇIK ARŞİV',
    renk: '#74112f'
  },
  {
    no: '02',
    kisaBaslik: 'İfade Özgürlüğü',
    baslik: 'İsim veya Mahlas Serbestisi',
    aciklama: 'Düşüncelerinizi ister gerçek adınızla, ister bağımsız bir mahlasla kaleme alabilirsiniz. Her iki tercih de ZEMİN editör masasında eşit editoryal saygı ve titizlikle değerlendirilir.',
    rozet: 'ÖZGÜR İFADE',
    renk: '#32127a'
  },
  {
    no: '03',
    kisaBaslik: 'Yazar Masası',
    baslik: 'Pratik & Şifresiz Yönetim',
    aciklama: 'İlk metninizle belirlediğiniz 4 haneli PIN kodu isminizle eşleşir. E-posta olmadan profilinizi düzenleyebilir, yeni metin gönderebilir ve okur etkileşimlerini takip edebilirsiniz.',
    rozet: 'PIN MASASI',
    renk: '#00a693'
  },
  {
    no: '04',
    kisaBaslik: 'Dergi Seçkisi',
    baslik: 'Dönemsel ZEMİN Dergisi Yayını',
    aciklama: 'Onaylanan tüm metinler web arşivinde kesintisiz yer alır. Editör masası tarafından öne çıkan düşünce metinleri ise dönemsel ZEMİN Dergisi resmi seçkisine dahil edilir.',
    rozet: 'RESMİ SEÇKİ',
    renk: '#C4501E'
  }
];

const DISIPLIN_RENK = {
  'Kavram Analizi': { text: '#74112f', bg: 'rgba(116,17,47,0.08)' },
  'Yaşam Eleştirisi': { text: '#32127a', bg: 'rgba(50,18,122,0.08)' },
  'Kültür ve Eser Çözümlemesi': { text: '#00a693', bg: 'rgba(0,166,147,0.08)' },
  'Serbest Sorgulama': { text: '#C4501E', bg: 'rgba(196,80,30,0.08)' }
};

const getDisiplinRenk = (kategori) => DISIPLIN_RENK[kategori] || { text: '#1a1a1a', bg: 'rgba(0,0,0,0.05)' };

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
  const oneCikan = yazilar[0];
  const digerYazilar = yazilar.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F2] relative selection:bg-[#74112f]/10 selection:text-[#74112f]">
      <style jsx global>{`
        @keyframes zeminFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .zemin-fade {
          opacity: 0;
          animation: zeminFadeUp 0.6s ease-out forwards;
        }
      `}</style>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">

        {/* NAVBAR */}
        <header className="mx-auto max-w-5xl mb-8 sticky top-0 z-50 bg-[#F7F6F2]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
          <div className="flex justify-between items-center px-1 py-3">
            <Link href="/" className="text-[#1a1a1a] font-black text-xl tracking-tight hover:opacity-80">
              ZEMİN
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleRastgele}
                className="px-3 py-1.5 rounded text-[11px] font-bold text-gray-600 hover:text-[#74112f] transition-colors"
                title="Rastgele Bir Metin Keşfet"
              >
                Rastgele
              </button>
              <Link
                href="/basvuru"
                className="bg-[#1a1a1a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded text-[11px] sm:text-xs font-bold tracking-wide hover:bg-[#74112f] transition-colors"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 pb-3 px-1 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-600 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="text-[#74112f] flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#1a1a1a] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#1a1a1a] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#1a1a1a] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#1a1a1a] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {/* HERO BÖLÜMÜ */}
        <section className="mb-10 pt-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-black text-[#1a1a1a] tracking-tight leading-[0.92] mb-5">
              DÜŞÜNCENİN<br />
              <span className="text-[#74112f]">ZEMİNİ.</span>
            </h1>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 max-w-md">
              Kavram analizi, yaşam eleştirisi, kültür ve eser çözümlemesi, serbest sorgulama — düşünen herkes için bağımsız açık yayın platformu.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/basvuru"
                className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded text-xs font-black hover:bg-[#74112f] transition-colors active:scale-95"
              >
                Metnini Gönder
              </Link>
              <Link
                href="/yazilar"
                className="text-[#1a1a1a] px-5 py-2.5 rounded text-xs font-bold border-1.5 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                style={{ borderWidth: '1.5px', borderStyle: 'solid' }}
              >
                Tüm Arşivi İncele
              </Link>
            </div>
          </div>
        </section>

        {/* 4'LÜ KONSOL */}
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-4">
            {MADDELER.map((m, idx) => {
              const isSecili = aktifMaddeIndex === idx;
              return (
                <button
                  key={m.no}
                  onClick={() => setAktifMaddeIndex(idx)}
                  className="py-2.5 px-1 sm:px-3 rounded flex flex-col items-center justify-center gap-1 text-center select-none transition-colors"
                  style={{
                    backgroundColor: isSecili ? m.renk : '#ECEAE3',
                    color: isSecili ? '#fff' : '#777'
                  }}
                >
                  <span className="text-[9px] sm:text-[10px] font-black leading-none">{m.no}</span>
                  <span className="text-[9.5px] sm:text-xs truncate leading-tight font-bold">{m.kisaBaslik}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#1a1a1a] pt-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded"
                  style={{ backgroundColor: `${aktif.renk}18`, color: aktif.renk }}
                >
                  {aktif.rozet}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#1a1a1a]">{aktif.baslik}</h3>
              </div>
              <p className="text-[11.5px] sm:text-xs text-gray-600 font-serif leading-relaxed">{aktif.aciklama}</p>
            </div>

            <Link
              href="/basvuru"
              className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded bg-[#1a1a1a] hover:bg-[#74112f] text-white transition-colors active:scale-95 whitespace-nowrap self-end sm:self-center"
            >
              <span>Yazı Masasına Git</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* SON METİNLER — 1 büyük öne çıkan + küçük kartlar */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-[#1a1a1a] tracking-tight">Son Metinler</h2>
            <Link href="/yazilar" className="text-xs font-bold text-[#32127a] hover:underline">
              Tüm Arşivi Görüntüle →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded h-44 animate-pulse bg-[#ECEAE3]"></div>
              ))}
            </div>
          ) : yazilar.length === 0 ? (
            <div className="p-8 rounded border border-[#1a1a1a] text-center">
              <p className="text-xs font-bold text-gray-600 mb-3">Henüz onaylanmış bir düşünce metni bulunmuyor.</p>
              <Link
                href="/basvuru"
                className="inline-block bg-[#74112f] text-white px-5 py-2 rounded text-xs font-bold hover:opacity-90"
              >
                İlk Metni Sen Gönder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {oneCikan && (() => {
                const renk = getDisiplinRenk(oneCikan.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((oneCikan.icerik || '').trim().split(/\s+/).length / 200));
                return (
                  <Link href={`/yazi/${oneCikan.slug}`} className="group sm:row-span-2 zemin-fade" style={{ animationDelay: '0.05s' }}>
                    <article className="h-full min-h-[220px] rounded-lg p-5 flex flex-col justify-end bg-[#1a1a1a] text-white group-hover:bg-[#74112f] transition-colors relative overflow-hidden">
                      {oneCikan.kapak_url && (
                        <img src={oneCikan.kapak_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                      )}
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/15">
                            {oneCikan.kategori}
                          </span>
                          <span className="text-[9px] font-bold text-white/70">{okumaSuresi} dk okuma</span>
                        </div>
                        <h3 className="font-bold text-lg leading-snug mb-2">{oneCikan.baslik}</h3>
                        <p className="text-[11px] text-white/70 line-clamp-2 font-serif mb-3">{oneCikan.icerik}</p>
                        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-white/15">
                          <span className="font-semibold truncate max-w-[150px]">{oneCikan.yazarlar?.ad_soyad}</span>
                          <span className="font-black">Oku →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })()}

              {digerYazilar.map((y, i) => {
                const renk = getDisiplinRenk(y.kategori);
                const okumaSuresi = Math.max(1, Math.ceil((y.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${y.slug}`} key={y.id} className="group zemin-fade" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                    <article className="h-full rounded-lg p-4 flex flex-col justify-between bg-[#ECEAE3] group-hover:bg-white group-hover:shadow-md transition-all relative overflow-hidden">
                      <div>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span
                            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                            style={{ backgroundColor: renk.bg, color: renk.text }}
                          >
                            {y.kategori}
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold whitespace-nowrap">{okumaSuresi} dk</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#74112f] transition-colors line-clamp-1 mb-1">
                          {y.baslik}
                        </h3>
                        <p className="text-[11px] text-gray-600 line-clamp-2 font-serif">{y.icerik}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-300/60 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 truncate max-w-[150px]">{y.yazarlar?.ad_soyad}</span>
                        <span className="font-black" style={{ color: renk.text }}>Oku →</span>
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
                className="inline-block px-6 py-3 rounded text-xs font-bold text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
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
              <h2 className="text-lg font-black text-[#1a1a1a] tracking-tight">ZEMİN Dergisi Sayıları</h2>
              <Link href="/dergiler" className="text-xs font-bold text-[#32127a] hover:underline">
                Tüm Sayılar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dergiler.map((d) => (
                <div key={d.id} className="p-5 rounded-lg border border-[#1a1a1a] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 px-2 py-0.5 rounded">
                      Sayı {d.sayi_no}
                    </span>
                    <h3 className="font-bold text-sm text-[#1a1a1a] mt-1">{d.baslik}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{d.aciklama || 'Tematik dergi sayısı.'}</p>
                  </div>
                  <a
                    href={d.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1a1a1a] hover:bg-[#74112f] text-white px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    İncele / İndir
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-[#1a1a1a] py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#1a1a1a] tracking-tight mr-2">ZEMİN Dergisi</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#74112f]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#74112f]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Masası</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

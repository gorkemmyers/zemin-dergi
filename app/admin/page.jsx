'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const ADMIN_PIN = '1923';

  const [yazilar, setYazilar] = useState([]);
  const [aktifSekme, setAktifSekme] = useState('beklemede');
  const [loading, setLoading] = useState(true);
  const [selectedYazi, setSelectedYazi] = useState(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('zemin_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchYazilar();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('zemin_admin_auth', 'true');
      setPinError(false);
      fetchYazilar();
    } else {
      setPinError(true);
    }
  };

  async function fetchYazilar() {
    setLoading(true);
    const { data, error } = await supabase
      .from('yazilar')
      .select(`
        id,
        baslik,
        slug,
        kategori,
        icerik,
        durum,
        olusturulma_tarihi,
        yazarlar (id, ad_soyad, universite, bolum, instagram, biyografi)
      `)
      .order('olusturulma_tarihi', { ascending: false });

    if (!error && data) {
      setYazilar(data);
      const filtrelenmis = data.filter((y) => y.durum === aktifSekme);
      setSelectedYazi(filtrelenmis.length > 0 ? filtrelenmis[0] : null);
    }
    setLoading(false);
  }

  const handleSekmeDegistir = (sekme) => {
    setAktifSekme(sekme);
    const filtrelenmis = sekme === 'tumu' 
      ? yazilar 
      : yazilar.filter((y) => y.durum === sekme);
    
    setSelectedYazi(filtrelenmis.length > 0 ? filtrelenmis[0] : null);
  };

  async function durumGuncelle(id, yeniDurum) {
    const { error } = await supabase
      .from('yazilar')
      .update({
        durum: yeniDurum,
        yayin_tarihi: yeniDurum === 'onaylandi' ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (!error) {
      const guncelListe = yazilar.map((y) =>
        y.id === id ? { ...y, durum: yeniDurum } : y
      );
      setYazilar(guncelListe);

      const kalanlar = aktifSekme === 'tumu'
        ? guncelListe
        : guncelListe.filter((y) => y.durum === aktifSekme);

      setSelectedYazi(kalanlar.length > 0 ? kalanlar[0] : null);
    } else {
      alert('İşlem başarısız: ' + error.message);
    }
  }

  async function yaziSil(id) {
    if (!confirm('Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?')) return;

    const { error } = await supabase.from('yazilar').delete().eq('id', id);
    if (!error) {
      const guncelListe = yazilar.filter((y) => y.id !== id);
      setYazilar(guncelListe);
      const kalanlar = aktifSekme === 'tumu'
        ? guncelListe
        : guncelListe.filter((y) => y.durum === aktifSekme);
      setSelectedYazi(kalanlar.length > 0 ? kalanlar[0] : null);
    } else {
      alert('Silme hatası: ' + error.message);
    }
  }

  const bekleyenSayisi = yazilar.filter((y) => y.durum === 'beklemede').length;
  const onaylananSayisi = yazilar.filter((y) => y.durum === 'onaylandi').length;
  const reddedilenSayisi = yazilar.filter((y) => y.durum === 'reddedildi').length;

  const gorunenYazilar = aktifSekme === 'tumu'
    ? yazilar
    : yazilar.filter((y) => y.durum === aktifSekme);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="border border-[#E3DDD3] bg-[#F7F5F0] p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold">Editoryal Masa</span>
          <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Editör Girişi</h2>
          <p className="text-xs text-[#1A1A1A]/60">Yönetici paneline erişmek için PIN kodunu girin.</p>
          <input
            type="password"
            maxLength={6}
            placeholder="PIN Kodu"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center tracking-widest text-lg font-bold border border-[#E3DDD3] bg-transparent p-3 outline-none focus:border-[#4E141E]"
          />
          {pinError && <p className="text-xs text-red-600 font-semibold">Hatalı PIN kodu girdiniz.</p>}
          <button type="submit" className="w-full bg-[#4E141E] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-opacity">
            Giriş Yap
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Üst Bar */}
      <header className="border-b border-[#E3DDD3] pb-4 mb-6 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold">Zemin Dergi</span>
          <h1 className="font-editorial text-2xl md:text-3xl font-bold text-[#1A1A1A]">Editoryal Masa</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchYazilar} className="text-xs uppercase tracking-widest border border-[#E3DDD3] px-3.5 py-1.5 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
            Yenile
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('zemin_admin_auth');
              setIsAuthenticated(false);
            }}
            className="text-xs uppercase tracking-widest border border-red-200 text-red-700 px-3.5 py-1.5 hover:bg-red-50"
          >
            Çıkış
          </button>
        </div>
      </header>

      {/* Sekmeler */}
      <div className="flex gap-2 border-b border-[#E3DDD3] pb-4 mb-6 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => handleSekmeDegistir('beklemede')}
          className={`px-3.5 py-2 flex items-center gap-2 transition-colors ${
            aktifSekme === 'beklemede'
              ? 'bg-[#4E141E] text-[#F7F5F0]'
              : 'border border-[#E3DDD3] text-[#1A1A1A]/70 hover:border-[#4E141E]'
          }`}
        >
          <span>Bekleyenler</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            aktifSekme === 'beklemede' ? 'bg-[#F7F5F0] text-[#4E141E]' : 'bg-[#E3DDD3] text-[#1A1A1A]'
          }`}>
            {bekleyenSayisi}
          </span>
        </button>

        <button
          onClick={() => handleSekmeDegistir('onaylandi')}
          className={`px-3.5 py-2 flex items-center gap-2 transition-colors ${
            aktifSekme === 'onaylandi'
              ? 'bg-[#5E7362] text-[#F7F5F0]'
              : 'border border-[#E3DDD3] text-[#1A1A1A]/70 hover:border-[#5E7362]'
          }`}
        >
          <span>Yayındakiler</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            aktifSekme === 'onaylandi' ? 'bg-[#F7F5F0] text-[#5E7362]' : 'bg-[#E3DDD3] text-[#1A1A1A]'
          }`}>
            {onaylananSayisi}
          </span>
        </button>

        <button
          onClick={() => handleSekmeDegistir('reddedildi')}
          className={`px-3.5 py-2 flex items-center gap-2 transition-colors ${
            aktifSekme === 'reddedildi'
              ? 'bg-red-800 text-white'
              : 'border border-[#E3DDD3] text-[#1A1A1A]/70 hover:border-red-800'
          }`}
        >
          <span>Reddedilenler</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            aktifSekme === 'reddedildi' ? 'bg-white text-red-800' : 'bg-[#E3DDD3] text-[#1A1A1A]'
          }`}>
            {reddedilenSayisi}
          </span>
        </button>

        <button
          onClick={() => handleSekmeDegistir('tumu')}
          className={`px-3.5 py-2 transition-colors ${
            aktifSekme === 'tumu'
              ? 'bg-[#1A1A1A] text-[#F7F5F0]'
              : 'border border-[#E3DDD3] text-[#1A1A1A]/70 hover:border-[#1A1A1A]'
          }`}
        >
          Tümü ({yazilar.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1A1A1A]/50">Yükleniyor...</div>
      ) : gorunenYazilar.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E3DDD3] bg-[#F7F5F0]">
          <p className="font-editorial text-lg text-[#1A1A1A]/70">Bu sekmede gösterilecek metin bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Kolon: Sade Satır Listesi */}
          <div className="lg:col-span-5 divide-y divide-[#E3DDD3] border border-[#E3DDD3] bg-[#F7F5F0] max-h-[75vh] overflow-y-auto">
            {gorunenYazilar.map((y) => (
              <button
                key={y.id}
                onClick={() => setSelectedYazi(y)}
                className={`w-full text-left p-4 flex flex-col gap-1 transition-all ${
                  selectedYazi?.id === y.id
                    ? 'bg-[#4E141E]/10 border-l-4 border-l-[#4E141E]'
                    : 'hover:bg-[#E3DDD3]/30 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold">
                  <span className="text-[#5E7362]">{y.kategori}</span>
                  <span className="text-[#1A1A1A]/40 font-normal">
                    {new Date(y.olusturulma_tarihi).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="font-editorial font-bold text-base text-[#1A1A1A] truncate">
                  {y.baslik}
                </p>
                <p className="text-xs text-[#1A1A1A]/70 truncate">
                  {y.yazarlar?.ad_soyad} <span className="text-[#1A1A1A]/40">• {y.yazarlar?.universite}</span>
                </p>
              </button>
            ))}
          </div>

          {/* Sağ Kolon: Okuma Masası */}
          <div className="lg:col-span-7 border border-[#E3DDD3] bg-[#F7F5F0] p-6 md:p-8 flex flex-col justify-between min-h-[75vh]">
            {selectedYazi ? (
              <div className="space-y-6">
                <div className="border-b border-[#E3DDD3] pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold">{selectedYazi.kategori}</span>
                      <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#1A1A1A] mt-1 leading-tight">
                        {selectedYazi.baslik}
                      </h2>
                    </div>
                    {selectedYazi.durum === 'onaylandi' && (
                      <Link
                        href={`/yazi/${selectedYazi.slug}`}
                        target="_blank"
                        className="text-xs uppercase tracking-widest font-semibold text-[#4E141E] border-b border-[#4E141E] pb-0.5 whitespace-nowrap"
                      >
                        Sitede Aç ↗
                      </Link>
                    )}
                  </div>

                  {/* Yazar Bilgisi */}
                  <div className="mt-4 p-3.5 bg-[#E3DDD3]/30 border border-[#E3DDD3] text-xs space-y-1">
                    <p><span className="font-semibold text-[#1A1A1A]">Yazar:</span> {selectedYazi.yazarlar?.ad_soyad} ({selectedYazi.yazarlar?.universite} — {selectedYazi.yazarlar?.bolum})</p>
                    {selectedYazi.yazarlar?.instagram && (
                      <p><span className="font-semibold text-[#1A1A1A]">Instagram:</span> @{selectedYazi.yazarlar?.instagram}</p>
                    )}
                    {selectedYazi.yazarlar?.biyografi && (
                      <p className="text-[#1A1A1A]/70 italic"><span className="font-semibold text-[#1A1A1A] not-italic">Biyo:</span> "{selectedYazi.yazarlar?.biyografi}"</p>
                    )}
                  </div>
                </div>

                {/* Metin İçeriği */}
                <div className="font-editorial text-[#1A1A1A] text-base leading-relaxed whitespace-pre-wrap max-h-[42vh] overflow-y-auto pr-3 border-b border-[#E3DDD3]/40 pb-6">
                  {selectedYazi.icerik}
                </div>

                {/* Aksiyon Butonları */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {selectedYazi.durum === 'beklemede' && (
                    <>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'onaylandi')}
                        className="flex-1 bg-[#4E141E] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-opacity"
                      >
                        ✓ Yayımla (Sitede Aç)
                      </button>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'reddedildi')}
                        className="border border-red-300 text-red-800 px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-red-50"
                      >
                        ✕ Reddet
                      </button>
                    </>
                  )}

                  {selectedYazi.durum === 'onaylandi' && (
                    <>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'beklemede')}
                        className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-[#F7F5F0]"
                      >
                        Yayından Kaldır (Beklemeye Al)
                      </button>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'reddedildi')}
                        className="border border-red-300 text-red-800 px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-red-50"
                      >
                        Reddet
                      </button>
                    </>
                  )}

                  {selectedYazi.durum === 'reddedildi' && (
                    <>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'onaylandi')}
                        className="flex-1 bg-[#5E7362] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-95"
                      >
                        ✓ Tekrar Yayına Al
                      </button>
                      <button
                        onClick={() => durumGuncelle(selectedYazi.id, 'beklemede')}
                        className="border border-[#1A1A1A]/30 text-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A]/5"
                      >
                        Bekleyenlere Geri Al
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => yaziSil(selectedYazi.id)}
                    className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 px-3 py-3 underline font-semibold"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-[#1A1A1A]/50">İncelemek için sol listeden bir başlığa tıklayın.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

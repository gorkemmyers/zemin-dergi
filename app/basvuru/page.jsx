'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

function slugify(text) {
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'İ': 'i', 'I': 'i' };
  return text
    .toString()
    .toLowerCase()
    .replace(/[çğışöüİI]/g, (m) => trMap[m] || m)
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function BasvuruPage() {
  const [aktifSekme, setAktifSekme] = useState('yazi'); // 'yazi' | 'panel'
  const [panelAltSekme, setPanelAltSekme] = useState('profil'); // 'profil' | 'yazilar'

  // --- YENİ METİN STATE'LERİ ---
  const [adSoyad, setAdSoyad] = useState('');
  const [pin, setPin] = useState('');
  const [universite, setUniversite] = useState('');
  const [bolum, setBolum] = useState('');
  const [biyografi, setBiyografi] = useState('');
  const [instagram, setInstagram] = useState('');
  const [kategori, setKategori] = useState('Felsefe');
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kapakUrl, setKapakUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // --- YAZAR PANELİ STATE'LERİ ---
  const [panelIsim, setPanelIsim] = useState('');
  const [panelPin, setPanelPin] = useState('');
  const [panelYazar, setPanelYazar] = useState(null);
  const [panelYazilar, setPanelYazilar] = useState([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelStatus, setPanelStatus] = useState({ type: '', msg: '' });

  // Profil Alanları
  const [editUniversite, setEditUniversite] = useState('');
  const [editBolum, setEditBolum] = useState('');
  const [editBiyografi, setEditBiyografi] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editYeniPin, setEditYeniPin] = useState('');

  // Yazı Düzenleme Alanları
  const [seciliDuzenlenenYazi, setSeciliDuzenlenenYazi] = useState(null);
  const [editYaziBaslik, setEditYaziBaslik] = useState('');
  const [editYaziKategori, setEditYaziKategori] = useState('Felsefe');
  const [editYaziIcerik, setEditYaziIcerik] = useState('');
  const [editYaziKapakUrl, setEditYaziKapakUrl] = useState('');
  const [duzeltmeNotu, setDuzeltmeNotu] = useState('');

  // 1. Yeni Yazı Gönderimi
  const handleYaziGonder = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (!adSoyad.trim() || !pin.trim() || !kategori || !baslik.trim() || !icerik.trim()) {
      setStatus({ type: 'error', msg: 'Lütfen zorunlu alanları doldurun.' });
      return;
    }

    if (pin.trim().length < 4) {
      setStatus({ type: 'error', msg: 'PIN kodu en az 4 haneli olmalıdır.' });
      return;
    }

    setLoading(true);

    try {
      const temizIsim = adSoyad.trim();
      const temizPin = pin.trim();

      const { data: mevcutYazarlar, error: yazarSorguHata } = await supabase
        .from('yazarlar')
        .select('*')
        .ilike('ad_soyad', temizIsim);

      if (yazarSorguHata) throw yazarSorguHata;

      let yazarId = null;

      if (mevcutYazarlar && mevcutYazarlar.length > 0) {
        const mevcutYazar = mevcutYazarlar[0];

        if (mevcutYazar.pin && String(mevcutYazar.pin) !== temizPin) {
          setStatus({
            type: 'error',
            msg: 'Bu isim/mahlas için girdiğiniz PIN hatalı.'
          });
          setLoading(false);
          return;
        }

        yazarId = mevcutYazar.id;

        const guncelleme = {};
        if (universite.trim()) guncelleme.universite = universite.trim();
        if (bolum.trim()) guncelleme.bolum = bolum.trim();
        if (biyografi.trim()) guncelleme.biyografi = biyografi.trim();
        if (instagram.trim()) guncelleme.instagram = instagram.trim().replace('@', '');

        if (Object.keys(guncelleme).length > 0) {
          await supabase.from('yazarlar').update(guncelleme).eq('id', yazarId);
        }
      } else {
        const yazarSlug = `${slugify(temizIsim)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const { data: yeniYazar, error: yazarOlusturHata } = await supabase
          .from('yazarlar')
          .insert([
            {
              ad_soyad: temizIsim,
              pin: temizPin,
              slug: yazarSlug,
              universite: universite.trim() || null,
              bolum: bolum.trim() || null,
              biyografi: biyografi.trim() || null,
              instagram: instagram.trim().replace('@', '') || null
            }
          ])
          .select()
          .single();

        if (yazarOlusturHata) throw yazarOlusturHata;
        yazarId = yeniYazar.id;
      }

      const yaziSlug = `${slugify(baslik)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error: yaziHata } = await supabase
        .from('yazilar')
        .insert([
          {
            baslik: baslik.trim(),
            slug: yaziSlug,
            kategori,
            icerik: icerik.trim(),
            kapak_url: kapakUrl.trim() || null,
            yazar_id: yazarId,
            durum: 'beklemede'
          }
        ]);

      if (yaziHata) throw yaziHata;

      setStatus({
        type: 'success',
        msg: 'Metniniz editör masasına iletildi. Onaylandıktan sonra yayına alınacaktır.'
      });

      setBaslik('');
      setIcerik('');
      setKapakUrl('');
    } catch (err) {
      setStatus({ type: 'error', msg: 'Hata: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // 2. Yazar Girişi
  const handleYazarGiris = async (e) => {
    e.preventDefault();
    setPanelStatus({ type: '', msg: '' });

    if (!panelIsim.trim() || !panelPin.trim()) {
      setPanelStatus({ type: 'error', msg: 'Lütfen İsim ve PIN girin.' });
      return;
    }

    setPanelLoading(true);

    try {
      const { data, error } = await supabase
        .from('yazarlar')
        .select('*')
        .ilike('ad_soyad', panelIsim.trim());

      if (error) throw error;

      if (!data || data.length === 0) {
        setPanelStatus({ type: 'error', msg: 'Bu isimle kayıtlı yazar bulunamadı.' });
        setPanelLoading(false);
        return;
      }

      const yazar = data[0];

      if (yazar.pin && String(yazar.pin) !== panelPin.trim()) {
        setPanelStatus({ type: 'error', msg: 'PIN kodu hatalı.' });
        setPanelLoading(false);
        return;
      }

      setPanelYazar(yazar);
      setEditUniversite(yazar.universite || '');
      setEditBolum(yazar.bolum || '');
      setEditBiyografi(yazar.biyografi || '');
      setEditInstagram(yazar.instagram || '');

      const { data: yazilarData } = await supabase
        .from('yazilar')
        .select('*')
        .eq('yazar_id', yazar.id)
        .order('id', { ascending: false });

      if (yazilarData) setPanelYazilar(yazilarData);
      setPanelStatus({ type: 'success', msg: 'Giriş yapıldı.' });
    } catch (err) {
      setPanelStatus({ type: 'error', msg: 'Hata: ' + err.message });
    } finally {
      setPanelLoading(false);
    }
  };

  // 3. Profil Güncelleme
  const handleProfilGuncelle = async (e) => {
    e.preventDefault();
    if (!panelYazar) return;

    setPanelLoading(true);
    setPanelStatus({ type: '', msg: '' });

    try {
      const guncellenecekler = {
        universite: editUniversite.trim() || null,
        bolum: editBolum.trim() || null,
        biyografi: editBiyografi.trim() || null,
        instagram: editInstagram.trim().replace('@', '') || null
      };

      if (editYeniPin.trim()) {
        if (editYeniPin.trim().length < 4) {
          setPanelStatus({ type: 'error', msg: 'Yeni PIN en az 4 haneli olmalıdır.' });
          setPanelLoading(false);
          return;
        }
        guncellenecekler.pin = editYeniPin.trim();
      }

      const { error } = await supabase.from('yazarlar').update(guncellenecekler).eq('id', panelYazar.id);
      if (error) throw error;

      setPanelStatus({ type: 'success', msg: 'Profil bilgileriniz güncellendi.' });
      if (editYeniPin.trim()) {
        setPanelPin(editYeniPin.trim());
        setEditYeniPin('');
      }
    } catch (err) {
      setPanelStatus({ type: 'error', msg: 'Hata: ' + err.message });
    } finally {
      setPanelLoading(false);
    }
  };

  // 4. Düzenlenecek Yazıyı Seçme
  const handleYaziSec = (yazi) => {
    setSeciliDuzenlenenYazi(yazi);
    setEditYaziBaslik(yazi.taslak_baslik || yazi.baslik || '');
    setEditYaziKategori(yazi.taslak_kategori || yazi.kategori || 'Felsefe');
    setEditYaziIcerik(yazi.taslak_icerik || yazi.icerik || '');
    setEditYaziKapakUrl(yazi.taslak_kapak_url || yazi.kapak_url || '');
    setDuzeltmeNotu(yazi.duzeltme_notu || '');
    setPanelStatus({ type: '', msg: '' });
  };

  // 5. Düzenleme Talebini Gönderme (CANLI YAYINI ASLA BOZMAZ)
  const handleYaziDuzenlemeGonder = async (e) => {
    e.preventDefault();
    if (!seciliDuzenlenenYazi) return;

    if (!editYaziBaslik.trim() || !editYaziIcerik.trim()) {
      setPanelStatus({ type: 'error', msg: 'Başlık ve metin boş olamaz.' });
      return;
    }

    if (!duzeltmeNotu.trim()) {
      setPanelStatus({ type: 'error', msg: 'Lütfen neyi değiştirdiğinizi belirten kısa bir açıklama yazın.' });
      return;
    }

    setPanelLoading(true);
    setPanelStatus({ type: '', msg: '' });

    try {
      // DİKKAT: 'durum' kolonuna kesinlikle DOKUNULMUYOR. Yayındaysa 'onaylandi' kalır.
      const guncelleme = {
        taslak_baslik: editYaziBaslik.trim(),
        taslak_kategori: editYaziKategori,
        taslak_icerik: editYaziIcerik.trim(),
        taslak_kapak_url: editYaziKapakUrl.trim() || null,
        duzeltme_notu: duzeltmeNotu.trim()
      };

      const { error } = await supabase
        .from('yazilar')
        .update(guncelleme)
        .eq('id', seciliDuzenlenenYazi.id);

      if (error) throw error;

      setPanelYazilar((prev) =>
        prev.map((y) =>
          y.id === seciliDuzenlenenYazi.id
            ? { ...y, ...guncelleme }
            : y
        )
      );

      setPanelStatus({
        type: 'success',
        msg: 'Düzenleme talebiniz iletildi. Mevcut metniniz sitede kesintisiz yayında kalmaya devam ediyor; editör onayladığı anda yenisiyle güncellenecektir.'
      });
      setSeciliDuzenlenenYazi(null);
    } catch (err) {
      setPanelStatus({ type: 'error', msg: 'Hata: ' + err.message });
    } finally {
      setPanelLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative">
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 relative z-10">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-3xl p-3.5 mb-8 sticky top-3 z-50 rounded-2xl border border-white/80 shadow-lg flex justify-between items-center">
          <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
            ZEMİN
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
            <Link href="/" className="hover:text-[#00a693]">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693]">Yazılar</Link>
          </div>
        </header>

        {/* SEKME SEÇİCİ */}
        <div className="flex justify-center mb-8">
          <div className="glass-panel p-1 rounded-full border border-gray-200/80 shadow-xs inline-flex gap-1">
            <button
              onClick={() => { setAktifSekme('yazi'); setStatus({ type: '', msg: '' }); }}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all ${
                aktifSekme === 'yazi'
                  ? 'bg-[#32127a] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yeni Metin Gönder
            </button>
            <button
              onClick={() => { setAktifSekme('panel'); setPanelStatus({ type: '', msg: '' }); }}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all ${
                aktifSekme === 'panel'
                  ? 'bg-[#74112f] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yazar Paneli
            </button>
          </div>
        </div>

        {/* 1. SEKME: YENİ METİN GÖNDERME */}
        {aktifSekme === 'yazi' && (
          <div>
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 px-3 py-1 rounded-full">
                Açık Masa
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
                Düşünceni Zemine Bırak
              </h1>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                Öğrenci olma şartı yoktur; yalnızca 5 temel alan zorunludur.
              </p>
            </div>

            <form onSubmit={handleYaziGonder} className="glass-card p-6 sm:p-10 border border-white/90 shadow-xl space-y-6">
              {status.msg && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${status.type === 'success' ? 'bg-[#00a693]/15 text-[#00a693] border border-[#00a693]/30' : 'bg-[#74112f]/15 text-[#74112f] border border-[#74112f]/30'}`}>
                  {status.msg}
                </div>
              )}

              <div className="border-b border-gray-200/60 pb-6 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">1. Yazar Bilgisi</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      İsim veya Mahlas <span className="text-[#74112f]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Deniz Yılmaz"
                      value={adSoyad}
                      onChange={(e) => setAdSoyad(e.target.value)}
                      className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      4 Haneli PIN Kodu <span className="text-[#74112f]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={6}
                      placeholder="Örn: 1984"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Üniversite (İsteğe Bağlı)</label>
                    <input
                      type="text"
                      placeholder="Örn: Anadolu Üniversitesi"
                      value={universite}
                      onChange={(e) => setUniversite(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Bölüm (İsteğe Bağlı)</label>
                    <input
                      type="text"
                      placeholder="Örn: Sosyoloji"
                      value={bolum}
                      onChange={(e) => setBolum(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Instagram (İsteğe Bağlı)</label>
                    <input
                      type="text"
                      placeholder="@kullaniciadi"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Kısa Biyografi (İsteğe Bağlı)</label>
                  <textarea
                    rows={2}
                    placeholder="Düşünce alanların veya kendin hakkında kısa bir not..."
                    value={biyografi}
                    onChange={(e) => setBiyografi(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200/80 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">2. Düşünce Metni</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Kategori <span className="text-[#74112f]">*</span>
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#74112f]"
                    >
                      <option value="Felsefe">Felsefe</option>
                      <option value="Sosyoloji">Sosyoloji</option>
                      <option value="Psikoloji">Psikoloji</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Metin Başlığı <span className="text-[#74112f]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Başlığınız..."
                      value={baslik}
                      onChange={(e) => setBaslik(e.target.value)}
                      className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#74112f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Metin İçeriği <span className="text-[#74112f]">*</span>
                  </label>
                  <textarea
                    required
                    rows={12}
                    placeholder="Yazınızı buraya yazın veya yapıştırın..."
                    value={icerik}
                    onChange={(e) => setIcerik(e.target.value)}
                    className="w-full bg-white/80 border border-gray-200 rounded-2xl p-4 text-xs font-serif leading-relaxed text-gray-900 focus:outline-none focus:border-[#74112f]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Kapak Görseli Linki (İsteğe Bağlı)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={kapakUrl}
                    onChange={(e) => setKapakUrl(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#32127a] hover:bg-[#74112f] text-white py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Gönderiliyor...' : 'Metni İncelemeye Gönder'}
              </button>
            </form>
          </div>
        )}

        {/* 2. SEKME: YAZAR PANELİ */}
        {aktifSekme === 'panel' && (
          <div>
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00a693] bg-[#00a693]/10 px-3 py-1 rounded-full">
                Yazar Masası
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
                Yazar Paneli
              </h1>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                Profil bilgilerinizi güncelleyebilir veya yayındaki yazılarınız için canlı yayını kesintiye uğratmadan düzenleme gönderebilirsiniz.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-10 border border-white/90 shadow-xl space-y-6">
              {panelStatus.msg && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${panelStatus.type === 'success' ? 'bg-[#00a693]/15 text-[#00a693] border border-[#00a693]/30' : 'bg-[#74112f]/15 text-[#74112f] border border-[#74112f]/30'}`}>
                  {panelStatus.msg}
                </div>
              )}

              {!panelYazar ? (
                <form onSubmit={handleYazarGiris} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Kayıtlı İsim veya Mahlasınız <span className="text-[#74112f]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Deniz Yılmaz"
                        value={panelIsim}
                        onChange={(e) => setPanelIsim(e.target.value)}
                        className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#00a693]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        4 Haneli PIN Kodunuz <span className="text-[#74112f]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Örn: 1984"
                        value={panelPin}
                        onChange={(e) => setPanelPin(e.target.value)}
                        className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#00a693]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={panelLoading}
                    className="w-full bg-[#00a693] hover:bg-[#32127a] text-white py-3 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {panelLoading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="bg-gray-100 p-3 rounded-2xl flex flex-wrap justify-between items-center gap-2 mb-6 text-xs">
                    <span className="font-black text-gray-900">Yazar: {panelYazar.ad_soyad}</span>
                    <button
                      type="button"
                      onClick={() => { setPanelYazar(null); setSeciliDuzenlenenYazi(null); }}
                      className="text-[#74112f] hover:underline font-bold text-[11px]"
                    >
                      Çıkış Yap
                    </button>
                  </div>

                  <div className="flex border-b border-gray-200 mb-6 gap-4 text-xs font-bold">
                    <button
                      onClick={() => { setPanelAltSekme('profil'); setSeciliDuzenlenenYazi(null); }}
                      className={`pb-2 transition-all ${panelAltSekme === 'profil' ? 'border-b-2 border-[#00a693] text-[#00a693]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Profil Bilgileri
                    </button>
                    <button
                      onClick={() => setPanelAltSekme('yazilar')}
                      className={`pb-2 transition-all ${panelAltSekme === 'yazilar' ? 'border-b-2 border-[#00a693] text-[#00a693]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Metinlerim & Düzenleme ({panelYazilar.length})
                    </button>
                  </div>

                  {/* PROFİL SEKMESİ */}
                  {panelAltSekme === 'profil' && (
                    <form onSubmit={handleProfilGuncelle} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Üniversite</label>
                          <input
                            type="text"
                            placeholder="Örn: Anadolu Üniversitesi"
                            value={editUniversite}
                            onChange={(e) => setEditUniversite(e.target.value)}
                            className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Bölüm</label>
                          <input
                            type="text"
                            placeholder="Örn: Sosyoloji"
                            value={editBolum}
                            onChange={(e) => setEditBolum(e.target.value)}
                            className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Instagram (@kullaniciadi)</label>
                        <input
                          type="text"
                          placeholder="kullaniciadi"
                          value={editInstagram}
                          onChange={(e) => setEditInstagram(e.target.value)}
                          className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Biyografi</label>
                        <textarea
                          rows={4}
                          placeholder="Kendiniz ve ilgi alanlarınız hakkında kısa bilgi..."
                          value={editBiyografi}
                          onChange={(e) => setEditBiyografi(e.target.value)}
                          className="w-full bg-white/80 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                        />
                      </div>

                      <div className="pt-2 border-t border-gray-200/60">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Yeni PIN Belirle (İsteğe Bağlı)
                        </label>
                        <input
                          type="password"
                          maxLength={6}
                          placeholder="Değiştirmek istemiyorsanız boş bırakın"
                          value={editYeniPin}
                          onChange={(e) => setEditYeniPin(e.target.value)}
                          className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={panelLoading}
                        className="w-full bg-[#00a693] hover:bg-[#32127a] text-white py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        {panelLoading ? 'Kaydediliyor...' : 'Profil Bilgilerini Güncelle'}
                      </button>
                    </form>
                  )}

                  {/* YAZILAR VE DÜZENLEME SEKMESİ */}
                  {panelAltSekme === 'yazilar' && (
                    <div>
                      {!seciliDuzenlenenYazi ? (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 mb-3 font-medium">
                            Düzenlemek istediğiniz metni seçin:
                          </p>
                          {panelYazilar.length === 0 ? (
                            <p className="text-xs font-bold text-gray-400 py-6 text-center">Henüz gönderilmiş bir metniniz bulunmuyor.</p>
                          ) : (
                            panelYazilar.map((y) => (
                              <div
                                key={y.id}
                                className="p-4 rounded-2xl border border-gray-200/80 bg-white/80 hover:border-[#00a693] transition-all flex items-center justify-between gap-4"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                      {y.kategori}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${y.durum === 'onaylandi' ? 'bg-[#00a693]/15 text-[#00a693]' : 'bg-[#74112f]/15 text-[#74112f]'}`}>
                                      {y.durum === 'onaylandi' ? 'Yayında' : 'İlk Onay Bekliyor'}
                                    </span>
                                    {y.duzeltme_notu && (
                                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                        Düzenleme İnceleniyor
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{y.baslik}</h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleYaziSec(y)}
                                  className="bg-gray-900 hover:bg-[#74112f] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs transition-all"
                                >
                                  Düzenle
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <form onSubmit={handleYaziDuzenlemeGonder} className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                            <div>
                              <span className="text-xs font-black text-gray-900">Metin Düzenleme Talebi</span>
                              <span className="text-[10px] text-[#00a693] font-bold block">
                                Mevcut yazınız sitede kesintisiz yayında kalmaya devam eder.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSeciliDuzenlenenYazi(null)}
                              className="text-xs text-gray-500 hover:text-gray-900 font-bold underline"
                            >
                              İptal / Listeye Dön
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Kategori</label>
                              <select
                                value={editYaziKategori}
                                onChange={(e) => setEditYaziKategori(e.target.value)}
                                className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#00a693]"
                              >
                                <option value="Felsefe">Felsefe</option>
                                <option value="Sosyoloji">Sosyoloji</option>
                                <option value="Psikoloji">Psikoloji</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">Yeni Başlık</label>
                              <input
                                type="text"
                                required
                                value={editYaziBaslik}
                                onChange={(e) => setEditYaziBaslik(e.target.value)}
                                className="w-full bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#00a693]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Yeni Metin İçeriği</label>
                            <textarea
                              required
                              rows={10}
                              value={editYaziIcerik}
                              onChange={(e) => setEditYaziIcerik(e.target.value)}
                              className="w-full bg-white/80 border border-gray-200 rounded-2xl p-4 text-xs font-serif leading-relaxed text-gray-900 focus:outline-none focus:border-[#00a693]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">Kapak Görseli Linki</label>
                            <input
                              type="url"
                              value={editYaziKapakUrl}
                              onChange={(e) => setEditYaziKapakUrl(e.target.value)}
                              className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#00a693]"
                            />
                          </div>

                          <div className="p-4 rounded-2xl bg-[#74112f]/5 border border-[#74112f]/20">
                            <label className="block text-[11px] font-black text-[#74112f] mb-1">
                              Düzenleme Notu / Açıklaması (Editör Masasına İletilecek) *
                            </label>
                            <textarea
                              required
                              rows={2}
                              placeholder="Örn: 2. paragraftaki kaynakça güncellendi..."
                              value={duzeltmeNotu}
                              onChange={(e) => setDuzeltmeNotu(e.target.value)}
                              className="w-full bg-white border border-[#74112f]/30 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#74112f]"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={panelLoading}
                            className="w-full bg-[#74112f] hover:bg-[#32127a] text-white py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                          >
                            {panelLoading ? 'İletiliyor...' : 'Düzenlemeyi Editör Masasına Gönder'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-gray-500">
          ZEMİN — Açık Düşünce İnisiyatifi © 2026
        </div>
      </footer>
    </div>
  );
}

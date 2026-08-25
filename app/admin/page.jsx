'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const ADMIN_PIN = '1923';

  const [panelModu, setPanelModu] = useState('yazilar');

  const [yazilar, setYazilar] = useState([]);
  const [aktifYaziSekme, setAktifYaziSekme] = useState('beklemede');
  const [selectedYazi, setSelectedYazi] = useState(null);

  const [dergiler, setDergiler] = useState([]);
  const [selectedDergi, setSelectedDergi] = useState(null);
  const [dergiForm, setDergiForm] = useState({
    sayi_no: '',
    baslik: '',
    tema_aciklama: '',
    kapak_url: '',
    pdf_url: '',
    durum: 'hazirlikta',
  });
  const [isEditingDergi, setIsEditingDergi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('zemin_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchTumVeriler();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('zemin_admin_auth', 'true');
      setPinError(false);
      fetchTumVeriler();
    } else {
      setPinError(true);
    }
  };

  async function fetchTumVeriler() {
    setLoading(true);
    const { data: yData, error: yError } = await supabase
      .from('yazilar')
      .select(`
        id, baslik, slug, kategori, icerik, durum, dergi_id, olusturulma_tarihi,
        yazarlar (id, ad_soyad, universite, bolum, instagram, pin, biyografi)
      `)
      .order('olusturulma_tarihi', { ascending: false });

    if (!yError && yData) {
      setYazilar(yData);
      const bekleyenler = yData.filter((y) => y.durum === 'beklemede');
      setSelectedYazi(bekleyenler.length > 0 ? bekleyenler[0] : yData[0] || null);
    }

    const { data: dData, error: dError } = await supabase
      .from('dergiler')
      .select('*')
      .order('sayi_no', { ascending: false });

    if (!dError && dData) {
      setDergiler(dData);
      if (dData.length > 0 && !selectedDergi) setSelectedDergi(dData[0]);
    }

    setLoading(false);
  }

  async function yaziDurumGuncelle(id, yeniDurum) {
    const { error } = await supabase
      .from('yazilar')
      .update({ durum: yeniDurum, yayin_tarihi: yeniDurum === 'onaylandi' ? new Date().toISOString() : null })
      .eq('id', id);

    if (!error) {
      const guncel = yazilar.map((y) => (y.id === id ? { ...y, durum: yeniDurum } : y));
      setYazilar(guncel);
      setSelectedYazi((prev) => (prev?.id === id ? { ...prev, durum: yeniDurum } : prev));
    } else {
      alert('Durum guncellenemedi: ' + error.message);
    }
  }

  async function yaziDergiAta(yaziId, dergiId) {
    const yeniDergiId = dergiId === '' ? null : dergiId;
    const { error } = await supabase
      .from('yazilar')
      .update({ dergi_id: yeniDergiId })
      .eq('id', yaziId);

    if (!error) {
      const guncel = yazilar.map((y) => (y.id === yaziId ? { ...y, dergi_id: yeniDergiId } : y));
      setYazilar(guncel);
      if (selectedYazi?.id === yaziId) setSelectedYazi({ ...selectedYazi, dergi_id: yeniDergiId });
    } else {
      alert('Dergi baglantisi guncellenemedi: ' + error.message);
    }
  }

  async function yaziSil(id) {
    if (!confirm('Bu yaziyi silmek istediginizden emin misiniz?')) return;
    const { error } = await supabase.from('yazilar').delete().eq('id', id);
    if (!error) {
      const guncel = yazilar.filter((y) => y.id !== id);
      setYazilar(guncel);
      setSelectedYazi(guncel[0] || null);
    } else {
      alert('Yazi silinemedi: ' + error.message);
    }
  }

  async function dergiKaydet(e) {
    e.preventDefault();

    const payload = {
      sayi_no: dergiForm.sayi_no.trim(),
      baslik: dergiForm.baslik.trim(),
      tema_aciklama: dergiForm.tema_aciklama.trim() || null,
      kapak_url: dergiForm.kapak_url.trim() || null,
      pdf_url: dergiForm.pdf_url.trim() || null,
      durum: dergiForm.durum,
      yayin_tarihi: dergiForm.durum === 'yayinda' ? new Date().toISOString() : null,
    };

    if (isEditingDergi && selectedDergi) {
      const { error } = await supabase
        .from('dergiler')
        .update(payload)
        .eq('id', selectedDergi.id);

      if (!error) {
        alert('Dergi sayisi guncellendi.');
        fetchTumVeriler();
        setIsEditingDergi(false);
      } else {
        alert('Guncelleme hatasi: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('dergiler').insert([payload]);

      if (!error) {
        alert('Yeni dergi sayisi olusturuldu.');
        setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlikta' });
        fetchTumVeriler();
      } else {
        alert('Dergi olusturma hatasi: ' + error.message);
      }
    }
  }

  async function dergiSil(id) {
    if (!confirm('Bu dergi sayisini silmek istediginizden emin misiniz?')) return;
    const { error } = await supabase.from('dergiler').delete().eq('id', id);
    if (!error) {
      alert('Dergi sayisi silindi.');
      fetchTumVeriler();
      setSelectedDergi(null);
      setIsEditingDergi(false);
      setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlikta' });
    } else {
      alert('Silme hatasi: ' + error.message);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="border-2 border-zemin-bordo bg-zemin-kagit p-8 max-w-sm w-full text-center space-y-4 shadow-[4px_4px_0px_#4E141E]">
          <span className="text-[10px] uppercase tracking-widest text-zemin-yesil font-bold">Editoryal Giris</span>
          <h2 className="font-serif text-3xl font-black text-zemin-bordo">Masa Kilidi</h2>
          <p className="text-xs text-zemin-metin/70">Yonetim paneline erismek icin PIN kodunu girin.</p>
          <input
            type="password"
            maxLength={6}
            placeholder="PIN Kodu"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full text-center tracking-widest text-xl font-bold border-2 border-zemin-cizgi bg-zemin-bej p-3 outline-none focus:border-zemin-bordo"
          />
          {pinError && <p className="text-xs text-red-700 font-bold">Hatali PIN kodu.</p>}
          <button type="submit" className="w-full bg-zemin-bordo text-zemin-bej py-3 text-xs uppercase tracking-widest font-bold shadow-[2px_2px_0px_#2D4F38]">
            Giris Yap
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <header className="border-b-2 border-zemin-bordo pb-4 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest bg-zemin-yesil text-zemin-bej px-2 py-0.5 font-bold">ZEMIN YONETIM</span>
          <h1 className="font-serif text-3xl font-black text-zemin-bordo mt-1">Editoryal Masa</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zemin-kagit border border-zemin-cizgi p-1 flex">
            <button
              onClick={() => setPanelModu('yazilar')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                panelModu === 'yazilar' ? 'bg-zemin-bordo text-zemin-bej shadow-sm' : 'text-zemin-metin/70'
              }`}
            >
              Yazi Inceleme ({yazilar.filter((y) => y.durum === 'beklemede').length} Bekleyen)
            </button>
            <button
              onClick={() => setPanelModu('dergiler')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                panelModu === 'dergiler' ? 'bg-zemin-bordo text-zemin-bej shadow-sm' : 'text-zemin-metin/70'
              }`}
            >
              Dergi Yonetimi ({dergiler.length})
            </button>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('zemin_admin_auth');
              setIsAuthenticated(false);
            }}
            className="text-xs uppercase tracking-widest border border-red-300 text-red-800 px-3 py-2 hover:bg-red-50 font-bold"
          >
            Cikis
          </button>
        </div>
      </header>

      {panelModu === 'yazilar' && (
        <div>
          <div className="flex gap-2 border-b border-zemin-cizgi pb-3 mb-4 overflow-x-auto text-xs uppercase tracking-wider font-bold">
            {['beklemede', 'onaylandi', 'reddedildi', 'tumu'].map((sekme) => {
              const count = sekme === 'tumu' ? yazilar.length : yazilar.filter((y) => y.durum === sekme).length;
              return (
                <button
                  key={sekme}
                  onClick={() => {
                    setAktifYaziSekme(sekme);
                    const list = sekme === 'tumu' ? yazilar : yazilar.filter((y) => y.durum === sekme);
                    setSelectedYazi(list[0] || null);
                  }}
                  className={`px-3.5 py-1.5 flex items-center gap-2 transition-all ${
                    aktifYaziSekme === sekme ? 'bg-zemin-bordo text-zemin-bej' : 'bg-zemin-kagit border border-zemin-cizgi text-zemin-metin'
                  }`}
                >
                  <span className="capitalize">{sekme}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${aktifYaziSekme === sekme ? 'bg-zemin-bej text-zemin-bordo' : 'bg-zemin-cizgi'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className={`lg:col-span-5 divide-y divide-zemin-cizgi border-2 border-zemin-cizgi bg-zemin-kagit max-h-[75vh] overflow-y-auto ${selectedYazi ? 'hidden lg:block' : 'block'}`}>
              {(aktifYaziSekme === 'tumu' ? yazilar : yazilar.filter((y) => y.durum === aktifYaziSekme)).map((y) => (
                <button
                  key={y.id}
                  onClick={() => setSelectedYazi(y)}
                  className={`w-full text-left p-4 flex flex-col gap-1 transition-all ${
                    selectedYazi?.id === y.id ? 'bg-zemin-bordo/10 border-l-4 border-l-zemin-bordo' : 'hover:bg-zemin-cizgi/30 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                    <span className="text-zemin-yesil">{y.kategori}</span>
                    {y.dergi_id && <span className="bg-zemin-bordo text-zemin-bej px-1.5 py-0.2 text-[9px]">Dergide</span>}
                  </div>
                  <p className="font-serif font-bold text-base text-zemin-metin truncate">{y.baslik}</p>
                  <p className="text-xs text-zemin-metin/70 truncate">{y.yazarlar?.ad_soyad} • {y.yazarlar?.universite}</p>
                </button>
              ))}
            </div>

            <div className={`lg:col-span-7 border-2 border-zemin-bordo bg-zemin-kagit p-6 md:p-8 flex flex-col justify-between max-h-[75vh] overflow-y-auto ${selectedYazi ? 'block' : 'hidden lg:flex'}`}>
              {selectedYazi ? (
                <div className="space-y-5">
                  <button onClick={() => setSelectedYazi(null)} className="lg:hidden text-xs uppercase tracking-widest font-bold text-zemin-bordo underline mb-2">
                    ← Listeye Don
                  </button>

                  <div className="border-b border-zemin-cizgi pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-yesil">{selectedYazi.kategori}</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-black text-zemin-bordo mt-1 leading-tight">{selectedYazi.baslik}</h2>
                      </div>
                      {selectedYazi.durum === 'onaylandi' && (
                        <Link href={`/yazi/${selectedYazi.slug}`} target="_blank" className="text-xs uppercase tracking-widest font-bold text-zemin-bordo border-b border-zemin-bordo">
                          Sitede Gor ↗
                        </Link>
                      )}
                    </div>

                    <div className="mt-4 p-3.5 bg-zemin-bej border border-zemin-cizgi text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <p><strong className="text-zemin-metin">Yazar:</strong> {selectedYazi.yazarlar?.ad_soyad} ({selectedYazi.yazarlar?.universite} — {selectedYazi.yazarlar?.bolum})</p>
                        <span className="bg-zemin-bordo text-zemin-bej px-2 py-0.5 font-mono font-bold text-[10px]">
                          PIN: {selectedYazi.yazarlar?.pin || 'Belirlenmedi'}
                        </span>
                      </div>
                      {selectedYazi.yazarlar?.instagram && <p><strong className="text-zemin-metin">Instagram:</strong> @{selectedYazi.yazarlar?.instagram}</p>}
                    </div>

                    <div className="mt-4 p-3 bg-zemin-yesil/10 border border-zemin-yesil/30 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zemin-yesil block">Dergi Sayisina Dahil Et</span>
                        <span className="text-xs text-zemin-metin/80">Bu metnin yer alacagi sayiyi secin:</span>
                      </div>
                      <select
                        value={selectedYazi.dergi_id || ''}
                        onChange={(e) => yaziDergiAta(selectedYazi.id, e.target.value)}
                        className="text-xs font-bold bg-zemin-bej border border-zemin-bordo p-2 outline-none"
                      >
                        <option value="">-- Serbest Arsiv (Dergide Yok) --</option>
                        {dergiler.map((d) => (
                          <option key={d.id} value={d.id}>
                            Sayi {d.sayi_no}: {d.baslik}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="font-serif text-zemin-metin text-base leading-relaxed whitespace-pre-wrap max-h-[35vh] overflow-y-auto pr-3 border-b border-zemin-cizgi pb-4">
                    {selectedYazi.icerik}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    {selectedYazi.durum === 'beklemede' && (
                      <>
                        <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'onaylandi')} className="flex-1 bg-zemin-bordo text-zemin-bej py-3 text-xs uppercase tracking-widest font-bold shadow-[2px_2px_0px_#2D4F38]">
                          ✓ Yayina Al (Onayla)
                        </button>
                        <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'reddedildi')} className="border border-red-300 text-red-800 px-6 py-3 text-xs uppercase tracking-widest font-bold">
                          ✕ Reddet
                        </button>
                      </>
                    )}
                    {selectedYazi.durum === 'onaylandi' && (
                      <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'beklemede')} className="flex-1 border border-zemin-metin text-zemin-metin py-3 text-xs uppercase tracking-widest font-bold hover:bg-zemin-bordo hover:text-zemin-bej">
                        Yayindan Kaldir (Beklemeye Al)
                      </button>
                    )}
                    {selectedYazi.durum === 'reddedildi' && (
                      <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'onaylandi')} className="flex-1 bg-zemin-yesil text-zemin-bej py-3 text-xs uppercase tracking-widest font-bold">
                        ✓ Tekrar Onayla
                      </button>
                    )}
                    <button onClick={() => yaziSil(selectedYazi.id)} className="text-xs uppercase tracking-widest text-red-700 font-bold underline px-3">
                      Sil
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-xs text-zemin-metin/50 font-bold">Incelemek icin soldan bir metin secin.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {panelModu === 'dergiler' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center border-b-2 border-zemin-bordo pb-2">
              <h2 className="font-serif text-2xl font-bold text-zemin-bordo">Mevcut Sayilar</h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditingDergi(false);
                  setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlikta' });
                  setSelectedDergi(null);
                }}
                className="bg-zemin-bordo text-zemin-bej px-3 py-1 text-xs uppercase tracking-widest font-bold shadow-[2px_2px_0px_#2D4F38]"
              >
                + Yeni Sayi Ekle
              </button>
            </div>

            {dergiler.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-zemin-cizgi text-center bg-zemin-kagit">
                <p className="font-serif text-lg text-zemin-bordo font-bold">Henuz dergi sayisi yok.</p>
                <p className="text-xs text-zemin-metin/70 mt-1">Sagdaki formdan ilk sayini (Sayi 01) olusturabilirsin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dergiler.map((d) => {
                  const sayidakiYaziSayisi = yazilar.filter((y) => y.dergi_id === d.id).length;
                  return (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDergi(d);
                        setIsEditingDergi(true);
                        setDergiForm({
                          sayi_no: d.sayi_no || '',
                          baslik: d.baslik || '',
                          tema_aciklama: d.tema_aciklama || '',
                          kapak_url: d.kapak_url || '',
                          pdf_url: d.pdf_url || '',
                          durum: d.durum || 'hazirlikta',
                        });
                      }}
                      className={`p-5 border-2 cursor-pointer transition-all ${
                        selectedDergi?.id === d.id
                          ? 'border-zemin-bordo bg-zemin-bordo text-zemin-bej shadow-[3px_3px_0px_#2D4F38]'
                          : 'border-zemin-cizgi bg-zemin-kagit text-zemin-metin hover:border-zemin-bordo'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 ${
                          selectedDergi?.id === d.id ? 'bg-zemin-bej text-zemin-bordo' : 'bg-zemin-bordo text-zemin-bej'
                        }`}>
                          Sayi {d.sayi_no}
                        </span>
                        <span className={`text-xs uppercase tracking-widest font-bold ${
                          d.durum === 'yayinda' ? 'text-green-400' : 'text-amber-300'
                        }`}>
                          ● {d.durum === 'yayinda' ? 'YAYINDA' : 'HAZIRLIKTA'}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold mt-1 leading-snug">{d.baslik}</h3>
                      <div className="mt-3 pt-3 border-t border-current/20 flex justify-between text-xs opacity-90">
                        <span>{sayidakiYaziSayisi} Makale Dahil Edildi</span>
                        <span className="font-bold underline">Duzenle →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-zemin-kagit border-2 border-zemin-bordo p-6 md:p-8 shadow-[4px_4px_0px_#4E141E]">
            <div className="flex justify-between items-center border-b-2 border-zemin-cizgi pb-3 mb-6">
              <h2 className="font-serif text-2xl font-bold text-zemin-bordo">
                {isEditingDergi ? `Sayi ${dergiForm.sayi_no} Duzenleniyor` : 'Yeni Dergi Sayisi Olustur'}
              </h2>
              {isEditingDergi && selectedDergi && (
                <button
                  type="button"
                  onClick={() => dergiSil(selectedDergi.id)}
                  className="text-xs uppercase tracking-widest text-red-700 font-bold underline"
                >
                  Sayiyi Sil
                </button>
              )}
            </div>

            <form onSubmit={dergiKaydet} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Sayi No (Orn: 01) *</label>
                  <input
                    type="text"
                    required
                    placeholder="01"
                    value={dergiForm.sayi_no}
                    onChange={(e) => setDergiForm({ ...dergiForm, sayi_no: e.target.value })}
                    className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-xs font-bold outline-none focus:border-zemin-bordo"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Durum</label>
                  <select
                    value={dergiForm.durum}
                    onChange={(e) => setDergiForm({ ...dergiForm, durum: e.target.value })}
                    className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-xs font-bold outline-none focus:border-zemin-bordo"
                  >
                    <option value="hazirlikta">Hazirlik Asamasinda (Yazi Kabulu Acik)</option>
                    <option value="yayinda">Yayinda (Ana Sayfa Vitrinine Al & PDF'i Ac)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Sayi Dosya Basligi *</label>
                <input
                  type="text"
                  required
                  placeholder="Orn: Bellek, Zaman ve Irade"
                  value={dergiForm.baslik}
                  onChange={(e) => setDergiForm({ ...dergiForm, baslik: e.target.value })}
                  className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-sm font-serif font-bold outline-none focus:border-zemin-bordo"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Tema / Dosya Aciklamasi (Opsiyonel)</label>
                <textarea
                  rows={3}
                  placeholder="Bu sayinin editoryal cercevesi..."
                  value={dergiForm.tema_aciklama}
                  onChange={(e) => setDergiForm({ ...dergiForm, tema_aciklama: e.target.value })}
                  className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-xs outline-none focus:border-zemin-bordo"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Kapak Gorsel Linki (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Gorsel linki (Bos birakilabilir)"
                  value={dergiForm.kapak_url}
                  onChange={(e) => setDergiForm({ ...dergiForm, kapak_url: e.target.value })}
                  className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-xs outline-none focus:border-zemin-bordo"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-zemin-yesil mb-1">Dergi PDF / Web Okuma Linki (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Google Drive, Issuu veya dogrudan PDF linki (Bos birakilabilir)"
                  value={dergiForm.pdf_url}
                  onChange={(e) => setDergiForm({ ...dergiForm, pdf_url: e.target.value })}
                  className="w-full bg-zemin-bej border-2 border-zemin-cizgi p-2.5 text-xs outline-none focus:border-zemin-bordo"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zemin-bordo text-zemin-bej py-3 text-xs uppercase tracking-widest font-bold shadow-[3px_3px_0px_#2D4F38] hover:bg-zemin-bordokoyu cursor-pointer transition-all"
              >
                {isEditingDergi ? '✓ Degisiklikleri Kaydet' : '+ Dergi Sayisini Olustur'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

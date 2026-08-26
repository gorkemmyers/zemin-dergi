'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  // Kimlik Doğrulama
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tab & Filtre Yönetimi
  const [activeTab, setActiveTab] = useState('yazilar'); // 'yazilar' | 'dergiler' | 'yazarlar'
  const [yaziFiltre, setYaziFiltre] = useState('beklemede'); // 'beklemede' | 'onaylandi' | 'reddedildi' | 'tumu'

  // Veri Havuzları
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [selectedYazi, setSelectedYazi] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dergi Form State (Ekleme & Düzenleme)
  const [duzenlenenDergiId, setDuzenlenenDergiId] = useState(null);
  const [dergiForm, setDergiForm] = useState({
    sayi_no: '',
    baslik: '',
    tema_aciklama: '',
    kapak_url: '',
    pdf_url: '',
    durum: 'hazirlaniyor'
  });

  // Yazar Düzenleme Modal State
  const [duzenlenenYazar, setDuzenlenenYazar] = useState(null);

  // Sayfa Yüklendiğinde Oturum Kontrolü
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('zemin_admin_session');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1923') {
      sessionStorage.setItem('zemin_admin_session', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
      loadData();
    } else {
      setAuthError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zemin_admin_session');
    setIsAuthenticated(false);
  };

  async function loadData() {
    setLoading(true);
    const { data: yaziData } = await supabase
      .from('yazilar')
      .select('*, yazarlar(*)')
      .order('olusturulma_tarihi', { ascending: false });

    const { data: dergiData } = await supabase
      .from('dergiler')
      .select('*')
      .order('sayi_no', { ascending: false });

    const { data: yazarData } = await supabase
      .from('yazarlar')
      .select('*, yazilar(id, durum)')
      .order('ad_soyad', { ascending: true });

    if (yaziData) setYazilar(yaziData);
    if (dergiData) setDergiler(dergiData);
    if (yazarData) setYazarlar(yazarData);
    setLoading(false);
  }

  // --- YAZI FONKSİYONLARI ---
  async function yaziDurumGuncelle(id, yeniDurum) {
    const { error } = await supabase.from('yazilar').update({ durum: yeniDurum }).eq('id', id);
    if (!error) {
      setYazilar(yazilar.map(y => y.id === id ? { ...y, durum: yeniDurum } : y));
      if (selectedYazi?.id === id) setSelectedYazi({ ...selectedYazi, durum: yeniDurum });
    } else {
      alert('Hata: ' + error.message);
    }
  }

  async function yaziSil(id) {
    if (!confirm('Bu metni kalıcı olarak silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('yazilar').delete().eq('id', id);
    if (!error) {
      setYazilar(yazilar.filter(y => y.id !== id));
      if (selectedYazi?.id === id) setSelectedYazi(null);
    } else {
      alert('Hata: ' + error.message);
    }
  }

  async function dergiyeAta(yaziId, dergiId) {
    const { error } = await supabase.from('yazilar').update({ dergi_id: dergiId || null }).eq('id', yaziId);
    if (!error) {
      setYazilar(yazilar.map(y => y.id === yaziId ? { ...y, dergi_id: dergiId || null } : y));
      if (selectedYazi?.id === yaziId) setSelectedYazi({ ...selectedYazi, dergi_id: dergiId || null });
    }
  }

  // --- DERGİ FONKSİYONLARI ---
  async function dergiKaydet(e) {
    e.preventDefault();
    if (duzenlenenDergiId) {
      // Güncelleme
      const { error } = await supabase.from('dergiler').update({
        sayi_no: parseInt(dergiForm.sayi_no),
        baslik: dergiForm.baslik,
        tema_aciklama: dergiForm.tema_aciklama,
        kapak_url: dergiForm.kapak_url,
        pdf_url: dergiForm.pdf_url,
        durum: dergiForm.durum
      }).eq('id', duzenlenenDergiId);

      if (!error) {
        setDuzenlenenDergiId(null);
        setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlaniyor' });
        loadData();
      }
    } else {
      // Yeni Ekleme
      const { error } = await supabase.from('dergiler').insert([{
        sayi_no: parseInt(dergiForm.sayi_no),
        baslik: dergiForm.baslik,
        tema_aciklama: dergiForm.tema_aciklama,
        kapak_url: dergiForm.kapak_url,
        pdf_url: dergiForm.pdf_url,
        durum: dergiForm.durum
      }]);
      if (!error) {
        setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlaniyor' });
        loadData();
      }
    }
  }

  function dergiDuzenleBaslat(d) {
    setDuzenlenenDergiId(d.id);
    setDergiForm({
      sayi_no: d.sayi_no,
      baslik: d.baslik,
      tema_aciklama: d.tema_aciklama || '',
      kapak_url: d.kapak_url || '',
      pdf_url: d.pdf_url || '',
      durum: d.durum
    });
  }

  async function dergiSil(id) {
    if (!confirm('Bu dergi sayısını silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('dergiler').delete().eq('id', id);
    if (!error) loadData();
  }

  // --- YAZAR FONKSİYONLARI ---
  async function yazarGuncelle(e) {
    e.preventDefault();
    const { error } = await supabase.from('yazarlar').update({
      ad_soyad: duzenlenenYazar.ad_soyad,
      universite: duzenlenenYazar.universite,
      bolum: duzenlenenYazar.bolum,
      instagram: duzenlenenYazar.instagram?.replace('@', ''),
      biyografi: duzenlenenYazar.biyografi,
      pin: duzenlenenYazar.pin
    }).eq('id', duzenlenenYazar.id);

    if (!error) {
      setDuzenlenenYazar(null);
      loadData();
    } else {
      alert('Yazar güncellenemedi: ' + error.message);
    }
  }

  async function yazarSil(id) {
    if (!confirm('Yazarı silerseniz bu yazara bağlı tüm metinler de silinebilir. Devam edilsin mi?')) return;
    const { error } = await supabase.from('yazarlar').delete().eq('id', id);
    if (!error) loadData();
  }

  // 1923 ŞİFRE KİLİDİ EKRANI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 sm:p-10 max-w-sm w-full text-center border border-white/90 shadow-2xl">
          <span className="text-xs uppercase tracking-widest text-[#74112f] font-black">Güvenli Alan</span>
          <h1 className="text-2xl font-black text-gray-900 mt-1 mb-6">Editör Girişi</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Editör PIN Kodu"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg bg-white/90 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-[#32127a]"
              autoFocus
            />
            {authError && <p className="text-xs font-bold text-rose-600">Geçersiz PIN girdiniz.</p>}
            <button type="submit" className="w-full bg-[#32127a] text-white py-3 rounded-xl text-xs font-bold tracking-wider hover:bg-[#32127a]/90">
              Giriş Yap
            </button>
          </form>
          <Link href="/" className="inline-block text-xs font-bold text-gray-400 mt-6 hover:text-gray-700">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const filtrelenmisYazilar = yazilar.filter(y => yaziFiltre === 'tumu' ? true : y.durum === yaziFiltre);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        
        {/* ÜST BAR & TABLAR */}
        <header className="glass-panel p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 border border-white/80 shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter">
              ZEMİN
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-2.5 py-0.5 rounded-full">
              Editör Masası
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'yazilar', label: `Metinler (${yazilar.length})` },
              { id: 'dergiler', label: `Dergiler (${dergiler.length})` },
              { id: 'yazarlar', label: `Yazarlar (${yazarlar.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#32127a] text-white shadow-sm' : 'bg-white/60 text-gray-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button onClick={handleLogout} className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-full ml-2">
              Çıkış
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-xs font-bold text-gray-500">Veriler yükleniyor...</div>
        ) : (
          <>
            {/* 1. SEVİYE: YAZI İNCELEME */}
            {activeTab === 'yazilar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sol Sütun: Filtre Sekmeleri & Liste */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex gap-1.5 p-1 glass-panel rounded-2xl bg-white/40">
                    {[
                      { id: 'beklemede', label: 'Bekleyenler' },
                      { id: 'onaylandi', label: 'Yayındakiler' },
                      { id: 'reddedildi', label: 'Reddedilenler' },
                      { id: 'tumu', label: 'Tümü' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setYaziFiltre(f.id)}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          yaziFiltre === f.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
                    {filtrelenmisYazilar.length === 0 ? (
                      <div className="glass-card p-6 text-center text-xs text-gray-400">Bu sekmede metin bulunmuyor.</div>
                    ) : (
                      filtrelenmisYazilar.map(y => (
                        <div
                          key={y.id}
                          onClick={() => setSelectedYazi(y)}
                          className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                            selectedYazi?.id === y.id ? 'bg-white border-[#32127a] shadow-md' : 'glass-card border-white/60 hover:bg-white/80'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold uppercase text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                              {y.kategori}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              y.durum === 'onaylandi' ? 'bg-emerald-100 text-emerald-800' : y.durum === 'reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {y.durum}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{y.baslik}</h3>
                          <p className="text-[10px] text-gray-500">{y.yazarlar?.ad_soyad} — {y.yazarlar?.universite}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sağ Sütun: Okuma & Eylem Alanı */}
                <div className="lg:col-span-7">
                  {selectedYazi ? (
                    <div className="glass-card p-6 border border-white/90 shadow-xl space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#74112f] uppercase">Metin Detayı</span>
                          <h2 className="text-lg font-black text-gray-900 truncate">{selectedYazi.baslik}</h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'onaylandi')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-700">
                            Yayına Al
                          </button>
                          <button onClick={() => yaziDurumGuncelle(selectedYazi.id, 'reddedildi')} className="bg-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-rose-700">
                            Reddet
                          </button>
                          <button onClick={() => yaziSil(selectedYazi.id)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-rose-100 hover:text-rose-700">
                            Sil
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/70 border border-white text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{selectedYazi.yazarlar?.ad_soyad}</p>
                          <p className="text-[11px] text-gray-500">{selectedYazi.yazarlar?.universite} — {selectedYazi.yazarlar?.bolum}</p>
                          <p className="font-mono text-[#74112f] font-bold text-[10px] mt-1">PIN: {selectedYazi.yazarlar?.pin || 'Belirlenmedi'}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#32127a] uppercase block mb-1">Dergide Yayımla</label>
                          <select
                            value={selectedYazi.dergi_id || ''}
                            onChange={(e) => dergiyeAta(selectedYazi.id, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none"
                          >
                            <option value="">Dergiye Bağlı Değil</option>
                            {dergiler.map(d => (
                              <option key={d.id} value={d.id}>Sayı {d.sayi_no}: {d.baslik}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="font-serif text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-white/90 border max-h-[46vh] overflow-y-auto">
                        {selectedYazi.icerik}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center text-gray-400 text-xs">
                      İncelemek için sol listeden bir metin seçin.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. SEVİYE: DERGİ YÖNETİMİ */}
            {activeTab === 'dergiler' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sol: Ekleme/Düzenleme Formu */}
                <div className="lg:col-span-5">
                  <div className="glass-card p-5 border border-white/90 shadow-xl">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                      <h2 className="text-sm font-black text-gray-900">
                        {duzenlenenDergiId ? 'Dergiyi Düzenle' : 'Yeni Dergi Sayısı Oluştur'}
                      </h2>
                      {duzenlenenDergiId && (
                        <button
                          onClick={() => {
                            setDuzenlenenDergiId(null);
                            setDergiForm({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlaniyor' });
                          }}
                          className="text-[10px] font-bold text-gray-500 hover:underline"
                        >
                          İptal Et
                        </button>
                      )}
                    </div>
                    
                    <form onSubmit={dergiKaydet} className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Sayı No</label>
                          <input required type="number" placeholder="01" value={dergiForm.sayi_no} onChange={(e) => setDergiForm({ ...dergiForm, sayi_no: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs font-bold" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Başlık / Tema</label>
                          <input required type="text" placeholder="Bellek ve Zaman" value={dergiForm.baslik} onChange={(e) => setDergiForm({ ...dergiForm, baslik: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs font-bold" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Tema Açıklaması</label>
                        <textarea rows={3} placeholder="Editoryal açıklama..." value={dergiForm.tema_aciklama} onChange={(e) => setDergiForm({ ...dergiForm, tema_aciklama: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Kapak Görsel URL</label>
                        <input type="text" placeholder="https://..." value={dergiForm.kapak_url} onChange={(e) => setDergiForm({ ...dergiForm, kapak_url: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">PDF URL</label>
                        <input type="text" placeholder="https://..." value={dergiForm.pdf_url} onChange={(e) => setDergiForm({ ...dergiForm, pdf_url: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Durum</label>
                        <select value={dergiForm.durum} onChange={(e) => setDergiForm({ ...dergiForm, durum: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs font-bold">
                          <option value="hazirlaniyor">Hazırlanıyor</option>
                          <option value="yayinda">Yayında (Sitede Görünür)</option>
                        </select>
                      </div>

                      <button type="submit" className="w-full bg-[#32127a] text-white py-2.5 rounded-xl text-xs font-bold">
                        {duzenlenenDergiId ? 'Değişiklikleri Kaydet' : 'Dergi Sayısını Ekle'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sağ: Liste & Eylemler */}
                <div className="lg:col-span-7 space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-gray-500 block px-1">Mevcut Dergiler</span>
                  {dergiler.map(d => (
                    <div key={d.id} className="glass-card p-3.5 flex items-center justify-between gap-3 border border-white/70">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-[#74112f] text-white font-black flex items-center justify-center text-xs">
                          {d.sayi_no}
                        </span>
                        <div>
                          <h3 className="font-bold text-xs text-gray-900">{d.baslik}</h3>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            d.durum === 'yayinda' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {d.durum}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => dergiDuzenleBaslat(d)} className="text-xs font-bold text-[#00a693] hover:underline">
                          Düzenle
                        </button>
                        <button onClick={() => dergiSil(d.id)} className="text-xs font-bold text-rose-600 hover:underline">
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 3. SEVİYE: YAZAR LİSTESİ & DÜZENLEME */}
            {activeTab === 'yazarlar' && (
              <div className="space-y-4">
                {/* Yazar Düzenleme Modalı */}
                {duzenlenenYazar && (
                  <div className="glass-card p-5 border border-[#32127a] mb-6 max-w-2xl mx-auto shadow-2xl">
                    <h3 className="text-sm font-black text-gray-900 mb-3 pb-1 border-b">
                      Yazar Düzenle: {duzenlenenYazar.ad_soyad}
                    </h3>
                    <form onSubmit={yazarGuncelle} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-gray-600">Ad Soyad</label>
                          <input type="text" value={duzenlenenYazar.ad_soyad} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, ad_soyad: e.target.value })} className="w-full bg-white border p-2 rounded-lg mt-1" />
                        </div>
                        <div>
                          <label className="font-bold text-[#74112f]">PIN Kodu</label>
                          <input type="text" value={duzenlenenYazar.pin || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, pin: e.target.value })} className="w-full bg-white border p-2 rounded-lg mt-1 font-mono font-bold" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-gray-600">Üniversite</label>
                          <input type="text" value={duzenlenenYazar.universite || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, universite: e.target.value })} className="w-full bg-white border p-2 rounded-lg mt-1" />
                        </div>
                        <div>
                          <label className="font-bold text-gray-600">Bölüm</label>
                          <input type="text" value={duzenlenenYazar.bolum || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, bolum: e.target.value })} className="w-full bg-white border p-2 rounded-lg mt-1" />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-gray-600">Biyografi</label>
                        <textarea rows={2} value={duzenlenenYazar.biyografi || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, biyografi: e.target.value })} className="w-full bg-white border p-2 rounded-lg mt-1" />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setDuzenlenenYazar(null)} className="px-4 py-2 rounded-lg bg-gray-200 font-bold">İptal</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#32127a] text-white font-bold">Kaydet</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {yazarlar.map(yz => (
                    <div key={yz.id} className="glass-card p-3.5 flex flex-col justify-between border border-white/70">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-xs text-gray-900">{yz.ad_soyad}</h4>
                          <span className="font-mono text-[9px] font-bold text-[#74112f] bg-[#74112f]/10 px-1.5 py-0.5 rounded">
                            PIN: {yz.pin || 'Yok'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{yz.universite} — {yz.bolum}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-400">{yz.yazilar?.length || 0} Metin</span>
                        <div className="flex gap-2">
                          <button onClick={() => setDuzenlenenYazar(yz)} className="font-bold text-[#00a693] hover:underline">Düzenle</button>
                          <button onClick={() => yazarSil(yz.id)} className="font-bold text-rose-600 hover:underline">Sil</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  // Kimlik Doğrulama
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Sekmeler & Filtreler
  const [activeTab, setActiveTab] = useState('yazilar'); // 'yazilar' | 'dergiler' | 'yazarlar'
  const [yaziDurumFiltre, setYaziDurumFiltre] = useState('duzenleme'); // 'duzenleme' | 'beklemede' | 'onaylandi' | 'reddedildi' | 'tumu'
  const [yaziKategoriFiltre, setYaziKategoriFiltre] = useState('tumu'); // 'tumu' | 'Felsefe' | 'Sosyoloji' | 'Psikoloji'
  const [aramaMetni, setAramaMetni] = useState('');
  const [yazarAramaMetni, setYazarAramaMetni] = useState('');

  // Veri Havuzları
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [selectedYazi, setSelectedYazi] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editör Hızlı Metin Düzenleme Modu
  const [isEditingYazi, setIsEditingYazi] = useState(false);
  const [editYaziData, setEditYaziData] = useState({ baslik: '', kategori: 'Felsefe', icerik: '', kapak_url: '' });

  // Dergi Form State
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
    try {
      const { data: yaziData } = await supabase
        .from('yazilar')
        .select('*, yazarlar(*)')
        .order('id', { ascending: false });

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
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- YAZI FONKSİYONLARI ---
  async function yaziDurumGuncelle(id, yeniDurum) {
    const guncelleme = { durum: yeniDurum };
    if (yeniDurum === 'onaylandi') {
      guncelleme.duzeltme_notu = null; // Düzenleme onaylanınca not temizlenir
    }

    const { error } = await supabase.from('yazilar').update(guncelleme).eq('id', id);
    if (!error) {
      setYazilar(yazilar.map(y => y.id === id ? { ...y, ...guncelleme } : y));
      if (selectedYazi?.id === id) setSelectedYazi({ ...selectedYazi, ...guncelleme });
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

  const handleYaziDuzenleAc = (y) => {
    setEditYaziData({
      baslik: y.baslik || '',
      kategori: y.kategori || 'Felsefe',
      icerik: y.icerik || '',
      kapak_url: y.kapak_url || ''
    });
    setIsEditingYazi(true);
  };

  const handleYaziDuzenleKaydet = async (e) => {
    e.preventDefault();
    if (!selectedYazi) return;

    const { error } = await supabase.from('yazilar').update({
      baslik: editYaziData.baslik.trim(),
      kategori: editYaziData.kategori,
      icerik: editYaziData.icerik.trim(),
      kapak_url: editYaziData.kapak_url.trim() || null
    }).eq('id', selectedYazi.id);

    if (!error) {
      const guncel = {
        ...selectedYazi,
        baslik: editYaziData.baslik.trim(),
        kategori: editYaziData.kategori,
        icerik: editYaziData.icerik.trim(),
        kapak_url: editYaziData.kapak_url.trim() || null
      };
      setYazilar(yazilar.map(y => y.id === selectedYazi.id ? guncel : y));
      setSelectedYazi(guncel);
      setIsEditingYazi(false);
      alert('Metin güncellendi.');
    } else {
      alert('Hata: ' + error.message);
    }
  };

  // --- DERGİ FONKSİYONLARI ---
  async function dergiKaydet(e) {
    e.preventDefault();
    if (duzenlenenDergiId) {
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
      tema_aciklama: d.tema_aciklama || d.aciklama || '',
      kapak_url: d.kapak_url || '',
      pdf_url: d.pdf_url || '',
      durum: d.durum || 'hazirlaniyor'
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
      ad_soyad: duzenlenenYazar.ad_soyad.trim(),
      universite: duzenlenenYazar.universite?.trim() || null,
      bolum: duzenlenenYazar.bolum?.trim() || null,
      instagram: duzenlenenYazar.instagram?.replace('@', '').trim() || null,
      biyografi: duzenlenenYazar.biyografi?.trim() || null,
      pin: duzenlenenYazar.pin?.trim() || null
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

  // 1923 GİRİŞ KİLİDİ
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F9FA]">
        <div className="glass-card p-8 sm:p-10 max-w-sm w-full text-center border border-white/90 shadow-2xl">
          <span className="text-[10px] uppercase tracking-widest text-[#74112f] font-black bg-[#74112f]/10 px-3 py-1 rounded-full">
            Editör Girişi
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-3 mb-6">ZEMİN Masa</h1>
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
            <button type="submit" className="w-full bg-[#32127a] text-white py-3 rounded-xl text-xs font-bold tracking-wider hover:bg-[#74112f] transition-all">
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

  // Sayı Hesaplamaları
  const duzenlemeBekleyenler = yazilar.filter(y => y.durum === 'beklemede' && y.duzeltme_notu);
  const yeniBasvurular = yazilar.filter(y => y.durum === 'beklemede' && !y.duzeltme_notu);

  // Metin Filtreleme Mantığı
  const filtrelenmisYazilar = yazilar.filter(y => {
    let durumUygun = true;
    if (yaziDurumFiltre === 'duzenleme') {
      durumUygun = y.durum === 'beklemede' && Boolean(y.duzeltme_notu);
    } else if (yaziDurumFiltre === 'beklemede') {
      durumUygun = y.durum === 'beklemede' && !y.duzeltme_notu;
    } else if (yaziDurumFiltre !== 'tumu') {
      durumUygun = y.durum === yaziDurumFiltre;
    }

    const kategoriUygun = yaziKategoriFiltre === 'tumu' ? true : y.kategori === yaziKategoriFiltre;
    const aramaUygun = aramaMetni.trim() === ''
      ? true
      : (y.baslik?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
         y.yazarlar?.ad_soyad?.toLowerCase().includes(aramaMetni.toLowerCase()));

    return durumUygun && kategoriUygun && aramaUygun;
  });

  // Yazar Filtreleme
  const filtrelenmisYazarlar = yazarlar.filter(yz => {
    if (!yazarAramaMetni.trim()) return true;
    const q = yazarAramaMetni.toLowerCase();
    return (
      yz.ad_soyad?.toLowerCase().includes(q) ||
      yz.universite?.toLowerCase().includes(q) ||
      yz.bolum?.toLowerCase().includes(q) ||
      yz.instagram?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        
        {/* ÜST BAR */}
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
              { id: 'yazilar', label: `Metinler (${yazilar.length})`, uyari: duzenlemeBekleyenler.length + yeniBasvurular.length },
              { id: 'dergiler', label: `Dergiler (${dergiler.length})` },
              { id: 'yazarlar', label: `Yazarlar (${yazarlar.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#32127a] text-white shadow-sm' : 'bg-white/60 text-gray-700 hover:bg-white'
                }`}
              >
                {tab.label}
                {tab.uyari > 0 && (
                  <span className="ml-1.5 bg-[#74112f] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.uyari}
                  </span>
                )}
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
            {/* 1. SEKME: METİNLER MASASI */}
            {activeTab === 'yazilar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SOL: FİLTRELER VE LİSTE */}
                <div className="lg:col-span-5 space-y-3">
                  
                  {/* Arama */}
                  <input
                    type="text"
                    placeholder="Başlık veya yazar ara..."
                    value={aramaMetni}
                    onChange={(e) => setAramaMetni(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#32127a]"
                  />

                  {/* Durum Sekmeleri (Düzenleme Ayrı Sekme) */}
                  <div className="grid grid-cols-5 gap-1 p-1 glass-panel rounded-2xl bg-white/50 text-[10px] font-bold">
                    <button
                      onClick={() => setYaziDurumFiltre('duzenleme')}
                      className={`py-1.5 rounded-xl transition-all relative ${
                        yaziDurumFiltre === 'duzenleme' ? 'bg-[#74112f] text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Düzenleme {duzenlemeBekleyenler.length > 0 && `(${duzenlemeBekleyenler.length})`}
                    </button>
                    <button
                      onClick={() => setYaziDurumFiltre('beklemede')}
                      className={`py-1.5 rounded-xl transition-all ${
                        yaziDurumFiltre === 'beklemede' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Yeni {yeniBasvurular.length > 0 && `(${yeniBasvurular.length})`}
                    </button>
                    <button
                      onClick={() => setYaziDurumFiltre('onaylandi')}
                      className={`py-1.5 rounded-xl transition-all ${
                        yaziDurumFiltre === 'onaylandi' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Yayında
                    </button>
                    <button
                      onClick={() => setYaziDurumFiltre('reddedildi')}
                      className={`py-1.5 rounded-xl transition-all ${
                        yaziDurumFiltre === 'reddedildi' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Red
                    </button>
                    <button
                      onClick={() => setYaziDurumFiltre('tumu')}
                      className={`py-1.5 rounded-xl transition-all ${
                        yaziDurumFiltre === 'tumu' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Tümü
                    </button>
                  </div>

                  {/* Kategori Filtresi */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {['tumu', 'Felsefe', 'Sosyoloji', 'Psikoloji'].map(kat => (
                      <button
                        key={kat}
                        onClick={() => setYaziKategoriFiltre(kat)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                          yaziKategoriFiltre === kat
                            ? 'bg-[#00a693] text-white border-[#00a693]'
                            : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white'
                        }`}
                      >
                        {kat === 'tumu' ? 'Tüm Alanlar' : kat}
                      </button>
                    ))}
                  </div>

                  {/* Metin Listesi */}
                  <div className="space-y-2 max-h-[64vh] overflow-y-auto pr-1">
                    {filtrelenmisYazilar.length === 0 ? (
                      <div className="glass-card p-6 text-center text-xs text-gray-400">Bu sekmede metin bulunmuyor.</div>
                    ) : (
                      filtrelenmisYazilar.map(y => (
                        <div
                          key={y.id}
                          onClick={() => { setSelectedYazi(y); setIsEditingYazi(false); }}
                          className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                            selectedYazi?.id === y.id ? 'bg-white border-[#32127a] shadow-md' : 'glass-card border-white/60 hover:bg-white/80'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold uppercase text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                              {y.kategori}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {y.duzeltme_notu && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#74112f] text-white">
                                  Düzenleme Talebi
                                </span>
                              )}
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                                y.durum === 'onaylandi' ? 'bg-emerald-100 text-emerald-800' : y.durum === 'reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {y.durum}
                              </span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{y.baslik}</h3>
                          <p className="text-[10px] text-gray-500">{y.yazarlar?.ad_soyad} {y.yazarlar?.universite ? `— ${y.yazarlar.universite}` : ''}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SAĞ: DETAY VE İNCELEME */}
                <div className="lg:col-span-7">
                  {selectedYazi ? (
                    <div className="glass-card p-6 border border-white/90 shadow-xl space-y-4">
                      
                      {/* Üst Aksiyon Butonları */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#74112f] uppercase">Metin No: #{selectedYazi.id}</span>
                          <h2 className="text-base sm:text-lg font-black text-gray-900 truncate">{selectedYazi.baslik}</h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => yaziDurumGuncelle(selectedYazi.id, 'onaylandi')}
                            className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-700 shadow-xs"
                          >
                            Yayına Al
                          </button>
                          <button
                            onClick={() => yaziDurumGuncelle(selectedYazi.id, 'beklemede')}
                            className="bg-amber-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-amber-600 shadow-xs"
                          >
                            Beklemeye Al
                          </button>
                          <button
                            onClick={() => yaziDurumGuncelle(selectedYazi.id, 'reddedildi')}
                            className="bg-rose-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-rose-700 shadow-xs"
                          >
                            Reddet
                          </button>
                          <button
                            onClick={() => handleYaziDuzenleAc(selectedYazi)}
                            className="bg-[#32127a] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#74112f] shadow-xs"
                          >
                            Düzelt
                          </button>
                          <button
                            onClick={() => yaziSil(selectedYazi.id)}
                            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-rose-100 hover:text-rose-700 shadow-xs"
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      {/* YAZARIN DÜZENLEME AÇIKLAMASI */}
                      {selectedYazi.duzeltme_notu && (
                        <div className="p-3.5 rounded-xl bg-[#74112f]/10 border border-[#74112f]/30">
                          <span className="text-[10px] font-black uppercase text-[#74112f] block mb-0.5">
                            Yazarın Düzenleme Notu
                          </span>
                          <p className="text-xs text-gray-900 font-semibold italic">
                            “{selectedYazi.duzeltme_notu}”
                          </p>
                        </div>
                      )}

                      {/* Yazar Bilgisi & Dergi Atama */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/70 border border-white text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{selectedYazi.yazarlar?.ad_soyad || 'İsimsiz'}</p>
                          <p className="text-[11px] text-gray-500">
                            {selectedYazi.yazarlar?.universite || 'Üniversite Yok'} {selectedYazi.yazarlar?.bolum ? `— ${selectedYazi.yazarlar.bolum}` : ''}
                          </p>
                          <div className="pt-1 flex items-center gap-3">
                            <span className="font-mono text-[#74112f] font-bold text-[10px]">PIN: {selectedYazi.yazarlar?.pin || '---'}</span>
                            {selectedYazi.yazarlar?.instagram && (
                              <span className="text-[#00a693] font-bold">@{selectedYazi.yazarlar.instagram}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#32127a] uppercase block mb-1">Dönemsel Dergiye Ata</label>
                          <select
                            value={selectedYazi.dergi_id || ''}
                            onChange={(e) => dergiyeAta(selectedYazi.id, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none"
                          >
                            <option value="">Dergiye Bağlı Değil (Yalnızca Web)</option>
                            {dergiler.map(d => (
                              <option key={d.id} value={d.id}>Sayı {d.sayi_no}: {d.baslik}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* EDİTÖR DÜZENLEME FORMU VEYA OKUMA ALANI */}
                      {isEditingYazi ? (
                        <form onSubmit={handleYaziDuzenleKaydet} className="space-y-3 pt-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Kategori</label>
                              <select
                                value={editYaziData.kategori}
                                onChange={(e) => setEditYaziData({ ...editYaziData, kategori: e.target.value })}
                                className="w-full bg-white border rounded-xl p-2 text-xs font-bold"
                              >
                                <option value="Felsefe">Felsefe</option>
                                <option value="Sosyoloji">Sosyoloji</option>
                                <option value="Psikoloji">Psikoloji</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Başlık</label>
                              <input
                                type="text"
                                required
                                value={editYaziData.baslik}
                                onChange={(e) => setEditYaziData({ ...editYaziData, baslik: e.target.value })}
                                className="w-full bg-white border rounded-xl p-2 text-xs font-bold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Metin İçeriği</label>
                            <textarea
                              rows={12}
                              required
                              value={editYaziData.icerik}
                              onChange={(e) => setEditYaziData({ ...editYaziData, icerik: e.target.value })}
                              className="w-full bg-white border rounded-xl p-3 text-xs font-serif leading-relaxed"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setIsEditingYazi(false)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-700"
                            >
                              İptal
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#32127a] text-white"
                            >
                              Kaydet
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="font-serif text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-white/90 border max-h-[46vh] overflow-y-auto text-gray-800">
                          {selectedYazi.icerik}
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center text-gray-400 text-xs">
                      İncelemek veya onaylamak için sol listeden bir metin seçin.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. SEKME: DERGİLER */}
            {activeTab === 'dergiler' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
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
                          <option value="yayinda">Yayında</option>
                        </select>
                      </div>

                      <button type="submit" className="w-full bg-[#00a693] hover:bg-[#32127a] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
                        {duzenlenenDergiId ? 'Değişiklikleri Kaydet' : 'Sayıyı Oluştur'}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">Mevcut Dergi Sayıları</h2>
                  {dergiler.map(d => (
                    <div key={d.id} className="glass-card p-4 border border-white/80 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#74112f] text-white px-2 py-0.5 rounded">
                            Sayı {d.sayi_no}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${d.durum === 'yayinda' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {d.durum}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900">{d.baslik}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{d.tema_aciklama || d.aciklama}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => dergiDuzenleBaslat(d)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                          Düzenle
                        </button>
                        <button onClick={() => dergiSil(d.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 3. SEKME: YAZARLAR (KOMPAKT LİSTE & CANLI ARAMA) */}
            {activeTab === 'yazarlar' && (
              <div className="space-y-4">
                
                {/* Üst Arama ve Başlık Barı */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
                      Kayıtlı Yazarlar & PIN Masası ({filtrelenmisYazarlar.length})
                    </h2>
                  </div>
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Yazar, üniversite veya mahlas ara..."
                      value={yazarAramaMetni}
                      onChange={(e) => setYazarAramaMetni(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#32127a]"
                    />
                  </div>
                </div>

                {/* Kompakt Liste Formatı */}
                <div className="space-y-2">
                  {filtrelenmisYazarlar.length === 0 ? (
                    <div className="glass-card p-8 text-center text-xs text-gray-400">
                      Aramanıza uygun yazar bulunamadı.
                    </div>
                  ) : (
                    filtrelenmisYazarlar.map(yzr => {
                      const yayinlanmisSayisi = yzr.yazilar?.filter(y => y.durum === 'onaylandi').length || 0;
                      const toplamSayisi = yzr.yazilar?.length || 0;

                      return (
                        <div
                          key={yzr.id}
                          className="glass-card p-3 rounded-2xl border border-white/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-white transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-[10px] font-black bg-[#74112f]/10 text-[#74112f] px-2.5 py-1 rounded-xl border border-[#74112f]/20">
                              PIN: {yzr.pin || 'Yok'}
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-bold text-xs text-gray-900 truncate">{yzr.ad_soyad}</h3>
                              <p className="text-[10px] text-gray-500 truncate">
                                {yzr.universite || 'Üniversite yok'} {yzr.bolum ? `• ${yzr.bolum}` : ''}
                                {yzr.instagram && <span className="ml-2 text-[#00a693] font-semibold">@{yzr.instagram}</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-center">
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-xl whitespace-nowrap">
                              Metin: {toplamSayisi} ({yayinlanmisSayisi} Yayında)
                            </span>
                            <button
                              onClick={() => setDuzenlenenYazar(yzr)}
                              className="bg-gray-900 hover:bg-[#32127a] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => yazarSil(yzr.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* YAZAR DÜZENLEME MODALI */}
                {duzenlenenYazar && (
                  <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-white/90 shadow-2xl relative">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <h3 className="text-sm font-black text-gray-900">Yazarı Düzenle</h3>
                        <button onClick={() => setDuzenlenenYazar(null)} className="text-gray-400 hover:text-gray-700 text-sm font-bold">
                          ✕
                        </button>
                      </div>

                      <form onSubmit={yazarGuncelle} className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 uppercase">İsim / Mahlas</label>
                          <input required type="text" value={duzenlenenYazar.ad_soyad} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, ad_soyad: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs font-bold" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Üniversite</label>
                            <input type="text" value={duzenlenenYazar.universite || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, universite: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Bölüm</label>
                            <input type="text" value={duzenlenenYazar.bolum || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, bolum: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Instagram</label>
                            <input type="text" value={duzenlenenYazar.instagram || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, instagram: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#74112f] uppercase">4 Haneli PIN</label>
                            <input type="text" value={duzenlenenYazar.pin || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, pin: e.target.value })} className="w-full bg-white border border-[#74112f]/40 rounded-xl p-2 text-xs font-mono font-bold text-[#74112f]" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Biyografi</label>
                          <textarea rows={3} value={duzenlenenYazar.biyografi || ''} onChange={(e) => setDuzenlenenYazar({ ...duzenlenenYazar, biyografi: e.target.value })} className="w-full bg-white border rounded-xl p-2 text-xs" />
                        </div>

                        <button type="submit" className="w-full bg-[#32127a] hover:bg-[#74112f] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm mt-2">
                          Kaydet
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          </>
        )}

      </main>
    </div>
  );
}

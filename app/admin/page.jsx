'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('yazilar'); // 'yazilar' | 'dergiler' | 'yazarlar'
  const [yazilar, setYazilar] = useState([]);
  const [dergiler, setDergiler] = useState([]);
  const [yazarlar, setYazarlar] = useState([]);
  const [selectedYazi, setSelectedYazi] = useState(null);
  const [loading, setLoading] = useState(true);

  // Yeni Dergi Formu
  const [yeniDergi, setYeniDergi] = useState({
    sayi_no: '',
    baslik: '',
    tema_aciklama: '',
    kapak_url: '',
    pdf_url: '',
    durum: 'hazirlaniyor'
  });

  async function loadData() {
    setLoading(true);
    
    // 1. Yazıları Çek
    const { data: yaziData } = await supabase
      .from('yazilar')
      .select('*, yazarlar(*)')
      .order('olusturulma_tarihi', { ascending: false });
    
    // 2. Dergileri Çek
    const { data: dergiData } = await supabase
      .from('dergiler')
      .select('*')
      .order('sayi_no', { ascending: false });

    // 3. Yazarları Çek
    const { data: yazarData } = await supabase
      .from('yazarlar')
      .select('*')
      .order('ad_soyad', { ascending: true });

    if (yaziData) {
      setYazilar(yaziData);
      if (!selectedYazi && yaziData.length > 0) {
        setSelectedYazi(yaziData[0]);
      }
    }
    if (dergiData) setDergiler(dergiData);
    if (yazarData) setYazarlar(yazarData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Yazı Durumu Güncelleme
  async function durumGuncelle(id, yeniDurum) {
    const { error } = await supabase
      .from('yazilar')
      .update({ durum: yeniDurum })
      .eq('id', id);

    if (!error) {
      setYazilar(yazilar.map(y => y.id === id ? { ...y, durum: yeniDurum } : y));
      if (selectedYazi?.id === id) {
        setSelectedYazi({ ...selectedYazi, durum: yeniDurum });
      }
    } else {
      alert('Hata: ' + error.message);
    }
  }

  // Yazıyı Dergi Sayısına Atama
  async function dergiyeAta(yaziId, dergiId) {
    const { error } = await supabase
      .from('yazilar')
      .update({ dergi_id: dergiId || null })
      .eq('id', yaziId);

    if (!error) {
      setYazilar(yazilar.map(y => y.id === yaziId ? { ...y, dergi_id: dergiId || null } : y));
      if (selectedYazi?.id === yaziId) {
        setSelectedYazi({ ...selectedYazi, dergi_id: dergiId || null });
      }
    } else {
      alert('Dergi atama hatası: ' + error.message);
    }
  }

  // Yeni Dergi Ekleme
  async function dergiEkle(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('dergiler')
      .insert([{
        sayi_no: parseInt(yeniDergi.sayi_no),
        baslik: yeniDergi.baslik,
        tema_aciklama: yeniDergi.tema_aciklama,
        kapak_url: yeniDergi.kapak_url,
        pdf_url: yeniDergi.pdf_url,
        durum: yeniDergi.durum
      }]);

    if (!error) {
      alert('Dergi sayısı başarıyla oluşturuldu.');
      setYeniDergi({ sayi_no: '', baslik: '', tema_aciklama: '', kapak_url: '', pdf_url: '', durum: 'hazirlaniyor' });
      loadData();
    } else {
      alert('Hata: ' + error.message);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        
        {/* ÜST PANEL BAŞLIĞI & TABLAR */}
        <header className="glass-panel p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/80 shadow-md">
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
              { id: 'yazilar', label: 'Yazı İnceleme' },
              { id: 'dergiler', label: 'Dergi Yönetimi' },
              { id: 'yazarlar', label: 'Yazar Listesi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#32127a] text-white shadow-sm'
                    : 'bg-white/60 text-gray-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-xs font-bold text-gray-500">Panel yükleniyor...</div>
        ) : (
          <>
            {/* 1. SEVİYE: YAZI İNCELEME SEKMESİ */}
            {activeTab === 'yazilar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sol Liste: Gelen Başvurular */}
                <div className="lg:col-span-4 space-y-3 max-h-[78vh] overflow-y-auto pr-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 px-1 block">
                    Gelen Metinler ({yazilar.length})
                  </span>
                  
                  {yazilar.map((y) => (
                    <div
                      key={y.id}
                      onClick={() => setSelectedYazi(y)}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                        selectedYazi?.id === y.id
                          ? 'bg-white border-[#32127a] shadow-md'
                          : 'glass-card border-white/60 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                          {y.kategori}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          y.durum === 'onaylandi' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : y.durum === 'reddedildi'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {y.durum}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 mb-1">
                        {y.baslik}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {y.yazarlar?.ad_soyad} — {y.yazarlar?.universite}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sağ Alan: Okuma Masası & Kontrol */}
                <div className="lg:col-span-8">
                  {selectedYazi ? (
                    <div className="glass-card p-6 md:p-8 border border-white/90 shadow-xl space-y-6">
                      
                      {/* Üst İşlem Barı */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#74112f] block">
                            Başvuru İnceleme
                          </span>
                          <h2 className="text-xl font-black text-gray-900 mt-0.5">
                            {selectedYazi.baslik}
                          </h2>
                        </div>

                        {/* Onay/Red Butonları */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => durumGuncelle(selectedYazi.id, 'onaylandi')}
                            className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-700 shadow-sm"
                          >
                            Yayına Al
                          </button>
                          <button
                            onClick={() => durumGuncelle(selectedYazi.id, 'reddedildi')}
                            className="bg-rose-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-rose-700 shadow-sm"
                          >
                            Reddet
                          </button>
                          <button
                            onClick={() => durumGuncelle(selectedYazi.id, 'beklemede')}
                            className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-300"
                          >
                            Beklemeye Al
                          </button>
                        </div>
                      </div>

                      {/* Yazar Bilgileri & Dergi Seçimi */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/60 border border-white">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Yazar Bilgisi</span>
                          <p className="text-sm font-bold text-gray-900">{selectedYazi.yazarlar?.ad_soyad}</p>
                          <p className="text-xs text-gray-600">{selectedYazi.yazarlar?.universite} — {selectedYazi.yazarlar?.bolum}</p>
                          <div className="pt-1 flex items-center gap-3 text-xs">
                            <span className="font-mono font-bold text-[#74112f]">PIN: {selectedYazi.yazarlar?.pin || 'Belirlenmedi'}</span>
                            {selectedYazi.yazarlar?.instagram && (
                              <span className="text-[#00a693] font-bold">@{selectedYazi.yazarlar.instagram}</span>
                            )}
                          </div>
                        </div>

                        {/* Dergi Sayısına Ekleme Dropdown */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#32127a] uppercase">Dergi Sayısına Dahil Et</span>
                          <select
                            value={selectedYazi.dergi_id || ''}
                            onChange={(e) => dergiyeAta(selectedYazi.id, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-800 outline-none focus:border-[#32127a]"
                          >
                            <option value="">Dergi Sayısına Bağlı Değil</option>
                            {dergiler.map((d) => (
                              <option key={d.id} value={d.id}>
                                Sayı {d.sayi_no}: {d.baslik}
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-gray-400">Seçildiğinde yazarın profilinde ve makalede dergi sayısı görünür.</p>
                        </div>
                      </div>

                      {/* Makale Metni */}
                      <div className="font-serif text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap p-5 rounded-2xl bg-white/90 border border-gray-200/80 max-h-[50vh] overflow-y-auto">
                        {selectedYazi.icerik}
                      </div>

                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center text-gray-400 text-sm">
                      İncelemek için sol listeden bir metin seçin.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. SEVİYE: DERGİ YÖNETİMİ SEKMESİ */}
            {activeTab === 'dergiler' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sol: Yeni Dergi Formu */}
                <div className="lg:col-span-5">
                  <div className="glass-card p-6 border border-white/90 shadow-xl">
                    <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Yeni Dergi Sayısı Oluştur
                    </h2>
                    
                    <form onSubmit={dergiEkle} className="space-y-3.5">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Sayı No</label>
                          <input 
                            required 
                            type="number" 
                            placeholder="01" 
                            value={yeniDergi.sayi_no}
                            onChange={(e) => setYeniDergi({ ...yeniDergi, sayi_no: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Sayı Başlığı / Tema</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Bellek ve Zaman" 
                            value={yeniDergi.baslik}
                            onChange={(e) => setYeniDergi({ ...yeniDergi, baslik: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Tema Açıklaması</label>
                        <textarea 
                          rows={3}
                          placeholder="Bu sayının editoryal çerçevesi..." 
                          value={yeniDergi.tema_aciklama}
                          onChange={(e) => setYeniDergi({ ...yeniDergi, tema_aciklama: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Kapak Görsel URL</label>
                        <input 
                          type="text" 
                          placeholder="https://..." 
                          value={yeniDergi.kapak_url}
                          onChange={(e) => setYeniDergi({ ...yeniDergi, kapak_url: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">PDF Dosya URL</label>
                        <input 
                          type="text" 
                          placeholder="https://..." 
                          value={yeniDergi.pdf_url}
                          onChange={(e) => setYeniDergi({ ...yeniDergi, pdf_url: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Durum</label>
                        <select 
                          value={yeniDergi.durum}
                          onChange={(e) => setYeniDergi({ ...yeniDergi, durum: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold"
                        >
                          <option value="hazirlaniyor">Hazırlanıyor</option>
                          <option value="yayinda">Yayında (Sitede Görünür)</option>
                        </select>
                      </div>

                      <button type="submit" className="w-full bg-[#32127a] text-white py-3 rounded-xl text-xs font-bold shadow-md">
                        Dergi Sayısını Kaydet
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sağ: Mevcut Dergiler Listesi */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 px-1 block">
                    Mevcut Sayılar ({dergiler.length})
                  </span>

                  {dergiler.map((d) => (
                    <div key={d.id} className="glass-card p-4 flex items-center justify-between gap-4 border border-white/70">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-[#74112f] text-white font-black flex items-center justify-center text-sm">
                          {d.sayi_no}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-gray-900">{d.baslik}</h3>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            d.durum === 'yayinda' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {d.durum}
                          </span>
                        </div>
                      </div>

                      {d.pdf_url && (
                        <a href={d.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#32127a] hover:underline">
                          PDF ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 3. SEVİYE: YAZAR LİSTESİ SEKMESİ */}
            {activeTab === 'yazarlar' && (
              <div className="glass-card p-6 border border-white/90 shadow-xl">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-4 block">
                  Kayıtlı Yazar Havuzu ({yazarlar.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {yazarlar.map((yz) => (
                    <div key={yz.id} className="p-3 rounded-xl bg-white/70 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-xs text-gray-900">{yz.ad_soyad}</h4>
                        <span className="font-mono text-[10px] font-bold text-[#74112f] bg-[#74112f]/10 px-1.5 py-0.5 rounded">
                          PIN: {yz.pin || 'Yok'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{yz.universite} — {yz.bolum}</p>
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

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// Türkçe karakter destekli slug üretici
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    // Temel Zorunluluk Kontrolleri (Yalnızca 5 Alan)
    if (!adSoyad.trim() || !pin.trim() || !kategori || !baslik.trim() || !icerik.trim()) {
      setStatus({ type: 'error', msg: 'Lütfen zorunlu alanları (İsim/Mahlas, PIN, Kategori, Başlık, Metin) doldurun.' });
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

      // 1. Yazar Veritabanında Var mı Kontrol Et
      const { data: mevcutYazarlar, error: yazarSorguHata } = await supabase
        .from('yazarlar')
        .select('*')
        .ilike('ad_soyad', temizIsim);

      if (yazarSorguHata) throw yazarSorguHata;

      let yazarId = null;

      if (mevcutYazarlar && mevcutYazarlar.length > 0) {
        const mevcutYazar = mevcutYazarlar[0];

        // PIN Eşleşme Kontrolü
        if (mevcutYazar.pin && String(mevcutYazar.pin) !== temizPin) {
          setStatus({
            type: 'error',
            msg: 'Bu isim/mahlas daha önce kullanılmış ancak girdiğiniz PIN hatalı. Doğru PIN kodunuzu girin veya farklı bir isim belirleyin.'
          });
          setLoading(false);
          return;
        }

        yazarId = mevcutYazar.id;

        // Eğer yeni biyografi/üniversite girilmişse mevcut profili zenginleştir (boş bırakıldıysa eskisine dokunma)
        const guncelleme = {};
        if (universite.trim()) guncelleme.universite = universite.trim();
        if (bolum.trim()) guncelleme.bolum = bolum.trim();
        if (biyografi.trim()) guncelleme.biyografi = biyografi.trim();
        if (instagram.trim()) guncelleme.instagram = instagram.trim().replace('@', '');

        if (Object.keys(guncelleme).length > 0) {
          await supabase.from('yazarlar').update(guncelleme).eq('id', yazarId);
        }
      } else {
        // 2. Yeni Yazar Oluştur
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

      // 3. Metni Gönder (Durum: Onay Bekliyor)
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
        msg: 'Metniniz başarıyla gönderildi! Editör onayından geçtikten sonra web arşivinde ve yazar profilinizde yayımlanacaktır.'
      });

      // Formu temizle
      setBaslik('');
      setIcerik('');
      setKapakUrl('');
    } catch (err) {
      setStatus({ type: 'error', msg: 'Bir hata oluştu: ' + (err.message || 'Lütfen tekrar deneyin.') });
    } finally {
      setLoading(false);
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

        {/* BAŞLIK VE AÇIKLAMA */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#74112f] bg-[#74112f]/10 px-3 py-1 rounded-full">
            Açık Masa
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
            Düşünceni Zemine Bırak
          </h1>
          <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
            İster kendi adını ister mahlasını kullan. Öğrenci olma şartı yoktur; yalnızca 5 temel alan zorunludur.
          </p>
        </div>

        {/* FORM GÖVDESİ */}
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 border border-white/90 shadow-xl space-y-6">
          
          {status.msg && (
            <div className={`p-4 rounded-2xl text-xs font-bold ${status.type === 'success' ? 'bg-[#00a693]/15 text-[#00a693] border border-[#00a693]/30' : 'bg-[#74112f]/15 text-[#74112f] border border-[#74112f]/30'}`}>
              {status.msg}
            </div>
          )}

          {/* YAZAR KİMLİĞİ (ZORUNLU 2 ALAN) */}
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
                  placeholder="Örn: Deniz Yılmaz veya Mahlasınız"
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
                <span className="text-[10px] text-gray-500 mt-1 block">Tekrar yazı gönderirken profilini doğrulamak için kullanılır.</span>
              </div>
            </div>

            {/* İSTEĞE BAĞLI ALANLAR */}
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

          {/* METİN DETAYLARI (ZORUNLU 3 ALAN) */}
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
      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-gray-500">
          ZEMİN — Açık Düşünce İnisiyatifi © 2026
        </div>
      </footer>
    </div>
  );
}

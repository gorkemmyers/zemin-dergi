'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function BasvuruPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    ad_soyad: '',
    universite: '',
    bolum: '',
    instagram: '',
    biyografi: '',
    baslik: '',
    kategori: 'Felsefe',
    icerik: '',
    kapak_url: '',
    pin: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.ad_soyad.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const yaziSlug = formData.baslik.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const { data: yazar, error: yazarErr } = await supabase
      .from('yazarlar')
      .insert([{
        ad_soyad: formData.ad_soyad,
        slug: slug,
        universite: formData.universite,
        bolum: formData.bolum,
        instagram: formData.instagram.replace('@', ''),
        biyografi: formData.biyografi,
        pin: formData.pin
      }])
      .select()
      .single();

    if (yazarErr) {
      alert('Hata oluştu: ' + yazarErr.message);
      setLoading(false);
      return;
    }

    const { error: yaziErr } = await supabase
      .from('yazilar')
      .insert([{
        yazar_id: yazar.id,
        baslik: formData.baslik,
        slug: yaziSlug,
        kategori: formData.kategori,
        icerik: formData.icerik,
        kapak_url: formData.kapak_url || null,
        durum: 'beklemede'
      }]);

    setLoading(false);
    if (!yaziErr) {
      setSuccess(true);
    } else {
      alert('Yazı iletilirken hata: ' + yaziErr.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-16">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Açık Düşünce
              </span>
              <Link 
                href="/basvuru" 
                className="bg-[#32127a] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wider hover:bg-[#32127a]/85 shadow-md shadow-[#32127a]/20 transition-all"
              >
                METİN GÖNDER
              </Link>
            </div>
          </div>

          <nav className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 pt-2.5 px-2 overflow-x-auto whitespace-nowrap text-xs sm:text-sm font-bold text-gray-700 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="hover:text-[#00a693] transition-colors flex-shrink-0">Ana Sayfa</Link>
            <Link href="/yazilar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        {success ? (
          <div className="glass-card p-10 max-w-lg mx-auto text-center my-12 border border-white">
            <span className="text-xs uppercase tracking-widest text-[#00a693] font-bold">Başvuru Alındı</span>
            <h1 className="text-3xl font-black text-gray-900 mt-2 mb-3">Metniniz İncelemede</h1>
            <p className="text-sm text-gray-600 font-medium mb-6 leading-relaxed">
              Yazınız editoryal okumadan geçtikten sonra yayına alınacak ve yazar profiliniz aktifleşecektir.
            </p>
            <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-bold">
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="glass-card p-6 md:p-10 border border-white/80 shadow-xl">
            <header className="border-b border-gray-200/60 pb-5 mb-6">
              <span className="text-xs uppercase tracking-widest text-[#00a693] font-bold">Yayın Başvurusu</span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-1">Düşünceni Arşive Dahil Et</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Metinler editoryal kontrolden geçtikten sonra yazar adıyla yayına alınır.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Ad Soyad *</label>
                  <input required type="text" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                    onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Instagram</label>
                    <input type="text" placeholder="@" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#74112f] mb-1">Yazar PIN *</label>
                    <input required type="password" maxLength={6} placeholder="Örn: 1984" className="w-full bg-white/95 border border-[#74112f]/40 rounded-xl p-3 text-sm text-gray-900 font-bold focus:outline-none focus:border-[#74112f] shadow-sm" 
                      onChange={(e) => setFormData({...formData, pin: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Üniversite *</label>
                  <input required type="text" placeholder="örn. Anadolu Üniversitesi" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                    onChange={(e) => setFormData({...formData, universite: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Bölüm *</label>
                  <input required type="text" placeholder="örn. Felsefe 3. Sınıf" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                    onChange={(e) => setFormData({...formData, bolum: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Kısa Yazar Biyografisi *</label>
                <input required type="text" placeholder="İlgi alanların veya çalışma konun hakkında 1-2 cümle" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                  onChange={(e) => setFormData({...formData, biyografi: e.target.value})} />
              </div>

              <div className="border-t border-gray-200/60 pt-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Metin Başlığı *</label>
                    <input required type="text" className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-bold focus:outline-none focus:border-[#74112f] shadow-sm" 
                      onChange={(e) => setFormData({...formData, baslik: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Disiplin</label>
                    <select className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-bold focus:outline-none focus:border-[#74112f] shadow-sm"
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}>
                      <option value="Felsefe">Felsefe</option>
                      <option value="Sosyoloji">Sosyoloji</option>
                      <option value="Psikoloji">Psikoloji</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">
                    Kapak Görseli Bağlantısı <span className="text-gray-400 font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/... (Görsel kartın solunda akıcı arka plan olur)" 
                    className="w-full bg-white/95 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#74112f] shadow-sm" 
                    onChange={(e) => setFormData({...formData, kapak_url: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Metin ve Kaynakça *</label>
                  <textarea required rows={10} placeholder="Yazınızı ve kaynakçanızı buraya yapıştırın..." className="w-full bg-white/95 border border-gray-200 rounded-xl p-4 text-sm font-serif leading-relaxed text-gray-900 focus:outline-none focus:border-[#74112f] shadow-sm" 
                    onChange={(e) => setFormData({...formData, icerik: e.target.value})} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-3">
                <input 
                  required 
                  type="checkbox" 
                  id="telif_onay" 
                  className="mt-1 w-4 h-4 rounded accent-[#74112f] cursor-pointer flex-shrink-0" 
                />
                <label htmlFor="telif_onay" className="text-xs text-gray-600 font-medium leading-relaxed select-none cursor-pointer">
                  Bu metnin fikri mülkiyeti şahsıma aittir. Metni göndererek <strong>ZEMİN</strong> platformuna açık arşivde ve tematik e-dergi sayılarında adıma atıfla yayımlama ve dağıtma hakkı verdiğimi onaylıyorum.
                </label>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#32127a] text-white py-3.5 rounded-2xl uppercase tracking-wider text-xs font-bold hover:bg-[#32127a]/90 transition-all shadow-md">
                {loading ? 'İletiliyor...' : 'Yazıyı Gönder'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

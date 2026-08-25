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
    pin: '', // PIN state'i eklendi
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.ad_soyad.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const yaziSlug = formData.baslik.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // 1. Yazar kaydı oluştur
    const { data: yazar, error: yazarErr } = await supabase
      .from('yazarlar')
      .insert([{
        ad_soyad: formData.ad_soyad,
        slug: slug,
        universite: formData.universite,
        bolum: formData.bolum,
        instagram: formData.instagram.replace('@', ''),
        biyografi: formData.biyografi,
        pin: formData.pin // Formdan gelen PIN veritabanına gönderiliyor
      }])
      .select()
      .single();

    if (yazarErr) {
      alert('Hata oluştu: ' + yazarErr.message);
      setLoading(false);
      return;
    }

    // 2. Yazıyı kaydet
    const { error: yaziErr } = await supabase
      .from('yazilar')
      .insert([{
        yazar_id: yazar.id,
        baslik: formData.baslik,
        slug: yaziSlug,
        kategori: formData.kategori,
        icerik: formData.icerik,
        durum: 'beklemede'
      }]);

    setLoading(false);
    if (!yaziErr) {
      setSuccess(true);
    } else {
      alert('Yazı iletilirken hata: ' + yaziErr.message);
    }
  };

  if (success) {
    return (
      <main className="min-h-[60vh] max-w-xl mx-auto px-6 py-20 text-center flex flex-col justify-center items-center">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold mb-2">Başvuru Alındı</span>
        <h1 className="font-editorial text-3xl font-bold mb-4 text-[#4E141E]">Metniniz İncelemeye Alındı</h1>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/80 mb-8 max-w-md">
          Yazınız editoryal okumadan geçtikten sonra yayına alınacak ve yazar profiliniz aktifleşecektir.
        </p>
        <Link href="/" className="border border-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
          Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-8">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Yayın Başvurusu</span>
        <h1 className="font-editorial text-4xl font-bold text-[#1A1A1A] mt-2">Düşünceni Arşive Dahil Et</h1>
        <p className="text-xs text-[#1A1A1A]/60 mt-2">Metinler editoryal kontrolden geçtikten sonra yazar adıyla yayına alınır.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Ad Soyad</label>
            <input required type="text" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
              onChange={(e) => setFormData({...formData, ad_soyad: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Instagram</label>
              <input type="text" placeholder="@" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
                onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Yazar PIN *</label>
              <input required type="text" maxLength={4} placeholder="Örn: 1984" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
                onChange={(e) => setFormData({...formData, pin: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Üniversite</label>
            <input required type="text" placeholder="örn. Anadolu Üniversitesi" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
              onChange={(e) => setFormData({...formData, universite: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Bölüm</label>
            <input required type="text" placeholder="örn. Felsefe 3. Sınıf" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
              onChange={(e) => setFormData({...formData, bolum: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Kısa Yazar Biyografisi</label>
          <input required type="text" placeholder="İlgi alanların veya çalışma konun hakkında 1-2 cümle" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
            onChange={(e) => setFormData({...formData, biyografi: e.target.value})} />
        </div>

        <div className="border-t border-[#E3DDD3] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Metin Başlığı</label>
              <input required type="text" className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none" 
                onChange={(e) => setFormData({...formData, baslik: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Disiplin</label>
              <select className="w-full bg-transparent border border-[#E3DDD3] p-3 text-sm focus:border-[#4E141E] outline-none"
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}>
                <option value="Felsefe">Felsefe</option>
                <option value="Sosyoloji">Sosyoloji</option>
                <option value="Psikoloji">Psikoloji</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-[#1A1A1A]/70 mb-1">Metin ve Kaynakça</label>
            <textarea required rows={12} placeholder="Yazınızı ve kaynakçanızı buraya yapıştırın..." className="w-full bg-transparent border border-[#E3DDD3] p-4 text-sm font-editorial leading-relaxed focus:border-[#4E141E] outline-none" 
              onChange={(e) => setFormData({...formData, icerik: e.target.value})} />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input required type="checkbox" id="telif" className="mt-1 accent-[#4E141E]" />
          <label htmlFor="telif" className="text-xs text-[#1A1A1A]/70 leading-normal">
            Bu metnin fikri mülkiyeti şahsıma aittir. Metnin platformda ve e-dergi sayılarında adıma atıfla değiştirilmeden yayımlanmasına izin veriyorum.
          </label>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#4E141E] text-[#F7F5F0] py-4 uppercase tracking-widest text-xs font-semibold hover:opacity-95 transition-opacity">
          {loading ? 'İletiliyor...' : 'Yazıyı Gönder'}
        </button>
      </form>
    </main>
  );
}

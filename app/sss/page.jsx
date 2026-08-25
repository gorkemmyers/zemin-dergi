import Link from 'next/link';

export default function SSSPage() {
  const sorular = [
    {
      soru: 'ZEMİN’e kimler metin gönderebilir?',
      cevap: 'Tüm lisans, yüksek lisans ve doktora öğrencileri felsefe, sosyoloji, psikoloji ve kültür alanındaki özgür deneme, inceleme veya serbest düşünce metinlerini iletebilir.',
    },
    {
      soru: 'Metinler nasıl bir değerlendirmeden geçer?',
      cevap: 'ZEMİN katı bir akademik hakemlik veya sansür mekanizması işletmez. Metnin fikri içeriği, argümanları ve üslubu tamamen yazarın kendi sorumluluğundadır. Editör masası yalnızca biçimsel düzen ve temel yayın etiği kontrolü yapar.',
    },
    {
      soru: 'Yayımlanan bir yazıyı sonradan geri çekebilir miyim?',
      cevap: 'Hayır. ZEMİN kalıcı bir açık düşünce arşividir. Arşive dahil edilen ve yayımlanan metinler arşiv bütünlüğünün korunması adına yayından kaldırılmaz veya geri çekilmez.',
    },
    {
      soru: 'Fikri sorumluluk ve telif kime aittir?',
      cevap: 'Metinlerde savunulan tüm görüşler, yapılan çıkarımlar ve referanslar doğrudan yazarın şahsına aittir. Yazar, kendi düşüncesinin yegane imzacısıdır.',
    },
    {
      soru: 'Aylık seçkilere nasıl dahil olunur?',
      cevap: 'Arşive kabul edilen metinler arasından, o ayın belirlenen dosya konusuna temas eden yazılar editör masası tarafından aylık tematik seçkiye dahil edilir.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12 text-center md:text-left">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Rehber & İlkeler</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">Yayın İlkeleri & SSS</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 leading-relaxed">
          Açık arşiv modeli, yazar sorumluluğu ve yayın standartları hakkında temel bilgiler.
        </p>
      </header>

      <div className="divide-y divide-[#E3DDD3] border-t border-b border-[#E3DDD3]">
        {sorular.map((s, index) => (
          <div key={index} className="py-8 space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">{s.soru}</h2>
            <p className="text-sm text-[#1A1A1A]/75 leading-relaxed">{s.cevap}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 border border-[#E3DDD3] bg-[#E3DDD3]/20 text-center space-y-4">
        <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Düşünceni Arşive Ekle</h3>
        <p className="text-xs text-[#1A1A1A]/70">Fikrini doğrudan paylaşmak ve açık arşivde yerini almak için metnini gönderebilirsin.</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/iletisim" className="border border-[#1A1A1A] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
            İletişim
          </Link>
          <Link href="/basvuru" className="bg-[#4E141E] text-[#F7F5F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:opacity-95">
            + Yazı Gönder
          </Link>
        </div>
      </div>
    </main>
  );
}

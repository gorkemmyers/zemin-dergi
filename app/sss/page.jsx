import Link from 'next/link';

export default function SSSPage() {
  const sorular = [
    {
      soru: 'ZEMİN’e kimler metin gönderebilir?',
      cevap: 'Türkiye’deki ve dünyadaki tüm lisans, yüksek lisans ve doktora öğrencileri felsefe, sosyoloji ve psikoloji alanındaki deneme, inceleme veya eleştiri metinlerini gönderebilir.',
    },
    {
      soru: 'Hakemlik ve değerlendirme süreci nasıl işler?',
      cevap: 'Gönderilen metinler editoryal kurul tarafından kavramsal tutarlılık, özgünlük ve akademik/editoryal üslup kriterlerine göre ortalama 2-5 iş günü içinde incelenir ve yayına alınır.',
    },
    {
      soru: 'Yazıların telif hakları kime aittir?',
      cevap: 'Telif hakları tamamen yazara aittir. ZEMİN açık düşünce ve serbest erişim modelini benimser; yazar metnini dilediği zaman geri çekme veya başka mecralarda yayımlama hakkına sahiptir.',
    },
    {
      soru: 'Aylık seçkilere nasıl dahil olabilirim?',
      cevap: 'Arşive onaylanan metinler arasından, o ayın belirlenen temasına uygun olanlar editörler masası tarafından seçilerek aylık kapak sayısına dahil edilir.',
    },
    {
      soru: 'Yazı uzunluğu ve biçim kuralları nelerdir?',
      cevap: 'Metinlerin 500 ile 3.000 kelime arasında olması, kaynak kullanılan durumlarda metin sonunda sade bir kaynakça belirtilmesi önerilir.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12 text-center md:text-left">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Rehber</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">Sıkça Sorulan Sorular</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 leading-relaxed">
          Yayın politikası, hakemlik masası ve editoryal kriterler hakkında merak edilenler.
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
        <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Başka bir sorun mu var?</h3>
        <p className="text-xs text-[#1A1A1A]/70">Editoryal masaya doğrudan ulaşabilir veya doğrudan metnini iletebilirsin.</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/iletisim" className="border border-[#1A1A1A] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors">
            İletişime Geç
          </Link>
          <Link href="/basvuru" className="bg-[#4E141E] text-[#F7F5F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:opacity-95">
            Metin Gönder
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function SSSPage() {
  const sorular = [
    {
      soru: 'ZEMİN’e kimler metin gönderebilir?',
      cevap: 'Tüm lisans ve lisansüstü üniversite öğrencileri; felsefe, sosyoloji, psikoloji ve kültür odaklı özgün deneme, inceleme ve araştırma metinleriyle arşive katkıda bulunabilir.',
    },
    {
      soru: 'Editoryal değerlendirme süreci nasıl ilerler?',
      cevap: 'Gönderilen metinler editoryal masa tarafından biçimsel düzen, anlatım bütünlüğü ve temel yayın etiği çerçevesinde incelenir. Yazarın özgün düşünce dünyasını ve serbest ifade alanını koruyan yapıcı bir editoryal süreç yürütülür.',
    },
    {
      soru: 'Telif hakları ve yayın yetkisi nasıl düzenlenir?',
      cevap: 'Yazar, metnini gönderdiği andan itibaren eserin dijital platformda ve tematik dergi seçkilerinde yayımlanması, işlenmesi ve dağıtılması yetkisini ZEMİN’e devretmiş olur. Eserin düşünsel mülkiyeti ve yazar imzası daima metnin sahibine aittir.',
    },
    {
      soru: 'Yayımlanan bir metnin arşiv durumu nasıldır?',
      cevap: 'Web arşivinde tekil olarak yayımlanan bağımsız metinler, yazarın editör masasına ileteceği talep doğrultusunda arşivden kaldırılabilir. Ancak aylık tematik dergi sayılarına dahil edilen ve yayıma giren metinler, koleksiyonun ve sayının editoryal bütünlüğünü korumak adına kalıcı olarak arşivde yer almaya devam eder.',
    },
    {
      soru: 'Aylık tematik seçkilere katılım nasıl gerçekleşir?',
      cevap: 'Açık arşive kabul edilen metinler arasından, o ayın belirlenen dosya konusuna odaklanan çalışmalar editörler masası tarafından derlenerek süreli dergi koleksiyonuna dahil edilir.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12 text-center md:text-left">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Rehber & İlkeler</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">Yayın İlkeleri & SSS</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 leading-relaxed">
          Açık arşiv modeli, telif yetkileri ve yayın standartları hakkında temel bilgiler.
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
        <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">Düşünceni Arşive Dahil Et</h3>
        <p className="text-xs text-[#1A1A1A]/70">Felsefe, sosyoloji veya psikoloji alanındaki metnini paylaşmak için başvuru yapabilirsin.</p>
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

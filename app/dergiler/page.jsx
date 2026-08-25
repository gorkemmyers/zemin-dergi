import Link from 'next/link';

export default function DergilerPage() {
  const sayilar = [
    {
      no: '01',
      ay: 'Mart 2026',
      baslik: 'Bellek, Zaman ve İrade',
      tema: 'Zihin, toplum ve mekan üçgeninde bireyin kopuşu ve hafıza bağıntısı.',
      durum: 'Yayında',
      yaziSayisi: 8,
    },
    {
      no: '02',
      ay: 'Nisan 2026',
      baslik: 'Gözetim, Dijital Beden ve Yabancılaşma',
      tema: 'Ağ toplumunda kimlik inşası ve modern gözetim mekanizmaları.',
      durum: 'Yazı Kabulü Sürüyor',
      yaziSayisi: 'Açık Çağrı',
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Arşiv Koleksiyonu</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">Aylık Sayılar & Seçkiler</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 max-w-2xl leading-relaxed">
          ZEMİN editör masası tarafından her ay belirlenen temalar etrafında derlenen bağımsız öğrenci seçkileri.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sayilar.map((sayi) => (
          <div key={sayi.no} className="border border-[#E3DDD3] bg-[#F7F5F0] p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold mb-4">
                <span className="text-[#5E7362]">{sayi.ay}</span>
                <span className={`px-2 py-0.5 text-[10px] ${
                  sayi.durum === 'Yayında' ? 'bg-[#5E7362]/20 text-[#5E7362]' : 'bg-amber-100 text-amber-800'
                }`}>
                  {sayi.durum}
                </span>
              </div>
              <span className="font-editorial text-4xl font-bold text-[#4E141E] block mb-2">Sayı {sayi.no}</span>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A] mb-3">{sayi.baslik}</h2>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">{sayi.tema}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E3DDD3] flex justify-between items-center">
              <span className="text-xs text-[#1A1A1A]/60 font-semibold">{sayi.yaziSayisi} {typeof sayi.yaziSayisi === 'number' ? 'Metin' : ''}</span>
              <Link
                href={sayi.durum === 'Yayında' ? '/' : '/basvuru'}
                className="text-xs uppercase tracking-widest font-semibold text-[#4E141E] border-b border-[#4E141E] pb-0.5 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
              >
                {sayi.durum === 'Yayında' ? 'Metinleri İncele →' : 'Bu Sayıya Metin Gönder →'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

import Link from 'next/link';

export const metadata = {
  title: '404 - Sayfa Bulunamadı | ZEMİN',
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16 flex flex-col justify-center items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-[#74112f] font-black text-3xl tracking-tighter mb-8 hover:opacity-90">
          ZEMİN
        </Link>

        {/* 404 KARTI */}
        <div className="glass-card p-8 sm:p-12 max-w-lg w-full text-center border border-white/90 shadow-2xl relative overflow-hidden">
          
          <span className="text-xs uppercase tracking-widest font-black text-[#00a693] bg-[#00a693]/10 px-3 py-1 rounded-full border border-[#00a693]/20">
            Hata 404
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 mb-3 tracking-tight">
            Zemin Kaybı.
          </h1>

          <p className="font-serif italic text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
            &ldquo;Hiçbir şey yoktan var olmaz; ancak aradığınız düşünce zemini henüz inşa edilmemiş veya arşivin başka bir köşesine taşınmış olabilir.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/" 
              className="w-full sm:w-auto bg-[#32127a] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#32127a]/90 transition-all shadow-md"
            >
              ← Ana Sayfaya Dön
            </Link>
            <Link 
              href="/yazilar" 
              className="w-full sm:w-auto glass-panel px-6 py-2.5 text-xs font-bold text-gray-800 hover:bg-white transition-all shadow-xs"
            >
              Metin Arşivini İncele
            </Link>
          </div>
        </div>

      </main>

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
          <div>
            <span className="text-lg font-black text-[#74112f] tracking-tighter mr-2">ZEMİN</span>
            <span>© 2026 Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/iletisim" className="hover:text-[#00a693]">İletişim</Link>
            <Link href="/basvuru" className="hover:text-[#00a693]">Yayın Şartları</Link>
            <Link href="/admin" className="text-[#32127a] hover:text-[#74112f]">Editör Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

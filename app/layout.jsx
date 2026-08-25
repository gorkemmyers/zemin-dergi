import './globals.css';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'ZEMİN | Üniversite Düşünce & Edebiyat İnisiyatifi',
  description: 'Felsefe, sosyoloji ve psikoloji alanında bağımsız öğrenci arşivi ve aylık seçki.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-[#F7F5F0] text-[#1A1A1A] min-h-screen flex flex-col justify-between selection:bg-[#4E141E] selection:text-[#F7F5F0]">
        <div>
          <Navbar />
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E3DDD3] bg-[#F7F5F0] py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#1A1A1A]">ZEMİN</span>
              <p className="text-xs text-[#1A1A1A]/70 max-w-sm leading-relaxed">
                Üniversite öğrencilerinin felsefe, sosyoloji ve psikoloji alanındaki metinlerini bir araya getiren bağımsız açık düşünce arşivi.
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-3">Dizin</span>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="hover:text-[#4E141E]">Tüm Metinler</Link></li>
                <li><Link href="/dergiler" className="hover:text-[#4E141E]">Aylık Sayılar</Link></li>
                <li><Link href="/yazarlar" className="hover:text-[#4E141E]">Yazarlar Dizini</Link></li>
                <li><Link href="/sss" className="hover:text-[#4E141E]">Yayın İlkeleri & SSS</Link></li>
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-3">Kurumsal</span>
              <ul className="space-y-2 text-xs">
                <li><Link href="/iletisim" className="hover:text-[#4E141E]">İletişim & Künye</Link></li>
                <li><Link href="/basvuru" className="hover:text-[#4E141E]">Yazı Gönder</Link></li>
                <li><Link href="/admin" className="text-[#5E7362] hover:text-[#4E141E]">Editör Girişi</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 pt-8 mt-8 border-t border-[#E3DDD3]/60 flex flex-col sm:flex-row justify-between text-[11px] text-[#1A1A1A]/50 gap-4">
            <p>© {new Date().getFullYear()} Zemin Dergi. Tüm hakları saklıdır.</p>
            <p>Açık Düşünce & Bağımsız Öğrenci İnisiyatifi</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

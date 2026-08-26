import './globals.css';
import { Outfit, Lora } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'ZEMİN | Açık Düşünce İnisiyatifi',
  description: 'Felsefe, sosyoloji ve psikoloji disiplinlerinde açık düşünce arşivi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${outfit.variable} ${lora.variable}`}>
      <body className={`${outfit.className} text-gray-850 antialiased relative min-h-screen bg-[#F8F9FA] overflow-x-hidden selection:bg-[#74112f]/15`}>
        
        {/* ULTRA SOFT / EYE-FRIENDLY MESH GRADIENT */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          {/* Fildişi / Sıcak Işık */}
          <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] min-w-[500px] rounded-full bg-[#ECE7E1] filter blur-[140px] opacity-70"></div>
          
          {/* Nötr Sis Grisi / Açık Taş Rengi */}
          <div className="absolute top-[30%] right-[-15%] w-[50vw] h-[50vw] min-w-[450px] rounded-full bg-[#E5E9EC] filter blur-[150px] opacity-60"></div>
          
          {/* Silik Soluk Adaçayı Işıltısı */}
          <div className="absolute bottom-[-15%] left-[20%] w-[60vw] h-[60vw] min-w-[550px] rounded-full bg-[#E3EAE6] filter blur-[160px] opacity-50"></div>
        </div>

        {/* Sayfa İçerikleri */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        
      </body>
    </html>
  );
}

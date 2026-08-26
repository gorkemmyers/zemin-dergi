import './globals.css';
import { Outfit, Lora } from 'next/font/google';

// Arayüz Fontu (Outfit - Modern, Yuvarlak hatlı, Apple tarzı)
const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Makale Fontu (Lora - Göz yormayan, zarif tırnaklı)
const lora = Lora({ 
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'ZEMİN | Açık Düşünce İnisiyatifi',
  description: 'Felsefe, Sosyoloji ve Psikoloji inisiyatifi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${outfit.variable} ${lora.variable}`}>
      {/* Sitenin genelini outfit (Arayüz fontu) ile başlatıyoruz */}
      <body className={`${outfit.className} text-gray-800 antialiased relative min-h-screen bg-[#F7F7F9] overflow-x-hidden`}>
        
        {/* LIQUID / MESH GRADIENT ARKA PLAN */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          {/* Bordo Baloncuk */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-[#74112f] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
          
          {/* Mor Baloncuk */}
          <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] min-w-[500px] min-h-[500px] bg-[#32127a] rounded-full mix-blend-multiply filter blur-[140px] opacity-25 animate-blob animation-delay-2000"></div>
          
          {/* Yeşil Baloncuk */}
          <div className="absolute bottom-[-20%] left-[10%] w-[50vw] h-[50vw] min-w-[600px] min-h-[600px] bg-[#00a693] rounded-full mix-blend-multiply filter blur-[150px] opacity-25 animate-blob animation-delay-4000"></div>
        </div>

        {/* Tüm sayfa içerikleri bu katmanın üstünde olacak */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        
      </body>
    </html>
  );
}

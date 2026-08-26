'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const DILLER = [
  { kod: 'tr', ad: 'Türkçe', sesKod: 'tr-TR', bayrak: '🇹🇷' },
  { kod: 'en', ad: 'English', sesKod: 'en-US', bayrak: '🇬🇧' },
  { kod: 'de', ad: 'Deutsch', sesKod: 'de-DE', bayrak: '🇩🇪' },
  { kod: 'fr', ad: 'Français', sesKod: 'fr-FR', bayrak: '🇫🇷' },
  { kod: 'ru', ad: 'Русский', sesKod: 'ru-RU', bayrak: '🇷🇺' },
];

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        renk: '#74112f',
        rgb: '116, 17, 47',
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent',
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(116, 17, 47, 0.12) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        renk: '#00a693',
        rgb: '0, 166, 147',
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 166, 147, 0.12) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        renk: '#32127a',
        rgb: '50, 18, 122',
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(50, 18, 122, 0.12) 0%, transparent 60%)'
      };
    default:
      return {
        renk: '#111827',
        rgb: '17, 24, 39',
        cardBg: 'from-gray-100 to-transparent',
        badgeBg: 'bg-gray-100 text-gray-700',
        pattern: 'none'
      };
  }
};

async function translateText(text, targetLang) {
  if (targetLang === 'tr') return text;
  const paragraphs = text.split('\n');
  const translated = await Promise.all(
    paragraphs.map(async (p) => {
      if (!p.trim()) return '';
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(p)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map((item) => item[0]).join('');
      } catch (e) {
        return p;
      }
    })
  );
  return translated.join('\n');
}

export default function YaziIcerik({ yazi, ilgiliYazilar = [] }) {
  const [fontSize, setFontSize] = useState('text-lg');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [seciliDil, setSeciliDil] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState({});

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const canvasRef = useRef(null);
  const [storyImageUrl, setStoryImageUrl] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const aktifBaslik = seciliDil === 'tr' ? yazi?.baslik : (translations[seciliDil]?.baslik || yazi?.baslik);
  const aktifIcerik = seciliDil === 'tr' ? yazi?.icerik : (translations[seciliDil]?.icerik || yazi?.icerik);
  const aktifDilObj = DILLER.find((d) => d.kod === seciliDil) || DILLER[0];

  // Apple Liquid Glass + Şeffaf Görsel Geçişli Canvas Motoru
  useEffect(() => {
    if (!isStoryOpen || !canvasRef.current || !yazi) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const stil = getDisiplinStili(yazi.kategori);

    const renderCanvas = (coverImg = null) => {
      // 1. Zemin
      ctx.fillStyle = '#F4F5F7';
      ctx.fillRect(0, 0, width, height);

      // 2. Çok Katmanlı Işık Hüzmeleri (Mesh Ambient)
      const g1 = ctx.createRadialGradient(250, 320, 50, 250, 320, 700);
      g1.addColorStop(0, '#ECE7E1');
      g1.addColorStop(1, 'rgba(236, 231, 225, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(900, 500, 80, 900, 500, 750);
      g2.addColorStop(0, `rgba(${stil.rgb}, 0.16)`);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const g3 = ctx.createRadialGradient(400, 1600, 60, 400, 1600, 800);
      g3.addColorStop(0, 'rgba(227, 234, 230, 0.9)');
      g3.addColorStop(1, 'rgba(227, 234, 230, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // 3. Liquid Glass Kart Boyutları
      const cardX = 90;
      const cardY = 280;
      const cardW = 900;
      const cardH = 1360;
      const radius = 64;

      // Kart Gölgesi
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 25;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fill();
      ctx.restore();

      // Kart İçini Kırp (Clip)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.clip();

      // 4. Şeffafa Geçişli Kapak Görseli (Varsa)
      if (coverImg) {
        ctx.save();
        const imgW = cardW * 0.75;
        const imgH = cardH * 0.55;
        const imgX = cardX + cardW - imgW + 80;
        const imgY = cardY - 40;

        ctx.globalAlpha = 0.85;
        ctx.drawImage(coverImg, imgX, imgY, imgW, imgH);

        // Görselin üstüne soldan ve alttan şeffaflaşma gradyanı
        const fadeGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + imgH);
        fadeGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        fadeGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.9)');
        fadeGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        fadeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.restore();
      }

      // Kart İçi Cam Parıltı Gradyanı
      const innerGlass = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      innerGlass.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      innerGlass.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      ctx.fillStyle = innerGlass;
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // 5. Kart İçi Tipografi ve Düzen
      // Logo
      ctx.fillStyle = '#74112f';
      ctx.font = '900 46px sans-serif';
      ctx.fillText('ZEMİN', cardX + 70, cardY + 110);

      ctx.fillStyle = '#6B7280';
      ctx.font = '800 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('AÇIK DÜŞÜNCE İNİSİYATİFİ', cardX + 70, cardY + 148);
      ctx.letterSpacing = '0px';

      // Disiplin Rozeti
      const badgeX = cardX + 70;
      const badgeY = cardY + 210;
      ctx.fillStyle = `rgba(${stil.rgb}, 0.14)`;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, 170, 44, 22);
      ctx.fill();

      ctx.fillStyle = stil.renk;
      ctx.font = '900 18px sans-serif';
      ctx.fillText((yazi.kategori || 'FELSEFE').toUpperCase(), badgeX + 24, badgeY + 28);

      // Makale Başlığı (Kompakt ve Şık - Maks 3 satır)
      ctx.fillStyle = '#111827';
      ctx.font = '900 58px sans-serif';

      const wrapText = (text, x, y, maxWidth, lineHeight, maxLines = 3) => {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
            if (lineCount >= maxLines - 1) {
              ctx.fillText(line.trim() + '...', x, y);
              return y;
            }
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        return y;
      };

      const sonBaslikY = wrapText(aktifBaslik, cardX + 70, cardY + 360, 760, 74, 3);

      // Kısa 1-2 Cümlelik Editoryal Alıntı
      const spotMetin = (aktifIcerik || '').replace(/[\n\r]/g, ' ').slice(0, 110) + '...';
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 30px serif';
      wrapText(`“${spotMetin}”`, cardX + 70, sonBaslikY + 80, 760, 44, 2);

      // Yazar Rozeti (Kartın Altı)
      const authorY = cardY + cardH - 140;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(cardX + 70, authorY - 30, 760, 1.5);

      // Yazar İnisiyal Dairesi
      const avatarX = cardX + 70;
      const avatarY = authorY;
      ctx.fillStyle = '#74112f';
      ctx.beginPath();
      ctx.arc(avatarX + 28, avatarY + 28, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px sans-serif';
      ctx.fillText(yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z', avatarX + 19, avatarY + 36);

      // Yazar İsim ve Kurum
      ctx.fillStyle = '#111827';
      ctx.font = '900 28px sans-serif';
      ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', avatarX + 75, avatarY + 24);

      ctx.fillStyle = '#6B7280';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`${yazi.yazarlar?.universite || ''} — ${yazi.yazarlar?.bolum || ''}`, avatarX + 75, avatarY + 52);

      ctx.restore(); // Clip kapat

      // 6. Kartın Dış Cam Çerçeve Çizgisi (Specular border)
      ctx.save();
      ctx.lineWidth = 2.5;
      const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
      ctx.strokeStyle = borderGrad;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.stroke();
      ctx.restore();

      setStoryImageUrl(canvas.toDataURL('image/png'));
    };

    // Kapak görseli varsa yükleyip çiz, yoksa direkt çiz
    if (yazi.kapak_url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = yazi.kapak_url;
      img.onload = () => renderCanvas(img);
      img.onerror = () => renderCanvas(null);
    } else {
      renderCanvas(null);
    }

  }, [isStoryOpen, yazi, aktifBaslik, aktifIcerik]);

  const handleStoryShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {}

    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `${yazi.slug}-story.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: aktifBaslik,
            text: window.location.href,
          });
        } catch (err) {}
      } else {
        const a = document.createElement('a');
        a.href = storyImageUrl;
        a.download = `${yazi.slug}-story.png`;
        a.click();
        alert('Görsel indirildi ve bağlantı panoya kopyalandı.');
      }
    }, 'image/png');
  };

  const handleDilDegistir = async (yeniDil) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setSeciliDil(yeniDil);

    if (yeniDil === 'tr') return;

    if (!translations[yeniDil]) {
      setIsTranslating(true);
      try {
        const [yeniBaslik, yeniIcerik] = await Promise.all([
          translateText(yazi.baslik, yeniDil),
          translateText(yazi.icerik, yeniDil)
        ]);
        setTranslations((prev) => ({
          ...prev,
          [yeniDil]: { baslik: yeniBaslik, icerik: yeniIcerik }
        }));
      } catch (err) {
        alert('Çeviri yapılırken bir hata oluştu.');
      }
      setIsTranslating(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();

      const textToRead = `${aktifBaslik}. ${aktifIcerik}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = aktifDilObj.sesKod;
      utterance.rate = 0.93;
      utterance.pitch = 1.0;

      const mevcutSesler = window.speechSynthesis.getVoices();
      const uygunSes = mevcutSesler.find(v => v.lang.toLowerCase().startsWith(aktifDilObj.kod));
      if (uygunSes) {
        utterance.voice = uygunSes;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleRastgele = async () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const { supabase } = await import('../../../lib/supabase');
    const { data } = await supabase
      .from('yazilar')
      .select('slug')
      .eq('durum', 'onaylandi');
    if (data && data.length > 0) {
      const rastgeleYazi = data[Math.floor(Math.random() * data.length)];
      window.location.href = `/yazi/${rastgeleYazi.slug}`;
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {}

    if (navigator.share) {
      try {
        await navigator.share({
          title: aktifBaslik,
          text: `${aktifBaslik} - ${yazi.yazarlar?.ad_soyad} | ZEMİN`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      alert('Bağlantı panoya kopyalandı.');
    }
  };

  if (!yazi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#F8F9FA]">
        <h1 className="text-xl font-black text-gray-900 mb-2">Metin Bulunamadı</h1>
        <Link href="/" className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const okumaSuresi = Math.max(1, Math.ceil((aktifIcerik || '').trim().split(/\s+/).length / 200));

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative">
      
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693] z-[99999] transition-all duration-75 ease-out shadow-[0_2px_8px_rgba(50,18,122,0.4)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {yazi.kapak_url && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <img 
            src={yazi.kapak_url} 
            alt="" 
            className="absolute top-0 right-0 w-[60vw] h-[50vh] object-cover filter blur-[100px] opacity-15"
          />
        </div>
      )}

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">
        
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleRastgele}
                className="glass-panel px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-700 hover:text-[#74112f] transition-all shadow-xs"
                title="Rastgele Bir Metin Keşfet"
              >
                Rastgele
              </button>
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
            <Link href="/yazilar" className="text-[#00a693] flex-shrink-0">Yazılar</Link>
            <Link href="/dergiler" className="hover:text-[#00a693] transition-colors flex-shrink-0">Dergiler</Link>
            <Link href="/yazarlar" className="hover:text-[#00a693] transition-colors flex-shrink-0">Yazarlar</Link>
            <Link href="/iletisim" className="hover:text-[#00a693] transition-colors flex-shrink-0">İletişim</Link>
          </nav>
        </header>

        <article className="glass-card p-6 sm:p-12 border border-white/90 shadow-2xl relative">
          
          <header className="border-b border-gray-200/70 pb-6 mb-8 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#00a693]/15 text-[#00a693] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {yazi.kategori}
                </span>
                {yazi.dergiler && (
                  <span className="bg-[#74112f] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    Sayı {yazi.dergiler.sayi_no}
                  </span>
                )}
                <span className="text-[10px] font-bold text-gray-600 bg-white/80 border border-gray-200/70 px-2.5 py-0.5 rounded-full">
                  ⏱ {okumaSuresi} dk okuma
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                
                <div className="flex items-center bg-white/90 border border-gray-200/80 p-0.5 rounded-full shadow-xs">
                  {DILLER.map((d) => (
                    <button
                      key={d.kod}
                      onClick={() => handleDilDegistir(d.kod)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        seciliDil === d.kod
                          ? 'bg-gray-900 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={d.ad}
                    >
                      <span>{d.bayrak}</span>
                      <span className="hidden sm:inline uppercase">{d.kod}</span>
                    </button>
                  ))}
                </div>

                <button
                  disabled={isTranslating}
                  onClick={handleToggleSpeech}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs border ${
                    isSpeaking 
                      ? 'bg-[#74112f] text-white border-[#74112f] animate-pulse' 
                      : 'bg-white/90 text-gray-700 border-gray-200/80 hover:bg-white'
                  }`}
                  title={`${aktifDilObj.ad} dilinde dinle`}
                >
                  <span>{isSpeaking ? '⏹ Durdur' : `🎧 ${aktifDilObj.kod.toUpperCase()}`}</span>
                </button>

                <div className="flex items-center bg-white/80 border border-gray-200/80 p-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-600">
                  <button onClick={() => setFontSize('text-base')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-base' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A-</button>
                  <button onClick={() => setFontSize('text-lg')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-lg' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A</button>
                  <button onClick={() => setFontSize('text-xl')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-xl' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A+</button>
                </div>

                <button
                  onClick={() => setIsStoryOpen(true)}
                  className="p-1.5 text-gray-600 hover:text-[#74112f] bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-sm"
                  title="Instagram Story Kartı"
                  aria-label="Story Kartı"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </button>

                <button
                  onClick={handleShare}
                  className="p-1.5 text-gray-600 hover:text-[#74112f] bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-sm"
                  title="Paylaş"
                  aria-label="Paylaş"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.368 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {isTranslating ? (
              <div className="py-8 text-center text-xs font-bold text-gray-500 animate-pulse">
                Düşünce metni {aktifDilObj.ad} diline çevriliyor...
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                  {aktifBaslik}
                </h1>

                <Link href={`/yazar/${yazi.yazarlar?.slug}`} className="inline-flex items-center gap-2.5 group outline-none pt-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#74112f] transition-colors">
                      {yazi.yazarlar?.ad_soyad}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">{yazi.yazarlar?.universite}</p>
                  </div>
                </Link>
              </>
            )}
          </header>

          {yazi.kapak_url && (
            <div className="mb-10 rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[2.4/1] w-full relative shadow-md border border-white/90">
              <img 
                src={yazi.kapak_url} 
                alt={yazi.baslik} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
            </div>
          )}

          <div className={`font-serif text-gray-800 ${fontSize} leading-relaxed whitespace-pre-wrap selection:bg-[#74112f]/15`}>
            {isTranslating ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200/80 rounded w-full"></div>
                <div className="h-4 bg-gray-200/80 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200/80 rounded w-4/6"></div>
              </div>
            ) : (
              aktifIcerik
            )}
          </div>

          <div className="mt-14 pt-6 border-t border-gray-200/70 font-sans">
            <Link href={`/yazar/${yazi.yazarlar?.slug}`} className="glass-panel p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white/50 hover:bg-white/80 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#74112f] to-[#32127a] flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md border border-white">
                {yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z'}
              </div>
              <div className="min-w-0 flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="font-black text-sm sm:text-base text-gray-900 group-hover:text-[#74112f] transition-colors">{yazi.yazarlar?.ad_soyad}</h3>
                  {yazi.yazarlar?.instagram && <span className="text-xs font-bold text-[#00a693]">@{yazi.yazarlar.instagram}</span>}
                </div>
                <p className="text-[11px] text-gray-500 font-semibold mb-2">{yazi.yazarlar?.universite} — {yazi.yazarlar?.bolum}</p>
                {yazi.yazarlar?.biyografi && <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">{yazi.yazarlar.biyografi}</p>}
              </div>
            </Link>
          </div>
        </article>

        {ilgiliYazilar.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#74112f]">Keşfetmeye Devam Et</span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Benzer Düşünceler</h2>
              </div>
              <Link href="/yazilar" className="text-xs font-bold text-[#32127a] hover:underline">Tüm Arşiv →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ilgiliYazilar.map((iy) => {
                const stil = getDisiplinStili(iy.kategori);
                const iyOkumaSuresi = Math.max(1, Math.ceil((iy.icerik || '').trim().split(/\s+/).length / 200));

                return (
                  <Link href={`/yazi/${iy.slug}`} key={iy.id} className="group outline-none">
                    <article 
                      style={{ backgroundImage: !iy.kapak_url ? stil.pattern : 'none' }}
                      className={`glass-card p-4 rounded-2xl h-full flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all border border-white/80 group-hover:-translate-y-0.5 relative overflow-hidden ${!iy.kapak_url ? `bg-gradient-to-br ${stil.cardBg}` : 'bg-white/90'}`}
                    >
                      {iy.kapak_url && (
                        <>
                          <img src={iy.kapak_url} alt="" className="absolute -right-2 inset-y-0 w-3/5 h-full object-cover opacity-75 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none"></div>
                        </>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${stil.badgeBg}`}>
                            {iy.kategori}
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold bg-white/90 px-2 py-0.5 rounded-full border border-gray-100">
                            ⏱ {iyOkumaSuresi} dk
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#74112f] transition-colors line-clamp-2">
                          {iy.baslik}
                        </h3>
                      </div>

                      <div className="relative z-10 mt-3 pt-2 border-t border-gray-200/50 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 truncate max-w-[150px]">{iy.yazarlar?.ad_soyad}</span>
                        <span className="font-black text-[#32127a]">Oku →</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {isStoryOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full p-5 rounded-3xl border border-white/90 text-center shadow-2xl relative flex flex-col items-center animate-in fade-in zoom-in duration-150">
            
            <button 
              onClick={() => setIsStoryOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-sm font-bold bg-black/5 hover:bg-black/10 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <span className="text-[10px] font-black uppercase tracking-widest text-[#00a693] mb-1">
              Instagram Story Kartı
            </span>
            <h3 className="text-sm font-black text-gray-900 mb-3">Önizleme</h3>

            <div className="w-full aspect-[9/16] max-h-[380px] rounded-2xl overflow-hidden shadow-lg border border-white/80 mb-4 bg-[#F8F9FA] flex items-center justify-center">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
            </div>

            <button
              onClick={handleStoryShare}
              className="w-full bg-[#32127a] hover:bg-[#74112f] text-white py-3 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Hikayede Paylaş / İndir
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto w-full border-t border-white/40 bg-white/40 backdrop-blur-md py-6 relative z-10">
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

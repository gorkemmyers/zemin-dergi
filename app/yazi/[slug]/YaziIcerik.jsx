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
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(116, 17, 47, 0.12) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        renk: '#00a693',
        rgb: '0, 166, 147',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 166, 147, 0.12) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        renk: '#32127a',
        rgb: '50, 18, 122',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(50, 18, 122, 0.12) 0%, transparent 60%)'
      };
    default:
      return {
        renk: '#111827',
        rgb: '17, 24, 39',
        badgeBg: 'bg-gray-100 text-gray-700',
        cardBg: 'from-gray-100 to-transparent',
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

  // Yeniden Tasarlanmış 9:16 Canvas Story Motoru
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

      // 2. Liquid Glass Işık Hüzmeleri
      const g1 = ctx.createRadialGradient(250, 300, 50, 250, 300, 650);
      g1.addColorStop(0, '#ECE7E1');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(850, 600, 50, 850, 600, 700);
      g2.addColorStop(0, `rgba(${stil.rgb}, 0.14)`);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const g3 = ctx.createRadialGradient(400, 1600, 50, 400, 1600, 750);
      g3.addColorStop(0, 'rgba(227, 234, 230, 0.9)');
      g3.addColorStop(1, 'transparent');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // 3. Monolitik Cam Kart
      const cardX = 80;
      const cardY = 180;
      const cardW = 920;
      const cardH = 1560;
      const radius = 52;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.07)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.fill();
      ctx.restore();

      // Cam Çerçeve Çizgisi
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.stroke();
      ctx.restore();

      // 4. Üst Bant: Logo & Disiplin Rozeti
      const headerY = cardY + 90;
      ctx.fillStyle = '#74112f';
      ctx.font = '900 44px sans-serif';
      ctx.fillText('ZEMİN', cardX + 60, headerY);

      const badgeW = 160;
      const badgeH = 44;
      const badgeX = cardX + cardW - 60 - badgeW;
      const badgeY = headerY - 34;

      ctx.fillStyle = `rgba(${stil.rgb}, 0.12)`;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 22);
      ctx.fill();

      ctx.fillStyle = stil.renk;
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((yazi.kategori || 'FELSEFE').toUpperCase(), badgeX + badgeW / 2, badgeY + 28);
      ctx.textAlign = 'left';

      // 5. Kapak Görseli Penceresi
      let contentStartY = headerY + 60;

      if (coverImg) {
        const imgX = cardX + 60;
        const imgY = contentStartY;
        const imgW = cardW - 120; // 800px
        const imgH = 460;
        const imgRadius = 32;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, imgRadius);
        ctx.clip();
        ctx.drawImage(coverImg, imgX, imgY, imgW, imgH);
        ctx.restore();

        // Görselin Cam Çerçevesi
        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, imgRadius);
        ctx.stroke();
        ctx.restore();

        contentStartY = imgY + imgH + 60;
      } else {
        contentStartY += 40;
      }

      // 6. Başlık ve Alıntı
      ctx.fillStyle = '#111827';
      ctx.font = '900 54px sans-serif';

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

      const sonBaslikY = wrapText(aktifBaslik, cardX + 60, contentStartY + 20, cardW - 120, 68, 3);

      // İtalik Alıntı
      const spotMetin = (aktifIcerik || '').replace(/[\n\r]/g, ' ').slice(0, 110) + '...';
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 28px serif';
      wrapText(`“${spotMetin}”`, cardX + 60, sonBaslikY + 65, cardW - 120, 42, 2);

      // 7. Genişletilmiş ve Belirgin Yazar İmzası (Alt Kısım)
      const footerY = cardY + cardH - 180;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(cardX + 60, footerY - 40, cardW - 120, 1.5);

      // Monogram Dairesi
      const avatarR = 36;
      const avatarX = cardX + 60 + avatarR;
      const avatarY = footerY + 20;

      ctx.fillStyle = '#74112f';
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z', avatarX, avatarY + 11);
      ctx.textAlign = 'left';

      // Belirgin Yazar Adı (34px) ve Kurum (24px)
      const textLeft = avatarX + avatarR + 24;
      ctx.fillStyle = '#111827';
      ctx.font = '900 34px sans-serif';
      ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', textLeft, avatarY - 4);

      ctx.fillStyle = '#6B7280';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(`${yazi.yazarlar?.universite || ''} — ${yazi.yazarlar?.bolum || ''}`, textLeft, avatarY + 28);

      setStoryImageUrl(canvas.toDataURL('image/png'));
    };

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
                  <button onClick={() => setFontSize('text-lg')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-lg' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}
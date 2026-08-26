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
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState({});

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const canvasRef = useRef(null);
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const langMenuRef = useRef(null);

  // Menü dışına tıklandığında açılır menüyü kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // 1080x1920 Kare Kapaklı Story Motoru
  useEffect(() => {
    if (!isStoryOpen || !canvasRef.current || !yazi) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const renderCanvas = (coverImg = null) => {
      // 1. Zemin
      ctx.fillStyle = '#F4F5F7';
      ctx.fillRect(0, 0, width, height);

      // 2. Sıvı Işık Küreleri
      const gBordo = ctx.createRadialGradient(260, 240, 50, 260, 240, 650);
      gBordo.addColorStop(0, 'rgba(116, 17, 47, 0.16)');
      gBordo.addColorStop(1, 'transparent');
      ctx.fillStyle = gBordo;
      ctx.fillRect(0, 0, width, height);

      const gMor = ctx.createRadialGradient(880, 800, 50, 880, 800, 700);
      gMor.addColorStop(0, 'rgba(50, 18, 122, 0.14)');
      gMor.addColorStop(1, 'transparent');
      ctx.fillStyle = gMor;
      ctx.fillRect(0, 0, width, height);

      const gYesil = ctx.createRadialGradient(320, 1650, 50, 320, 1650, 750);
      gYesil.addColorStop(0, 'rgba(0, 166, 147, 0.15)');
      gYesil.addColorStop(1, 'transparent');
      ctx.fillStyle = gYesil;
      ctx.fillRect(0, 0, width, height);

      // 3. Monolitik Cam Kart
      const cardX = 80;
      const cardY = 140;
      const cardW = 920;
      const cardH = 1640;
      const radius = 56;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 55;
      ctx.shadowOffsetY = 24;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.fill();
      ctx.restore();

      // Cam Çerçeve
      ctx.save();
      ctx.lineWidth = 2.5;
      const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      borderGrad.addColorStop(0.3, 'rgba(116, 17, 47, 0.25)');
      borderGrad.addColorStop(0.6, 'rgba(50, 18, 122, 0.25)');
      borderGrad.addColorStop(1, 'rgba(0, 166, 147, 0.35)');
      ctx.strokeStyle = borderGrad;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.stroke();
      ctx.restore();

      // 4. Üst Başlık Bandı
      const headerY = cardY + 90;
      ctx.fillStyle = '#74112f';
      ctx.font = '900 46px sans-serif';
      ctx.fillText('ZEMİN', cardX + 60, headerY);

      const badgeW = 160;
      const badgeH = 46;
      const badgeX = cardX + cardW - 60 - badgeW;
      const badgeY = headerY - 36;

      ctx.fillStyle = 'rgba(0, 166, 147, 0.14)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 23);
      ctx.fill();

      ctx.fillStyle = '#00a693';
      ctx.font = '900 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((yazi.kategori || 'FELSEFE').toUpperCase(), badgeX + badgeW / 2, badgeY + 29);
      ctx.textAlign = 'left';

      let currentY = headerY + 55;

      // 5. Kare Görsel Penceresi (1:1 Oran)
      if (coverImg) {
        const imgX = cardX + 60;
        const imgY = currentY;
        const imgSize = cardW - 120; // 800 x 800 px
        const imgRadius = 36;

        const srcW = coverImg.naturalWidth || coverImg.width;
        const srcH = coverImg.naturalHeight || coverImg.height;
        const minSide = Math.min(srcW, srcH);
        const sx = (srcW - minSide) / 2;
        const sy = (srcH - minSide) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, imgRadius);
        ctx.clip();
        ctx.drawImage(coverImg, sx, sy, minSide, minSide, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, imgRadius);
        ctx.stroke();
        ctx.restore();

        currentY = imgY + imgSize + 60;
      } else {
        currentY += 40;
      }

      // 6. Başlık
      ctx.fillStyle = '#111827';
      ctx.font = '900 52px sans-serif';

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

      const sonBaslikY = wrapText(aktifBaslik, cardX + 60, currentY + 10, cardW - 120, 68, 3);

      // 7. Alıntı
      const spotMetin = (aktifIcerik || '').replace(/[\n\r]/g, ' ').slice(0, 105) + '...';
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 26px serif';
      wrapText(`“${spotMetin}”`, cardX + 60, sonBaslikY + 55, cardW - 120, 38, 2);

      // 8. Yazar Alanı
      const footerY = cardY + cardH - 125;

      const lineGrad = ctx.createLinearGradient(cardX + 60, footerY, cardX + cardW - 60, footerY);
      lineGrad.addColorStop(0, 'rgba(116, 17, 47, 0.4)');
      lineGrad.addColorStop(0.5, 'rgba(50, 18, 122, 0.4)');
      lineGrad.addColorStop(1, 'rgba(0, 166, 147, 0.4)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(cardX + 60, footerY - 25, cardW - 120, 2);

      ctx.fillStyle = '#6B7280';
      ctx.font = '800 15px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('YAZAR', cardX + 60, footerY + 12);
      ctx.letterSpacing = '0px';

      ctx.fillStyle = '#111827';
      ctx.font = '900 38px sans-serif';
      ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', cardX + 60, footerY + 58);

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
    setIsLangMenuOpen(false);

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

              {/* MİNİMALİST VE YER KAPLAMAYAN ARAÇ ÇUBUĞU */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* 🌐 AÇILIR DİL MENÜSÜ (DROPDOWN) */}
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                    title="Dili Değiştir"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="uppercase text-[10px] tracking-wider">{aktifDilObj.kod}</span>
                    <span className="text-[9px] text-gray-400">▾</span>
                  </button>

                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      {DILLER.map((d) => (
                        <button
                          key={d.kod}
                          onClick={() => handleDilDegistir(d.kod)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            seciliDil === d.kod
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{d.bayrak}</span>
                            <span>{d.ad}</span>
                          </span>
                          {seciliDil === d.kod && <span className="text-[10px]">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🎧 SESLİ DİNLE */}
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

                {/* FONT BOYUTU */}
                <div className="flex items-center bg-white/80 border border-gray-200/80 p-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-600">
                  <button onClick={() => setFontSize('text-base')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-base' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A-</button>
                  <button onClick={() => setFontSize('text-lg')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-lg' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A</button>
                  <button onClick={() => setFontSize('text-xl')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-xl' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A+</button>
                </div>

                {/* 📷 INSTAGRAM STORY KARTI */}
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

                {/* PAYLAŞ */}
                <button
                  onClick={handleShare}
                  className="p-1.5 text-gray-600 hover:text-[#74112f] bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-sm"
                  title="Paylaş"
                  aria-label="Paylaş"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
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

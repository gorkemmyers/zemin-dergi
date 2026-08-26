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
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent',
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(116, 17, 47, 0.12) 0%, transparent 60%)'
      };
    case 'Sosyoloji':
      return {
        renk: '#00a693',
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(0, 166, 147, 0.12) 0%, transparent 60%)'
      };
    case 'Psikoloji':
      return {
        renk: '#32127a',
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        pattern: 'radial-gradient(circle at 100% 0%, rgba(50, 18, 122, 0.12) 0%, transparent 60%)'
      };
    default:
      return {
        renk: '#111827',
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

  // Story Modal
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

  // Açık Renkli Liquid Glass Story Kartı Çizimi
  useEffect(() => {
    if (!isStoryOpen || !canvasRef.current || !yazi) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const stil = getDisiplinStili(yazi.kategori);

    // 1. Zemin (Açık Nötr Gri / Fildişi)
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, width, height);

    // 2. Yumuşak Işık Hüzmeleri
    const g1 = ctx.createRadialGradient(250, 350, 40, 250, 350, 600);
    g1.addColorStop(0, 'rgba(236, 231, 225, 0.95)');
    g1.addColorStop(1, 'rgba(236, 231, 225, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);

    const g2 = ctx.createRadialGradient(850, 450, 50, 850, 450, 650);
    g2.addColorStop(0, stil.renk + '18');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    const g3 = ctx.createRadialGradient(400, 1550, 50, 400, 1550, 700);
    g3.addColorStop(0, 'rgba(227, 234, 230, 0.85)');
    g3.addColorStop(1, 'rgba(227, 234, 230, 0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, width, height);

    // 3. Merkezdeki Buzlu Cam Kart
    const cardX = 80;
    const cardY = 240;
    const cardW = 920;
    const cardH = 1440;
    const radius = 56;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.stroke();
    ctx.restore();

    // 4. Logo ve Başlık
    ctx.fillStyle = '#74112f';
    ctx.font = '900 48px sans-serif';
    ctx.fillText('ZEMİN', cardX + 75, cardY + 120);

    ctx.fillStyle = '#6B7280';
    ctx.font = '700 18px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('AÇIK DÜŞÜNCE İNİSİYATİFİ', cardX + 75, cardY + 160);
    ctx.letterSpacing = '0px';

    // 5. Disiplin Rozeti
    const badgeX = cardX + 75;
    const badgeY = cardY + 230;
    ctx.fillStyle = stil.renk + '18';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, 180, 48, 24);
    ctx.fill();

    ctx.fillStyle = stil.renk;
    ctx.font = '900 20px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText((yazi.kategori || 'FELSEFE').toUpperCase(), badgeX + 28, badgeY + 31);
    ctx.letterSpacing = '0px';

    // 6. Başlık Satır Bölme (Maksimum 4 satır)
    ctx.fillStyle = '#111827';
    ctx.font = '900 64px sans-serif';

    const wrapText = (text, x, y, maxWidth, lineHeight, maxLines = 4) => {
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
            ctx.fillText(line + '...', x, y);
            return y;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
      return y;
    };

    const sonBaslikY = wrapText(aktifBaslik, cardX + 75, cardY + 390, 770, 80, 4);

    // 7. Kısa Spot / İlk Cümle Alıntısı (1-2 satır)
    const spotMetin = (aktifIcerik || '').replace(/[\n\r]/g, ' ').slice(0, 140) + '...';
    ctx.fillStyle = '#4B5563';
    ctx.font = 'italic 32px serif';
    wrapText(`“${spotMetin}”`, cardX + 75, sonBaslikY + 90, 770, 48, 3);

    // 8. Yazar Künyesi
    const authorY = cardY + cardH - 160;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(cardX + 75, authorY - 35, 770, 1.5);

    // Yazar İnisiyal Rozeti
    const avatarX = cardX + 75;
    const avatarY = authorY - 5;
    ctx.fillStyle = '#74112f';
    ctx.beginPath();
    ctx.arc(avatarX + 32, avatarY + 32, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px sans-serif';
    ctx.fillText(yazi.yazarlar?.ad_soyad?.charAt(0) || 'Z', avatarX + 22, avatarY + 42);

    // Yazar Adı ve Üniversite
    ctx.fillStyle = '#111827';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', avatarX + 85, avatarY + 26);

    ctx.fillStyle = '#6B7280';
    ctx.font = '600 22px sans-serif';
    ctx.fillText(`${yazi.yazarlar?.universite || ''} — ${yazi.yazarlar?.bolum || ''}`, avatarX + 85, avatarY + 58);

    setStoryImageUrl(canvas.toDataURL('image/png'));
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
      
      {/* OKUMA İLERLEME ÇUBUĞU */}
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
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-4xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg">
          <div className="flex justify-between items-center px-2 pb-2.5 border-b border-gray-200/50">
            <Link href="/" className="text-[#74112f] font-black text-2xl tracking-tighter hover:opacity-90">
              ZEMİN
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleRastgele}
                className="glass-panel px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-700 hover:text-[#74112f] transition-all flex items-center gap-1 shadow-xs"
                title="Rastgele Bir Metin Keşfet"
              >
                <span>🔀</span> <span className="hidden sm:inline">Rastgele</span>
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

        {/* MAKALE GÖVDESİ */}
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

              {/* ARAÇ ÇUBUĞU */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* DİL SEÇİMİ */}
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

                {/* SESLİ DİNLE */}
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

                {/* Font Boyutu */}
                <div className="flex items-center bg-white/80 border border-gray-200/80 p-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-600">
                  <button onClick={() => setFontSize('text-base')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-base' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A-</button>
                  <button onClick={() => setFontSize('text-lg')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-lg' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A</button>
                  <button onClick={() => setFontSize('text-xl')} className={`px-2 py-0.5 rounded-full transition-all ${fontSize === 'text-xl' ? 'bg-gray-900 text-white' : 'hover:text-gray-900'}`}>A+</button>
                </div>

                {/* 📷 MİNİMALİST INSTAGRAM STORY BUTONU */}
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
                  className="p-1.5 text-gray-600 hover:text-[#
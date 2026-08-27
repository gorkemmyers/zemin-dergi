'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

const DILLER = [
  { kod: 'tr', ad: 'Türkçe', sesKod: 'tr-TR', bayrak: '🇹🇷' },
  { kod: 'en', ad: 'English', sesKod: 'en-US', bayrak: '🇬🇧' },
  { kod: 'de', ad: 'Deutsch', sesKod: 'de-DE', bayrak: '🇩🇪' },
  { kod: 'fr', ad: 'Français', sesKod: 'fr-FR', bayrak: '🇫🇷' },
  { kod: 'ru', ad: 'Русский', sesKod: 'ru-RU', bayrak: '🇷🇺' },
];

function formatOkumaTarihi(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return null;
  }
}

const getDisiplinStili = (kategori) => {
  switch (kategori) {
    case 'Felsefe':
      return {
        renk: '#74112f',
        rgb: '116, 17, 47',
        badgeBg: 'bg-[#74112f]/15 text-[#74112f]',
        cardBg: 'from-[#74112f]/15 via-[#74112f]/5 to-transparent'
      };
    case 'Sosyoloji':
      return {
        renk: '#00a693',
        rgb: '0, 166, 147',
        badgeBg: 'bg-[#00a693]/15 text-[#00a693]',
        cardBg: 'from-[#00a693]/15 via-[#00a693]/5 to-transparent'
      };
    case 'Psikoloji':
      return {
        renk: '#32127a',
        rgb: '50, 18, 122',
        badgeBg: 'bg-[#32127a]/15 text-[#32127a]',
        cardBg: 'from-[#32127a]/15 via-[#32127a]/5 to-transparent'
      };
    default:
      return {
        renk: '#111827',
        rgb: '17, 24, 39',
        badgeBg: 'bg-gray-100 text-gray-700',
        cardBg: 'from-gray-100 to-transparent'
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
  const [fontBoyut, setFontBoyut] = useState('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [seciliDil, setSeciliDil] = useState('tr');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState({});

  // Motivasyon Özellikleri State'leri
  const [alkisSayisi, setAlkisSayisi] = useState(yazi?.alkis_sayisi || 0);
  const [alkislaniyor, setAlkislaniyor] = useState(false);
  const [kopyalandiBildirim, setKopyalandiBildirim] = useState('');

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const canvasRef = useRef(null);
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const langMenuRef = useRef(null);

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

  // 1. Düşünce İzi (Alkış) Bırakma
  const handleAlkisla = async () => {
    if (alkislaniyor) return;
    setAlkislaniyor(true);
    const yeniSayi = alkisSayisi + 1;
    setAlkisSayisi(yeniSayi);

    try {
      await supabase
        .from('yazilar')
        .update({ alkis_sayisi: yeniSayi })
        .eq('id', yazi.id);
    } catch (e) {
      console.error('Etkileşim kaydedilemedi:', e);
    } finally {
      setTimeout(() => setAlkislaniyor(false), 300);
    }
  };

  // 2. APA Formatında Alıntı Künyesi Kopyalama
  const handleAlintiKopyala = async () => {
    const yazarIsmi = yazi.yazarlar?.ad_soyad || 'Zemin Yazarı';
    const yayinYili = yazi.yayin_tarihi ? new Date(yazi.yayin_tarihi).getFullYear() : '2026';
    const apaMetni = `${yazarIsmi} (${yayinYili}). "${aktifBaslik}". ZEMİN — Açık Düşünce İnisiyatifi${yazi.dergiler ? `, Sayı ${yazi.dergiler.sayi_no}` : ''}. ${typeof window !== 'undefined' ? window.location.href : ''}`;

    try {
      await navigator.clipboard.writeText(apaMetni);
      setKopyalandiBildirim('Alıntı künyesi kopyalandı');
      setTimeout(() => setKopyalandiBildirim(''), 2500);
    } catch (e) {
      alert('Alıntı kopyalanamadı.');
    }
  };

  // 3. Yazdır / Temiz PDF Çıktısı Al
  const handleYazdir = () => {
    window.print();
  };

  // 1080x1920 Story Motoru
  useEffect(() => {
    if (!isStoryOpen || !canvasRef.current || !yazi) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const renderCanvas = (coverImg = null) => {
      ctx.fillStyle = '#F4F5F7';
      ctx.fillRect(0, 0, width, height);

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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.restore();

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

      let currentY = headerY + 50;

      if (coverImg) {
        const imgSize = 760;
        const imgX = cardX + (cardW - imgSize) / 2;
        const imgY = currentY;
        const imgRadius = 32;

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

        currentY = imgY + imgSize + 45;
      } else {
        currentY += 30;
      }

      ctx.fillStyle = '#111827';
      ctx.font = '900 48px sans-serif';

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

      const sonBaslikY = wrapText(aktifBaslik, cardX + 60, currentY, cardW - 120, 60, 3);

      const spotMetin = (aktifIcerik || '').replace(/[\n\r]/g, ' ').slice(0, 90) + '...';
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 24px serif';
      wrapText(`“${spotMetin}”`, cardX + 60, sonBaslikY + 45, cardW - 120, 34, 2);

      const footerY = cardY + cardH - 120;
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
      ctx.font = '900 36px sans-serif';
      ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', cardX + 60, footerY + 56);

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
      if (uygunSes) utterance.voice = uygunSes;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleRastgele = async () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
        <h1 className="text-lg font-black text-gray-900 mb-2">Metin Bulunamadı</h1>
        <Link href="/" className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const kelimeSayisi = (aktifIcerik || '').trim().split(/\s+/).length;
  const okumaSuresi = Math.max(1, Math.ceil(kelimeSayisi / 200));
  const yayinTarihiFormat = formatOkumaTarihi(yazi.yayin_tarihi || yazi.olusturulma_tarihi || yazi.created_at);

  const getMetinPuntosu = () => {
    switch (fontBoyut) {
      case 'kucuk':
        return 'text-[13.5px] sm:text-[14px] leading-[1.7]';
      case 'buyuk':
        return 'text-[16px] sm:text-[16.5px] leading-[1.8]';
      default:
        return 'text-[14.5px] sm:text-[15px] leading-[1.75]';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative selection:bg-[#74112f]/10 selection:text-[#74112f]">
      
      {/* ÜST OKUMA İLERLEME ÇUBUĞU */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693] z-[99999] transition-all duration-75 ease-out shadow-xs print:hidden"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-3xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-md print:hidden">
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

        {/* METİN KARTI */}
        <article className="glass-card p-6 sm:p-10 border border-white/90 shadow-xl relative print:shadow-none print:border-none print:p-0">
          
          {/* DERGİ SEÇKİSİ MÜHRÜ (EĞER DERGİDE YAYIMLANDIYSA) */}
          {yazi.dergiler && (
            <div className="mb-4 p-2.5 rounded-2xl bg-[#74112f]/10 border border-[#74112f]/25 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#74112f] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#74112f]">
                  ZEMİN Basılı Seçkisi — Sayı {yazi.dergiler.sayi_no}: {yazi.dergiler.baslik}
                </span>
              </div>
              <Link href={`/dergiler`} className="text-[10px] font-bold text-[#74112f] hover:underline whitespace-nowrap">
                Sayıyı İncele →
              </Link>
            </div>
          )}

          {/* ÜST BİLGİ & ARAÇ ÇUBUĞU */}
          <header className="border-b border-gray-200/70 pb-5 mb-6">
            
            {/* ETİKETLER & BUTONLAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#00a693]/15 text-[#00a693] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {yazi.kategori}
                </span>
                {yayinTarihiFormat && (
                  <span className="text-[10px] font-medium text-gray-500 bg-white/80 border border-gray-200/70 px-2.5 py-0.5 rounded-full">
                    {yayinTarihiFormat}
                  </span>
                )}
                <span className="text-[10px] font-medium text-gray-500 bg-white/80 border border-gray-200/70 px-2.5 py-0.5 rounded-full">
                  {okumaSuresi} dk okuma • {kelimeSayisi} kelime
                </span>
              </div>

              {/* SEMBOL / İKON BUTONLARI */}
              <div className="flex items-center gap-1.5 print:hidden">
                
                {/* DİL SEÇİMİ */}
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                    title="Dili Değiştir"
                  >
                    <span>{aktifDilObj.bayrak}</span>
                    <span className="uppercase text-[10px] tracking-wider font-mono">{aktifDilObj.kod}</span>
                    <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-gray-200/80 p-1.5 z-50">
                      {DILLER.map((dil) => (
                        <button
                          key={dil.kod}
                          onClick={() => handleDilDegistir(dil.kod)}
                          className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                            seciliDil === dil.kod ? 'bg-[#32127a] text-white' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{dil.bayrak}</span>
                          <span>{dil.ad}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SESLİ OKUMA İKONU */}
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1.5 rounded-full border transition-all shadow-xs ${
                    isSpeaking
                      ? 'bg-[#74112f] text-white border-[#74112f] animate-pulse'
                      : 'bg-white/80 text-gray-700 hover:bg-white border-gray-200/80'
                  }`}
                  title={isSpeaking ? 'Okumayı Durdur' : 'Sesli Dinle'}
                >
                  {isSpeaking ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                {/* ALINTILA (APA) İKONU */}
                <button
                  onClick={handleAlintiKopyala}
                  className="p-1.5 text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                  title="Akademik Alıntı Künyesini Kopyala"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>

                {/* YAZDIR / PDF İNDİR İKONU */}
                <button
                  onClick={handleYazdir}
                  className="p-1.5 text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                  title="Metni Yazdır / PDF Olarak Kaydet"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>

                {/* STORY İKONU */}
                <button
                  onClick={() => setIsStoryOpen(true)}
                  className="p-1.5 text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                  title="Instagram Story Görseli Oluştur"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="3" strokeWidth="2" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                </button>

                {/* PAYLAŞ İKONU */}
                <button
                  onClick={handleShare}
                  className="p-1.5 text-gray-700 bg-white/80 hover:bg-white border border-gray-200/80 rounded-full transition-all shadow-xs"
                  title="Metni Paylaş"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* PUNTO SEÇİCİ */}
                <div className="flex items-center bg-white/80 border border-gray-200/80 rounded-full p-0.5 shadow-xs text-[10px] font-bold">
                  <button
                    onClick={() => setFontBoyut('kucuk')}
                    className={`px-1.5 py-0.5 rounded-full transition-all ${fontBoyut === 'kucuk' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    title="Küçük Punto"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontBoyut('normal')}
                    className={`px-1.5 py-0.5 rounded-full transition-all ${fontBoyut === 'normal' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    title="Normal Punto"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontBoyut('buyuk')}
                    className={`px-1.5 py-0.5 rounded-full transition-all ${fontBoyut === 'buyuk' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    title="Büyük Punto"
                  >
                    A+
                  </button>
                </div>

              </div>
            </div>

            {/* ALINTI KOPYALANDI BİLDİRİMİ */}
            {kopyalandiBildirim && (
              <div className="mb-3 text-[11px] font-bold text-[#00a693] bg-[#00a693]/10 px-3 py-1.5 rounded-xl border border-[#00a693]/20 animate-fade-in text-center">
                {kopyalandiBildirim}
              </div>
            )}

            {/* BAŞLIK */}
            <h1 className="text-xl sm:text-2xl font-black font-serif text-gray-900 leading-snug tracking-tight mb-4 text-left">
              {isTranslating ? 'Çevriliyor...' : aktifBaslik}
            </h1>

            {/* YAZAR BİLGİSİ */}
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-full bg-[#32127a]/10 border border-[#32127a]/20 flex items-center justify-center text-[11px] font-black text-[#32127a]">
                {(yazi.yazarlar?.ad_soyad || 'Z')[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {yazi.yazarlar?.ad_soyad}
                </h3>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {yazi.yazarlar?.universite ? `${yazi.yazarlar.universite}` : ''}
                  {yazi.yazarlar?.bolum ? ` • ${yazi.yazarlar.bolum}` : ''}
                </p>
              </div>
            </div>

          </header>

          {/* KAPAK GÖRSELİ */}
          {yazi.kapak_url && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs max-h-80 print:hidden">
              <img 
                src={yazi.kapak_url} 
                alt={yazi.baslik} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* AKICI OKUMA ALANI */}
          <div className="max-w-[650px] mx-auto">
            {isTranslating ? (
              <div className="py-16 text-center text-xs font-bold text-gray-400 animate-pulse">
                Metin {aktifDilObj.ad} diline çevriliyor...
              </div>
            ) : (
              <article className="prose prose-neutral max-w-none">
                <div className={`font-serif text-[#222222] font-normal tracking-normal whitespace-pre-line text-justify [text-justify:inter-word] ${getMetinPuntosu()}`}>
                  {aktifIcerik}
                </div>
              </article>
            )}
          </div>

          {/* DÜŞÜNCE İZİ (ALKIŞ) BUTONU & ALINTILAMA BARI */}
          <div className="mt-12 pt-6 border-t border-gray-200/70 max-w-[650px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            
            {/* Alkış Butonu */}
            <button
              onClick={handleAlkisla}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all shadow-xs ${
                alkislaniyor
                  ? 'scale-105 bg-[#74112f] text-white border-[#74112f]'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
              }`}
              title="Bu metni değerli bulduğunuzu belirtin"
            >
              <svg className="w-4 h-4 text-[#74112f]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs font-bold">Düşünce İzi Bırak</span>
              <span className="text-[11px] font-black bg-[#74112f]/10 text-[#74112f] px-2 py-0.5 rounded-full">
                {alkisSayisi}
              </span>
            </button>

            {/* APA Alıntı Butonu */}
            <button
              onClick={handleAlintiKopyala}
              className="text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Akademik Alıntı Yap (APA)
            </button>
          </div>

          {/* YAZAR BİYOGRAFİSİ */}
          {yazi.yazarlar && (
            <div className="mt-8 pt-5 border-t border-gray-200/80 max-w-[650px] mx-auto print:border-t-2">
              <div className="glass-card p-4 border border-gray-200/80 bg-white/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-md">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#74112f]">Yazar Hakkında</span>
                  <h4 className="text-xs font-bold text-gray-900">{yazi.yazarlar.ad_soyad}</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-serif">
                    {yazi.yazarlar.biyografi || 'ZEMİN düşünce topluluğu yazarı.'}
                  </p>
                </div>
                {yazi.yazarlar.instagram && (
                  <a
                    href={`https://instagram.com/${yazi.yazarlar.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-[#00a693]/10 text-gray-800 hover:text-[#00a693] px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap self-end sm:self-center print:hidden"
                  >
                    @{yazi.yazarlar.instagram}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* İLGİLİ DİĞER YAZILAR */}
          {ilgiliYazilar.length > 0 && (
            <div className="mt-8 pt-5 border-t border-gray-200/80 max-w-[650px] mx-auto space-y-2.5 print:hidden">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-900">
                Bu Alandaki Diğer Metinler
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ilgiliYazilar.map((iy) => (
                  <Link
                    key={iy.id}
                    href={`/yazi/${iy.slug}`}
                    className="glass-card p-3 border border-gray-200/70 bg-white hover:border-[#32127a] transition-all block group"
                  >
                    <span className="text-[8.5px] font-bold uppercase text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                      {iy.kategori}
                    </span>
                    <h4 className="font-bold text-[11px] text-gray-900 group-hover:text-[#32127a] transition-colors mt-1.5 line-clamp-2">
                      {iy.baslik}
                    </h4>
                    <p className="text-[9.5px] text-gray-500 mt-1">{iy.yazarlar?.ad_soyad}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* GERİ DÖN BAĞLANTISI */}
          <div className="text-center mt-10 print:hidden">
            <Link 
              href="/yazilar" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#74112f] transition-colors"
            >
              ← Tüm Metin Arşivine Dön
            </Link>
          </div>

        </article>

      </main>

      {/* STORY MODALI */}
      {isStoryOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden">
          <div className="glass-card max-w-sm w-full p-5 rounded-3xl border border-white/90 shadow-2xl relative text-center">
            <button
              onClick={() => setIsStoryOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              ✕
            </button>
            <span className="text-[10px] uppercase tracking-widest text-[#74112f] font-black block mb-2">
              Story Kartı
            </span>
            {storyImageUrl && (
              <img
                src={storyImageUrl}
                alt="Story Önizleme"
                className="w-full h-auto rounded-2xl shadow-md border border-gray-200 mb-4 max-h-[60vh] object-contain mx-auto"
              />
            )}
            <button
              onClick={handleStoryShare}
              className="w-full bg-[#32127a] hover:bg-[#74112f] text-white py-2.5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md"
            >
              Görseli İndir / Paylaş
            </button>
          </div>
        </div>
      )}

      {/* GİZLİ CANVAS */}
      <canvas ref={canvasRef} className="hidden" />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200/70 bg-white py-6 text-center text-xs font-semibold text-gray-500 print:hidden">
        ZEMİN — Açık Düşünce İnisiyatifi © 2026
      </footer>

    </div>
  );
}

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

  // Düşünce İzi State
  const [alkisSayisi, setAlkisSayisi] = useState(yazi?.alkis_sayisi || 0);
  const [izBirakildi, setIzBirakildi] = useState(false);
  const [kunyeKopyalandi, setKunyeKopyalandi] = useState(false);

  // Metin Seçimi ve Kare Alıntı Kartı State'leri
  const [secilenMetin, setSecilenMetin] = useState('');
  const [isAlintiModalOpen, setIsAlintiModalOpen] = useState(false);
  const [alintiGorselUrl, setAlintiGorselUrl] = useState('');

  const articleRef = useRef(null);
  const canvasRef = useRef(null);
  const langMenuRef = useRef(null);

  // LocalStorage Kontrolü (Düşünce İzi)
  useEffect(() => {
    if (typeof window !== 'undefined' && yazi?.id) {
      const kaydedilmis = localStorage.getItem(`zemin_iz_${yazi.id}`);
      if (kaydedilmis === 'true') {
        setIzBirakildi(true);
      }
    }
  }, [yazi?.id]);

  // Dış Tıklama ve İlerleme Takibi
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

  // Akıllı Künyeli Kopyalama
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

      const selectedStr = selection.toString().trim();
      if (selectedStr.length < 10) return;

      if (articleRef.current && articleRef.current.contains(selection.anchorNode)) {
        e.preventDefault();
        const yayinYili = yazi?.yayin_tarihi ? new Date(yazi.yayin_tarihi).getFullYear() : '2026';
        const yazarAd = yazi?.yazarlar?.ad_soyad || 'Zemin Yazarı';
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

        const zeminMetni = `“${selectedStr}”\n\n— ${yazarAd}, “${yazi?.baslik}”, ZEMİN (${yayinYili})\n${currentUrl}`;

        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', zeminMetni);
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [yazi]);

  // Mobil ve Masaüstü Seçim Takibi (selectionchange)
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (text.length >= 8 && articleRef.current && articleRef.current.contains(selection.anchorNode)) {
        setSecilenMetin(text);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const aktifBaslik = seciliDil === 'tr' ? yazi?.baslik : (translations[seciliDil]?.baslik || yazi?.baslik);
  const aktifIcerik = seciliDil === 'tr' ? yazi?.icerik : (translations[seciliDil]?.icerik || yazi?.icerik);
  const aktifDilObj = DILLER.find((d) => d.kod === seciliDil) || DILLER[0];

  // Düşünce İzi Bırakma
  const handleDusunceIziBirak = async () => {
    if (izBirakildi || !yazi?.id) return;

    const yeniSayi = alkisSayisi + 1;
    setAlkisSayisi(yeniSayi);
    setIzBirakildi(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`zemin_iz_${yazi.id}`, 'true');
    }

    try {
      await supabase
        .from('yazilar')
        .update({ alkis_sayisi: yeniSayi })
        .eq('id', yazi.id);
    } catch (err) {
      console.error('Düşünce izi kaydedilemedi:', err);
    }
  };

  // Akademik Künye Kopyalama
  const handleKunyeKopyala = async () => {
    const yazarAd = yazi?.yazarlar?.ad_soyad || 'Zemin Yazarı';
    const yayinYili = yazi?.yayin_tarihi ? new Date(yazi.yayin_tarihi).getFullYear() : '2026';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const dergiDetay = yazi?.dergiler ? `, Sayı ${yazi.dergiler.sayi_no}` : '';

    const apaFormat = `${yazarAd} (${yayinYili}). "${aktifBaslik}". ZEMİN — Açık Düşünce İnisiyatifi${dergiDetay}. ${currentUrl}`;

    try {
      await navigator.clipboard.writeText(apaFormat);
      setKunyeKopyalandi(true);
      setTimeout(() => setKunyeKopyalandi(false), 2500);
    } catch (e) {
      alert('Künye kopyalanamadı.');
    }
  };

  // 1080x1080 TAM KARE TİPOGRAFİK ALINTI KARTI MOTORU
  useEffect(() => {
    if (!isAlintiModalOpen || !canvasRef.current || !yazi) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // 1. Zemin (Sıcak Fildişi)
    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, size, size);

    // 2. Zarif İnce İç Çerçeve
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#E8E5DD';
    ctx.strokeRect(50, 50, size - 100, size - 100);

    // 3. Üst Başlık (ZEMİN Logo + Kategori)
    ctx.fillStyle = '#74112f';
    ctx.font = '900 38px sans-serif';
    ctx.fillText('ZEMİN', 90, 130);

    ctx.fillStyle = '#00a693';
    ctx.font = '800 16px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText((yazi.kategori || 'FELSEFE').toUpperCase(), size - 250, 126);
    ctx.letterSpacing = '0px';

    // Üst Çizgi
    ctx.fillStyle = '#E8E5DD';
    ctx.fillRect(90, 160, size - 180, 1.5);

    // 4. Seçilen Vurucu Cümle Metni
    const metin = secilenMetin || aktifBaslik;
    const kelimeAdedi = metin.split(' ').length;
    
    // Kelime uzunluğuna göre dinamik punto
    let fontSize = 42;
    let lineHeight = 64;
    if (kelimeAdedi > 35) {
      fontSize = 32;
      lineHeight = 50;
    } else if (kelimeAdedi > 20) {
      fontSize = 36;
      lineHeight = 56;
    }

    ctx.fillStyle = '#1C1917';
    ctx.font = `italic ${fontSize}px Georgia, "Times New Roman", serif`;

    const wrapText = (text, x, y, maxWidth, lHeight, maxLines = 8) => {
      const words = text.split(' ');
      let line = '';
      let lineCount = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lHeight;
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

    const alintiBaslangicY = 280;
    wrapText(`“${metin}”`, 90, alintiBaslangicY, size - 180, lineHeight, 7);

    // 5. Alt Künye & Yazar İmzası
    const footerY = size - 150;
    ctx.fillStyle = '#E8E5DD';
    ctx.fillRect(90, footerY - 30, size - 180, 1.5);

    ctx.fillStyle = '#1C1917';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(yazi.yazarlar?.ad_soyad || 'Zemin Yazarı', 90, footerY + 20);

    ctx.fillStyle = '#78716C';
    ctx.font = '500 18px Georgia, serif';
    const altMetin = `${aktifBaslik} • ZEMİN Düşünce Arşivi`;
    ctx.fillText(altMetin.length > 55 ? altMetin.slice(0, 52) + '...' : altMetin, 90, footerY + 56);

    setAlintiGorselUrl(canvas.toDataURL('image/png'));
  }, [isAlintiModalOpen, secilenMetin, yazi, aktifBaslik]);

  // Kare Görseli Paylaş / İndir
  const handleAlintiPaylasVeyaIndir = async () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `zemin-${yazi.slug}.png`, { type: 'image/png' });

      // Mobil cihazlarda doğrudan Instagram Hikaye/Galeri paylaşımı açar
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'ZEMİN Alıntı',
            text: window.location.href,
          });
        } catch (err) {}
      } else {
        const a = document.createElement('a');
        a.href = alintiGorselUrl;
        a.download = `zemin-alinti-${yazi.slug}.png`;
        a.click();
      }
    }, 'image/png');
  };

  // Dil ve Sesli Okuma
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
      const uygunSes = mevcutSesler.find((v) => v.lang.toLowerCase().startsWith(aktifDilObj.kod));
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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#74112f] via-[#32127a] to-[#00a693] z-[99999] transition-all duration-75 ease-out shadow-xs"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* METİN SEÇİLDİĞİNDE BELİREN MOBİL & MASAÜSTÜ ALINTI ÇUBUĞU */}
      {secilenMetin && !isAlintiModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-[90%] sm:w-auto text-center">
          <button
            onClick={() => setIsAlintiModalOpen(true)}
            className="bg-[#1C1917] hover:bg-[#74112f] text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 mx-auto"
          >
            <span>✦</span>
            <span>Seçilen Cümleyi Alıntı Kartı Yap</span>
          </button>
        </div>
      )}

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 md:pt-6 pb-20 relative z-10">
        
        {/* NAVBAR */}
        <header className="glass-panel mx-auto max-w-3xl p-3 sm:p-4 mb-8 sticky top-3 z-50 rounded-2xl sm:rounded-3xl border border-white/80 shadow-md">
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
        <article className="glass-card p-6 sm:p-10 border border-white/90 shadow-xl relative">
          
          {/* DİNGİN DERGİ SEÇKİSİ MÜHRÜ */}
          {yazi.dergiler && (
            <div className="mb-4 px-3.5 py-2 rounded-xl bg-stone-100/90 border border-stone-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#74112f] text-xs">●</span>
                <span className="text-[10px] font-bold tracking-wide text-stone-700">
                  ZEMİN Seçkisi — Sayı {yazi.dergiler.sayi_no}: {yazi.dergiler.baslik}
                </span>
              </div>
              <Link href="/dergiler" className="text-[10px] font-bold text-stone-500 hover:text-stone-900 whitespace-nowrap">
                Sayıyı İncele →
              </Link>
            </div>
          )}

          {/* ÜST BİLGİ & SADELEŞTİRİLMİŞ ARAÇ ÇUBUĞU */}
          <header className="border-b border-gray-200/70 pb-5 mb-6">
            
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
                  {okumaSuresi} dk okuma
                </span>
                
                {/* Üst Düşünce İzi Sayacı */}
                <span className="text-[10px] font-bold text-[#74112f] bg-[#74112f]/10 border border-[#74112f]/20 px-2.5 py-0.5 rounded-full">
                  ✦ {alkisSayisi} Düşünce İzi
                </span>
              </div>

              {/* ARAÇ BUTONLARI (DİL + SESLİ DİNLE + PUNTO) */}
              <div className="flex items-center gap-1.5">
                
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
            <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs max-h-80">
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
          <div ref={articleRef} className="max-w-[650px] mx-auto">
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

          {/* DÜŞÜNCE İZİ (TEK TIKLAMALI BEĞENİ BUTONU) */}
          <div className="mt-12 pt-6 border-t border-gray-200/70 max-w-[650px] mx-auto flex justify-center">
            <button
              onClick={handleDusunceIziBirak}
              disabled={izBirakildi}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
                izBirakildi
                  ? 'bg-[#74112f] text-white border-[#74112f] cursor-default shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90 shadow-sm active:scale-95'
              }`}
            >
              <span className="text-sm">✦</span>
              <span className="text-xs font-bold">
                {izBirakildi ? 'Düşünce İzi Bırakıldı' : 'Düşünce İzi Bırak'}
              </span>
              <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${izBirakildi ? 'bg-white/20 text-white' : 'bg-[#74112f]/10 text-[#74112f]'}`}>
                {alkisSayisi}
              </span>
            </button>
          </div>

          {/* AKADEMİK ATIF & KÜNYE KUTUSU */}
          <div className="mt-8 max-w-[650px] mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                Akademik Atıf & Künye (APA)
              </span>
              <button
                onClick={handleKunyeKopyala}
                className="text-[11px] font-bold text-[#74112f] hover:underline"
              >
                {kunyeKopyalandi ? '✓ Kopyalandı' : 'Künyeyi Kopyala'}
              </button>
            </div>
            <p className="text-[11px] text-stone-700 font-mono bg-white p-2.5 rounded-xl border border-stone-200/60 break-all leading-relaxed select-all">
              {yazi.yazarlar?.ad_soyad || 'Zemin Yazarı'} ({yazi.yayin_tarihi ? new Date(yazi.yayin_tarihi).getFullYear() : '2026'}). "{aktifBaslik}". ZEMİN — Açık Düşünce İnisiyatifi{yazi.dergiler ? `, Sayı ${yazi.dergiler.sayi_no}` : ''}.
            </p>
          </div>

          {/* YAZAR BİYOGRAFİSİ */}
          {yazi.yazarlar && (
            <div className="mt-8 pt-5 border-t border-gray-200/80 max-w-[650px] mx-auto">
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
                    className="bg-gray-100 hover:bg-[#00a693]/10 text-gray-800 hover:text-[#00a693] px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap self-end sm:self-center"
                  >
                    @{yazi.yazarlar.instagram}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* İLGİLİ DİĞER YAZILAR */}
          {ilgiliYazilar.length > 0 && (
            <div className="mt-8 pt-5 border-t border-gray-200/80 max-w-[650px] mx-auto space-y-2.5">
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
          <div className="text-center mt-10">
            <Link 
              href="/yazilar" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#74112f] transition-colors"
            >
              ← Tüm Metin Arşivine Dön
            </Link>
          </div>

        </article>

      </main>

      {/* 1:1 TAM KARE ALINTI KARTI MODALI */}
      {isAlintiModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-5 rounded-3xl border border-white/90 shadow-2xl relative text-center">
            <button
              onClick={() => setIsAlintiModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              ✕
            </button>
            <span className="text-[10px] uppercase tracking-widest text-[#74112f] font-black block mb-3">
              1:1 Kare Alıntı Kartı
            </span>
            {alintiGorselUrl && (
              <img
                src={alintiGorselUrl}
                alt="Alıntı Önizleme"
                className="w-full aspect-square rounded-2xl shadow-md border border-gray-200 mb-4 object-cover mx-auto"
              />
            )}
            <button
              onClick={handleAlintiPaylasVeyaIndir}
              className="w-full bg-[#1C1917] hover:bg-[#74112f] text-white py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
            >
              Hikayede Paylaş / Görseli İndir
            </button>
          </div>
        </div>
      )}

      {/* GİZLİ CANVAS */}
      <canvas ref={canvasRef} className="hidden" />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200/70 bg-white py-6 text-center text-xs font-semibold text-gray-500">
        ZEMİN — Açık Düşünce İnisiyatifi © 2026
      </footer>

    </div>
  );
}

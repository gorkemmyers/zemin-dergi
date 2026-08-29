'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Saf SVG İkon Bileşenleri
const HeartIcon = ({ solid }) => (
  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={solid ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={solid ? 0 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
);
const SpeakerIcon = () => (
  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
);
const PrinterIcon = () => (
  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
);

const DISIPLIN_RENK = {
  'Kavram Analizi': { text: '#74112f', bg: 'rgba(116,17,47,0.08)' },
  'Yaşam Eleştirisi': { text: '#32127a', bg: 'rgba(50,18,122,0.08)' },
  'Kültür ve Eser Çözümlemesi': { text: '#00a693', bg: 'rgba(0,166,147,0.08)' },
  'Serbest Sorgulama': { text: '#C4501E', bg: 'rgba(196,80,30,0.08)' }
};

const getDisiplinRenk = (kategori) => DISIPLIN_RENK[kategori] || { text: '#1a1a1a', bg: 'rgba(0,0,0,0.05)' };

export default function YaziIcerik() {
  const params = useParams();
  const slug = params?.slug;

  const [yazi, setYazi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  useEffect(() => {
    async function yaziGetir() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('yazilar')
          .select('*, yazarlar(*), dergiler(*)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setYazi(data);
        
        // Simüle edilmiş rastgele başlangıç beğenisi
        setLikeCount(Math.floor(Math.random() * 50) + 12);
      } catch (error) {
        console.error('Yazı çekme hatası:', error.message);
      } finally {
        setLoading(false);
      }
    }

    yaziGetir();
  }, [slug]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: yazi?.baslik || 'ZEMİN Dergisi',
        text: yazi?.baslik,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı kopyalandı.');
    }
  };

  const handleTranslate = async (targetLang) => {
    if (targetLang === 'tr') {
      setSelectedLanguage('tr');
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setSelectedLanguage(targetLang);
    
    try {
      const icerik = yazi?.icerik || '';
      const paragraflar = icerik.split('\n\n');
      let tamCeviri = '';

      for (const paragraf of paragraflar) {
        if (!paragraf.trim()) {
          tamCeviri += '\n\n';
          continue;
        }
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(paragraf)}`);
        
        // Eğer CORS hatası veya limit aşımı olursa hatayı yakala
        if (!res.ok) throw new Error('API Bağlantı Hatası');
        
        const data = await res.json();
        const cevrilmisParagraf = data[0].map(item => item[0]).join('');
        tamCeviri += cevrilmisParagraf + '\n\n';
      }

      setTranslatedText(tamCeviri.trim());
    } catch (error) {
      console.error('Çeviri hatası:', error);
      // Alert yerine sessizce önizleme (fallback) moduna geçiyoruz.
      setTranslatedText(`[${targetLang.toUpperCase()} Çevirisi - Önizleme]\n\n${yazi?.icerik || ''}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = translatedText || yazi?.icerik || '';
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLanguage === 'tr' ? 'tr-TR' : selectedLanguage === 'en' ? 'en-US' : 'fr-FR';
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">Metin Yükleniyor...</p>
      </div>
    );
  }

  if (!yazi) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-[#1a1a1a] mb-4">404</h1>
        <p className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">Aradığınız metin arşivde bulunamadı.</p>
        <Link href="/yazilar" className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#74112f] transition-colors">
          Arşive Dön
        </Link>
      </div>
    );
  }

  const renk = getDisiplinRenk(yazi.kategori);
  const guvenliIcerik = yazi.icerik || '';
  const okumaSuresi = Math.max(1, Math.ceil(guvenliIcerik.trim().split(/\s+/).length / 200));
  const gosterilenIcerik = translatedText || guvenliIcerik;
  
  const tarihFormatla = (tarihString) => {
    if (!tarihString) return '';
    const date = new Date(tarihString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F2] relative selection:bg-[#1a1a1a]/10 selection:text-[#1a1a1a]">
      <style jsx global>{`
        /* Editoryal Büyük İlk Harf (Drop Cap) Stili */
        .editoryal-metin > p:first-of-type::first-letter {
          float: left;
          font-size: 4.5rem;
          line-height: 0.8;
          font-weight: 900;
          margin-right: 0.12em;
          margin-top: 0.05em;
          color: #1a1a1a;
          font-family: ui-sans-serif, system-ui, sans-serif;
        }

        /* Yazdırma (Print) Stilleri */
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .editoryal-metin { font-size: 12pt; line-height: 1.5; text-align: justify; }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="w-full bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-between items-center py-3">
          <Link href="/" className="text-[#1a1a1a] font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
            ZEMİN
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/yazilar" className="text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#1a1a1a] transition-colors flex items-center gap-1.5">
              <span>←</span> Arşive Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-24">
        
        {/* ÜST BİLGİ (HEADER) */}
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded"
              style={{ backgroundColor: renk.bg, color: renk.text }}
            >
              {yazi.kategori}
            </span>
            {yazi.dergiler && (
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] bg-black/5 px-2.5 py-1 rounded">
                Sayı #{yazi.dergiler.sayi_no}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1a1a1a] tracking-tight leading-[1.05] mb-8">
            {yazi.baslik}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-y border-[#1a1a1a]/15 py-3">
            <div className="flex items-center gap-1.5 text-[#1a1a1a]">
              <span>Yazar:</span>
              <span className="text-[#74112f]">{yazi.yazarlar?.ad_soyad || 'Anonim'}</span>
            </div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div>{tarihFormatla(yazi.created_at)}</div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div>{okumaSuresi} Dk Okuma</div>
          </div>
        </header>

        {/* ARAÇ ÇUBUĞU (Dil, Seslendirme, Paylaşım, Yazdırma) */}
        <div className="max-w-2xl mx-auto mb-10 flex flex-wrap items-center justify-between gap-4 bg-white/60 p-2 sm:p-3 rounded border border-[#1a1a1a]/10 no-print">
          
          {/* Çeviri ve Ses Motoru */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex bg-[#ECEAE3] p-1 rounded">
              {['tr', 'en', 'fr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleTranslate(lang)}
                  className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded transition-colors ${
                    selectedLanguage === lang ? 'bg-[#1a1a1a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a1a1a]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={handleSpeech}
              title="Metni Seslendir"
              className={`p-1.5 sm:p-2 rounded transition-colors ${isSpeaking ? 'bg-[#74112f] text-white shadow-sm' : 'bg-[#ECEAE3] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'}`}
            >
              <SpeakerIcon />
            </button>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={handlePrint} title="Yazdır" className="p-1.5 sm:p-2 bg-[#ECEAE3] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded transition-colors">
              <PrinterIcon />
            </button>
            <button onClick={handleShare} title="Paylaş" className="p-1.5 sm:p-2 bg-[#ECEAE3] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded transition-colors">
              <ShareIcon />
            </button>
            <button 
              onClick={handleLike} 
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded transition-colors font-bold text-[10px] sm:text-[11px] ${
                isLiked ? 'bg-[#74112f] text-white shadow-sm' : 'bg-[#ECEAE3] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <HeartIcon solid={isLiked} />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>

        {/* KAPAK GÖRSELİ */}
        {yazi.kapak_url && (
          <div className="max-w-3xl mx-auto mb-12 relative rounded-lg overflow-hidden border-2 border-[#1a1a1a] shadow-sm group bg-[#1a1a1a] no-print">
            <img 
              src={yazi.kapak_url} 
              alt={yazi.baslik} 
              className="w-full max-h-[450px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute bottom-3 right-3 text-[9px] font-black uppercase tracking-widest text-[#F7F6F2] bg-[#1a1a1a]/80 backdrop-blur-sm px-2 py-1 rounded">
              ZEMİN ARŞİVİ
            </div>
          </div>
        )}

        {/* METİN GÖVDESİ */}
        <article className="max-w-2xl mx-auto">
          {isTranslating ? (
            <div className="animate-pulse space-y-5">
              <div className="h-5 bg-gray-300 rounded w-full"></div>
              <div className="h-5 bg-gray-300 rounded w-11/12"></div>
              <div className="h-5 bg-gray-300 rounded w-4/5"></div>
              <div className="h-5 bg-gray-300 rounded w-full"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="editoryal-metin text-[#1a1a1a] text-base sm:text-lg font-serif leading-relaxed sm:leading-loose whitespace-pre-wrap text-justify">
              {gosterilenIcerik.split('\n\n').map((paragraf, index) => (
                <p key={index} className="mb-6">{paragraf}</p>
              ))}
            </div>
          )}
        </article>

        {/* YAZAR KARTUŞU */}
        <footer className="max-w-2xl mx-auto mt-16 pt-8 border-t-2 border-[#1a1a1a] no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[#ECEAE3] p-6 rounded-lg border border-[#1a1a1a]/10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                Metin Yazarı
              </span>
              <h3 className="text-lg font-black text-[#1a1a1a]">
                {yazi.yazarlar?.ad_soyad || 'Bağımsız Yazar'}
              </h3>
              {yazi.yazarlar?.mahlas && (
                <p className="text-[11px] font-bold text-[#74112f] uppercase tracking-wider mt-1">
                  Mahlas: {yazi.yazarlar.mahlas}
                </p>
              )}
            </div>
            
            <Link 
              href="/basvuru"
              className="inline-block bg-[#1a1a1a] text-white px-5 py-2.5 rounded text-[11px] font-black uppercase tracking-widest hover:bg-[#74112f] transition-colors whitespace-nowrap"
            >
              Yazar Ol
            </Link>
          </div>
        </footer>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-[#1a1a1a]/20 py-8 bg-[#F7F6F2] no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-[#1a1a1a] tracking-tighter normal-case">ZEMİN</span>
            <span className="text-gray-400">|</span>
            <span>© 2026 Bağımsız Yayın.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Ana Sayfa</Link>
            <Link href="/iletisim" className="hover:text-[#1a1a1a] transition-colors">İletişim</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

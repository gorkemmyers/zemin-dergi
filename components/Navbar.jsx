import Link from 'next/link';

const navLinkClass =
  "relative whitespace-nowrap pb-1 text-zemin-murekkep/75 hover:text-zemin-kil transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-zemin-kil after:transition-all hover:after:w-full";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-zemin-kagit/95 backdrop-blur border-b border-zemin-cizgi">
      <div className="bg-zemin-murekkep text-zemin-kagit text-[11px] py-1.5 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="uppercase tracking-widest text-[10px] font-semibold">
            Açık Düşünce & Üniversite İnisiyatifi
          </span>
          <span className="hidden sm:inline font-serif italic text-xs text-zemin-kagit/80">
            Felsefe · Sosyoloji · Psikoloji · Kültür
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <span className="w-2 h-2 rounded-full bg-zemin-kil group-hover:scale-125 transition-transform" />
          <span className="font-serif text-2xl font-black tracking-tight text-zemin-murekkep">ZEMİN</span>
        </Link>

        <nav className="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar text-xs uppercase tracking-[0.14em] font-bold">
          <Link href="/" className={navLinkClass}>Tüm Yazılar</Link>
          <Link href="/dergiler" className={navLinkClass}>Dergiler</Link>
          <Link href="/yazarlar" className={navLinkClass}>Yazarlar</Link>
          <Link href="/sss" className={navLinkClass}>Yayın İlkeleri</Link>
          <Link href="/iletisim" className={navLinkClass}>İletişim</Link>
        </nav>

        <Link
          href="/basvuru"
          className="shrink-0 bg-zemin-kil text-zemin-kagit px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-zemin-kilkoyu hover:-translate-y-0.5 transition-all"
        >
          + Metin Gönder
        </Link>
      </div>
    </header>
  );
}

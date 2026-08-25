export default function IletisimPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="border-b border-[#E3DDD3] pb-6 mb-12">
        <span className="text-xs uppercase tracking-widest text-[#5E7362] font-semibold">Bağlantı</span>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-1">İletişim & Künye</h1>
        <p className="text-xs md:text-sm text-[#1A1A1A]/70 mt-3 leading-relaxed">
          ZEMİN editoryal kuruluna ulaşmak, iş birliği veya geri bildirim sağlamak için iletişim kanalları.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          <div className="border border-[#E3DDD3] p-6 bg-[#F7F5F0]">
            <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-1">Editoryal İletişim</span>
            <h3 className="font-editorial text-xl font-bold text-[#1A1A1A] mb-2">Yazı Masası</h3>
            <p className="text-xs text-[#1A1A1A]/70 mb-4 leading-relaxed">
              Yazı başvuruları, hakemlik süreçleri ve editoryal düzeltmeler için:
            </p>
            <p className="text-sm font-semibold text-[#4E141E]">editor@zemindergi.com</p>
          </div>

          <div className="border border-[#E3DDD3] p-6 bg-[#F7F5F0]">
            <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-1">Sosyal Ağlar</span>
            <h3 className="font-editorial text-xl font-bold text-[#1A1A1A] mb-2">Takip & Topluluk</h3>
            <p className="text-xs text-[#1A1A1A]/70 mb-4 leading-relaxed">
              Aylık seçki duyuruları ve açık çağrılar için bizi takip edin:
            </p>
            <p className="text-sm font-semibold text-[#5E7362]">@zemindergi</p>
          </div>
        </div>

        {/* Künye / Yayın Manifestosu */}
        <div className="border border-[#E3DDD3] p-8 bg-[#F7F5F0] flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#5E7362] font-semibold block mb-2">Künye</span>
            <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A] mb-4">ZEMİN İnisiyatifi</h3>
            <div className="space-y-3 text-xs text-[#1A1A1A]/80 leading-relaxed">
              <p><strong className="text-[#1A1A1A]">Yayın Türü:</strong> Bağımsız Süreli ve Süresiz Açık Web Arşivi</p>
              <p><strong className="text-[#1A1A1A]">Odak:</strong> Felsefe, Sosyoloji, Psikoloji, Kültürel İncelemeler</p>
              <p><strong className="text-[#1A1A1A]">Yayın İlkeleri:</strong> Açık Erişim, Hakemli Öğrenci İncelemesi</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#E3DDD3] text-[11px] text-[#1A1A1A]/60 italic">
            "Düşüncenin zemini özgür tartışmadır."
          </div>
        </div>
      </div>
    </main>
  );
}

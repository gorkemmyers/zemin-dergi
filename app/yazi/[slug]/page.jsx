import { supabase } from '../../../lib/supabase';
import YaziIcerik from './YaziIcerik';

// Sosyal Medya (WhatsApp, Twitter, Instagram) Kart Önizleme Ayarları
export async function generateMetadata({ params }) {
  const { data: yazi } = await supabase
    .from('yazilar')
    .select('baslik, yazarlar(ad_soyad)')
    .eq('slug', params.slug)
    .eq('durum', 'onaylandi')
    .single();

  if (!yazi) return { title: 'Bulunamadı | ZEMİN' };

  return {
    title: `${yazi.baslik} | ${yazi.yazarlar?.ad_soyad}`,
    description: 'ZEMİN | Açık Düşünce İnisiyatifi',
    openGraph: {
      title: yazi.baslik,
      description: `${yazi.yazarlar?.ad_soyad} tarafından kaleme alındı. Zemin arşivinde okuyun.`,
      siteName: 'ZEMİN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: yazi.baslik,
      description: `${yazi.yazarlar?.ad_soyad} | ZEMİN`,
    }
  };
}

// Veriyi çekip görsel tasarıma (Client) aktaran yapı
export default async function YaziDetayServerPage({ params }) {
  const { data: yazi } = await supabase
    .from('yazilar')
    .select(`
      id, baslik, slug, kategori, icerik, olusturulma_tarihi,
      dergiler (id, sayi_no, baslik),
      yazarlar (id, ad_soyad, slug, universite, bolum, instagram, biyografi)
    `)
    .eq('slug', params.slug)
    .eq('durum', 'onaylandi')
    .single();

  return <YaziIcerik yazi={yazi} />;
}

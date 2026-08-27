import { supabase } from '../../../lib/supabase';
import YaziIcerik from './YaziIcerik';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data: yazi } = await supabase
    .from('yazilar')
    .select('baslik, kapak_url, yazarlar(ad_soyad)')
    .eq('slug', resolvedParams.slug)
    .eq('durum', 'onaylandi')
    .maybeSingle();

  if (!yazi) return { title: 'Bulunamadı | ZEMİN' };

  return {
    title: `${yazi.baslik} | ${yazi.yazarlar?.ad_soyad}`,
    description: 'ZEMİN | Açık Düşünce İnisiyatifi',
    openGraph: {
      title: yazi.baslik,
      description: `${yazi.yazarlar?.ad_soyad} tarafından kaleme alındı. Zemin arşivinde okuyun.`,
      siteName: 'ZEMİN',
      type: 'article',
      images: yazi.kapak_url ? [{ url: yazi.kapak_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: yazi.baslik,
      description: `${yazi.yazarlar?.ad_soyad} | ZEMİN`,
      images: yazi.kapak_url ? [yazi.kapak_url] : [],
    }
  };
}

export default async function YaziDetayServerPage({ params }) {
  const resolvedParams = await params;
  const { data: yazi } = await supabase
    .from('yazilar')
    .select(`
      id, baslik, slug, kategori, icerik, kapak_url, olusturulma_tarihi, yayin_tarihi,
      dergiler (id, sayi_no, baslik),
      yazarlar (id, ad_soyad, slug, universite, bolum, instagram, biyografi)
    `)
    .eq('slug', resolvedParams.slug)
    .eq('durum', 'onaylandi')
    .maybeSingle();

  let ilgiliYazilar = [];
  if (yazi) {
    const { data: ilgililer } = await supabase
      .from('yazilar')
      .select(`
        id, baslik, slug, kategori, icerik, kapak_url, olusturulma_tarihi, yayin_tarihi,
        yazarlar (ad_soyad, universite)
      `)
      .eq('kategori', yazi.kategori)
      .eq('durum', 'onaylandi')
      .neq('id', yazi.id)
      .order('olusturulma_tarihi', { ascending: false })
      .limit(2);

    if (ilgililer) ilgiliYazilar = ilgililer;
  }

  return <YaziIcerik yazi={yazi} ilgiliYazilar={ilgiliYazilar} />;
}

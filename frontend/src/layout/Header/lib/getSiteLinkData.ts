import { supabase } from "@/supabaseClient";

export interface SiteLinkData {
  id: string;
  slug: string;
  title: string;
}

/**
 * Holt Slug und Titel einer Seite anhand der target_site_id.
 * @param siteId Die ID der Zielseite
 */
export async function getSiteLinkData(siteId: string): Promise<SiteLinkData | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title')
    .eq('id', siteId)
    .single();

  if (error || !data) {
    console.error('Fehler beim Laden der Seitendaten:', error);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
  };
}
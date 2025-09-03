import { supabase } from "@/supabaseClient";
import { type PageBlock } from "@/types/pageBlocks";

// Hole Page ID per Slug
export async function getPageIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching page id", error);
  } else if (!data) {
    console.warn("No page found with slug", slug);
  }

  return data?.id ?? null;
}

// Hole PageBlocks einer Seite
export async function getPageBlocks(pageId: string): Promise<PageBlock[]> {
  const { data, error } = await supabase
    .from("page_blocks")
    .select("id, type, content, order")
    .eq("page_id", pageId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching blocks", error);
    return [];
  }

  if (!data) {
    console.warn("No Data");
  }
  // Wir casten hier direkt auf deine Typen
  return (data || []) as PageBlock[];
}

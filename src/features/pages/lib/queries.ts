// supabase/pages.ts
import { supabase } from "@/supabaseClient";
import type { PageBlock } from "../types/page";

/**
 * Hole Page ID per Slug
 */
export async function getPageIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching page id", error);
    return null;
  }

  return data?.id ?? null;
}

/**
 * Hole PageBlocks einer Seite
 */
export async function getPageBlocks(pageId: string): Promise<PageBlock[]> {
  const { data, error } = await supabase
    .from("page_blocks")
    .select("id, parent_block_id, type, content, order")
    .eq("page_id", pageId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching blocks", error);
    return [];
  }

  if (!data) return [];

  // cast auf PageBlock & build nested structure
  return buildNestedBlocks(data as PageBlock[]);
}

/**
 * Build nested sections recursively
 */
function buildNestedBlocks(blocks: PageBlock[], parentId: string | null = null): PageBlock[] {
  return blocks
    .filter(b => b.parent_block_id === parentId)
    .map(b => {
      if (b.type === "section") {
        const sectionContent = {
          ...b.content,
          content: buildNestedBlocks(blocks, b.id), // nur Section bekommt nested children
        };
        return {
          ...b,
          content: sectionContent,
        };
      }
      return b;
    });
}

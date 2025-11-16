import { supabase } from "@/supabaseClient";
import { getPageIdBySlug, buildNestedBlocks } from "@/features/pages/lib/pageQueries";
import { PageBlocks, type PageBlock } from "@/features/pages/types";

type TimelineEntryBlock = Extract<PageBlock, { type: typeof PageBlocks.TimelineEntry }>;

export interface CurrentTimelineEntryResult {
  entryBlock: TimelineEntryBlock | null;
  children: PageBlock[];
}

/**
 * Holt den aktuellen TimelineEntry per SQL-RPC und baut dessen Kinder
 * mit buildNestedBlocks aus allen page_blocks der Seite.
 */
export async function getCurrentTimelineEntry(
  slug = "tagesablauf"
): Promise<CurrentTimelineEntryResult> {
  const pageId = await getPageIdBySlug(slug);
  if (!pageId) return { entryBlock: null, children: [] };

  // 1) aktuellen TimelineEntry via RPC ermitteln (liefert 0..1 Row)
  const { data: rpcRows, error: rpcError } = await supabase.rpc("get_current_timeline_entries", {
    p_page_id: pageId,
  });
  if (rpcError || !rpcRows || rpcRows.length === 0) {
    if (rpcError) console.error("get_current_timeline_entries failed:", rpcError);
    return { entryBlock: null, children: [] };
  }
  const entry = rpcRows[0] as TimelineEntryBlock;

  // 2) alle Blocks der Seite holen und darunter verschachteln
  const { data: allBlocks, error: blocksError } = await supabase
    .from("page_blocks")
    .select("id, parent_block_id, type, content, order")
    .eq("page_id", pageId)
    .order("order", { ascending: true });

  if (blocksError || !allBlocks) {
    if (blocksError) console.error("load page_blocks failed:", blocksError);
    return { entryBlock: entry, children: [] };
  }

  // 3) Nur die Kinder des ermittelten Entries aufbauen
  const children = buildNestedBlocks(allBlocks as PageBlock[], entry.id);

  return { entryBlock: entry, children };
}
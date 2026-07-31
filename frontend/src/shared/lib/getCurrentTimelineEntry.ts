import { supabase } from "@/supabaseClient";
import { getPageIdBySlug, buildNestedBlocks } from "@/features/pages/lib/pageQueries";
import { PageBlocks, type PageBlock } from "@/features/pages/types";

type TimelineEntryBlock = Extract<PageBlock, { type: typeof PageBlocks.TimelineEntry }>;

export interface CurrentTimelineEntryResult {
  entryBlock: TimelineEntryBlock | null;
  children: PageBlock[];
}

 
export async function getCurrentTimelineEntry(
  slug = "tagesablauf"
): Promise<CurrentTimelineEntryResult> {
  const pageId = await getPageIdBySlug(slug);
  if (!pageId) return { entryBlock: null, children: [] };   const { data: rpcRows, error: rpcError } = await supabase.rpc("get_current_timeline_entries", {
    p_page_id: pageId,
  });
  if (rpcError || !rpcRows || rpcRows.length === 0) {
    if (rpcError) console.error("get_current_timeline_entries failed:", rpcError);
    return { entryBlock: null, children: [] };
  }
  const entry = rpcRows[0] as TimelineEntryBlock;    let descendants: PageBlock[] = [];
  let currentParentIds = [entry.id];    while (currentParentIds.length > 0) {
    const { data: levelBlocks, error: levelError } = await supabase
      .from("page_blocks")
      .select("id, parent_block_id, type, content, order")
      .in("parent_block_id", currentParentIds)
      .order("order", { ascending: true });

    if (levelError) {
      console.error("fetchDescendants failed", levelError);
      break;
    }

    if (!levelBlocks || levelBlocks.length === 0) {
      break;
    }

    const newBlocks = levelBlocks as PageBlock[];
    descendants = [...descendants, ...newBlocks];     currentParentIds = newBlocks.map((b) => b.id);
  }   const children = buildNestedBlocks(descendants, entry.id);

  return { entryBlock: entry, children };
}
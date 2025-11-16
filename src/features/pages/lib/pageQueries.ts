import { supabase } from "@/supabaseClient";
import { PageBlocks, type PageBlock, type TimelineEntry } from "../types";


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

  if (error || !data) return [];

  const blocks = buildNestedBlocks(data as PageBlock[]);

  return blocks;
}

/**
 * Build nested sections recursively
 */
export function buildNestedBlocks(blocks: PageBlock[], parentId: string | null = null): PageBlock[] {
  return (
    blocks
      .filter(b => b.parent_block_id === parentId)
      .map(b => {
        if (b.type === PageBlocks.Section || b.type === PageBlocks.InfiniteSlider) {
          return {
            ...b,
            content: {
              ...b.content,
              content: buildNestedBlocks(blocks, b.id),
            },
          } as PageBlock;
        }

        if (b.type === PageBlocks.Timeline) {
          const entryBlocks = blocks.filter(
            cb => cb.parent_block_id === b.id && cb.type === PageBlocks.TimelineEntry
          ) as Extract<PageBlock, { type: typeof PageBlocks.TimelineEntry }>[];

          const entries = entryBlocks.map(entryBlock => {
            return {
              ...(entryBlock.content as TimelineEntry),
              content: buildNestedBlocks(blocks, entryBlock.id),
            };
          });

          return {
            ...b,
            content: {
              ...b.content,
              entries,
            },
          } as PageBlock;
        }

        if (b.type === PageBlocks.TimelineEntry) {
          return {
            ...b,
            content: {
              ...(b.content as TimelineEntry),
              content: buildNestedBlocks(blocks, b.id),
            },
          } as PageBlock;
        }

        if (b.type === PageBlocks.List) {
          // typisiertes Narrowing auf den List-Block
          const listBlock = b as Extract<PageBlock, { type: typeof PageBlocks.List }>;
          return {
            ...listBlock,
            content: {
              ...listBlock.content,
              content: buildNestedBlocks(blocks, listBlock.id), // Kinder des List-Blocks
            },
          };
        }

        return b;
      })
  ) as PageBlock[];
}
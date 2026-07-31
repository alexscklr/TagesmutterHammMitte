import { supabase } from "@/supabaseClient";
import { PageBlocks, type PageBlock, type TimelineEntry } from "../types";


export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  sitetitle: string;
  created_at: string;
  background: any;
}


export async function fetchAllPages(): Promise<PageMeta[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("title", { ascending: true });

  if (error || !data) {
    console.error("Error fetching all pages:", error);
    return [];
  }

  return data as PageMeta[];
}


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

export function buildNestedBlocks(blocks: PageBlock[], parentId: string | null = null): PageBlock[] {
  return (
    blocks
      .filter(b => b.parent_block_id === parentId)
      .map(b => {
        if (b.type === PageBlocks.Section || b.type === PageBlocks.InfiniteSlider || b.type === PageBlocks.SplitContent) {
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

          
          const processedEntryBlocks = entryBlocks.map(entryBlock => ({
            ...entryBlock,
            content: {
              ...(entryBlock.content as TimelineEntry),
              content: buildNestedBlocks(blocks, entryBlock.id),
            },
          }));

          
          const entries = processedEntryBlocks.map(entryBlock => entryBlock.content);

          return {
            ...b,
            content: {
              ...b.content,
              entries,
              content: processedEntryBlocks, 
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
          
          const listBlock = b as Extract<PageBlock, { type: typeof PageBlocks.List }>;
          return {
            ...listBlock,
            content: {
              ...listBlock.content,
              content: buildNestedBlocks(blocks, listBlock.id), 
            },
          };
        }

        return b;
      })
  ) as PageBlock[];
}

function sanitizeContentForSave(block: PageBlock): unknown {
  switch (block.type) {
    case PageBlocks.Section: {
      const { heading, appearance } = block.content as any;
      return { heading, appearance };
    }
    case PageBlocks.List: {
      const { ordered, listStyle, margin } = block.content as any;
      return { ordered: !!ordered, listStyle, margin };
    }
    case PageBlocks.InfiniteSlider: {
      const { speed } = block.content as any;
      return { speed };
    }
    case PageBlocks.SplitContent: {
      const { firstItemWidth, content } = block.content as any;
      return { firstItemWidth: firstItemWidth ?? 50, content: content ?? [] };
    }
    case PageBlocks.Timeline: {
      
      return {};
    }
    case PageBlocks.TimelineEntry: {
      const { label, title, timeSpan, year, yearSpan } = block.content as any;
      return { label, title, timeSpan, year, yearSpan };
    }
    default:
      return block.content;
  }
}

type UpdatedPageBlockRow = { id: string; content: unknown };
export async function updatePageBlock(block: PageBlock): Promise<UpdatedPageBlockRow | null> {
  const t0 = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  const content = sanitizeContentForSave(block);
  console.info("updatePageBlock: request", { id: block.id, type: block.type, content });
  const query = supabase
    .from("page_blocks")
    .update({ content })
    .eq("id", block.id)
    .select("id, content")
    .single();
  const { data, error } = await query;
  const t1 = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  console.info("updatePageBlock: response", { id: block.id, ms: Math.round(t1 - t0), hasData: !!data, hasError: !!error });
  if (error) {
    console.error("Error updating page block", { id: block.id, error, content });
    throw error;
  }
  console.info("Supabase updated page_block", { id: block.id, content });
  return (data as UpdatedPageBlockRow) ?? null;
}

export async function updatePageBlockOrders(
  pageId: string,
  updates: Array<{ id: string; order: number }>
): Promise<void> {
  if (!updates.length) return;

  const payload = updates.map((u) => ({ id: u.id, order: u.order, page_id: pageId }));
  const { error } = await supabase.from("page_blocks").upsert(payload);
  if (error) {
    console.error("updatePageBlockOrders failed", error);
    throw error;
  }
}
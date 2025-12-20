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

/**
 * Hole alle Seiten für Sitemap
 */
export async function fetchAllPages(): Promise<PageMeta[]> {
  const { data, error } = await supabase
    .from("pages")
    .select("id, slug, title, sitetitle, created_at, background")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("Error fetching all pages:", error);
    return [];
  }

  return data.map(page => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    sitetitle: page.sitetitle,
    created_at: page.created_at,
    background: page.background
  }));
}

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

/**
 * Sanitize block content for persistence: strip nested children for container-like blocks.
 */
function sanitizeContentForSave(block: PageBlock): unknown {
  switch (block.type) {
    case PageBlocks.Section: {
      const { heading, appearance } = block.content as any;
      return { heading, appearance };
    }
    case PageBlocks.List: {
      const { ordered, listStyle } = block.content as any;
      return { ordered: !!ordered, listStyle };
    }
    case PageBlocks.InfiniteSlider: {
      const { speed } = block.content as any;
      return { speed };
    }
    case PageBlocks.Timeline: {
      // Entries are represented by child rows; parent holds no inline entries
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

/**
 * Update a single page_block row's content by id.
 */
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
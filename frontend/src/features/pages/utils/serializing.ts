import type { Page, PageBlock } from "../types/page";

/**
 * JSON (Supabase Data) to PageBlocks
 */
export function deserializePageBlocks(json: any[]): Page {
  return json.map((block) => {
    // Hier musst du "vertrauen", dass die Struktur stimmt.
    return {
      type: block.type,
      order: block.order,
      content: block.content,
    } as PageBlock;
  });
}

/**
 * PageBlocks to JSON, e.g. for Supabase
 */
export function serializePageBlocks(blocks: Page): any[] {
  return blocks.map((block) => ({
    type: block.type,
    order: block.order,
    content: block.content,
  }));
}


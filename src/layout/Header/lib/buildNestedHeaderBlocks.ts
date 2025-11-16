import { HeaderBlocks, type HeaderBlock } from "../types";

/**
 * Baut die verschachtelte Struktur für Header-Blocks (z.B. Dropdowns mit Links).
 */
export function buildNestedHeaderBlocks(blocks: HeaderBlock[], parentId: string | null = null): HeaderBlock[] {
  return blocks
    .filter(b => b.parent_block_id === parentId)
    .map(b => {

      if (b.type === HeaderBlocks.Dropdown) {
        return {
          ...b,
          content: {
            ...b.content,
            options: buildNestedHeaderBlocks(blocks, b.id),
          },
        } as HeaderBlock;
      }
      
      return b;
    });
}
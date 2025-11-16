import { FooterBlocks, type FooterBlock } from "../types";


export function buildNestedFooterBlocks(blocks: FooterBlock[], parentId: string | null = null): FooterBlock[] {
  return blocks
    .filter(b => b.parent_block_id === parentId)
    .map(b => {

      if (b.type === FooterBlocks.List) {
        return {
          ...b,
          content: {
            ...b.content,
            content: buildNestedFooterBlocks(blocks, b.id),
          },
        } as FooterBlock;
      }
      
      return b;
    });
}
import type { Page, PageBlock } from "../types/page";

export function deserializePageBlocks(json: any[]): Page {
  return json.map((block) => {
    return {
      type: block.type,
      order: block.order,
      content: block.content,
    } as PageBlock;
  });
}

export function serializePageBlocks(blocks: Page): any[] {
  return blocks.map((block) => ({
    type: block.type,
    order: block.order,
    content: block.content,
  }));
}


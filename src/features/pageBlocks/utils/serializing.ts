import type { Page, PageBlock, PageBlockType, PageBlockPayloads } from "../types";
import { PageBlocks } from "../types";

/**
 * JSON (Supabase Data) to PageBlocks
 */
export function deserializePageBlocks(json: any[]): Page {
    return json.map((block) => {
        const type: PageBlockType = block.type;
        const order: number = block.order;

        let content: PageBlockPayloads[PageBlockType];

        switch (type) {
            case PageBlocks.Title:
                content = block.content as PageBlockPayloads[typeof PageBlocks.Title];
                break;

            case PageBlocks.Paragraph:
                content = block.content as PageBlockPayloads[typeof PageBlocks.Paragraph];
                break;

            case PageBlocks.List:
                content = block.content as PageBlockPayloads[typeof PageBlocks.List];
                break;

            case PageBlocks.Imagery:
                content = block.content as PageBlockPayloads[typeof PageBlocks.Imagery];
                break;

            case PageBlocks.Quote:
                content = block.content as PageBlockPayloads[typeof PageBlocks.Quote];
                break;
            
            case PageBlocks.Timeline:
                content = block.content as PageBlockPayloads[typeof PageBlocks.Timeline];
                break;

            default:
                throw new Error(`Unknown block type: ${type}`);
        }

        return {
            type,
            order,
            content,
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


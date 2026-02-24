import { reorderWithinParent, type OrderableWithParent, type ReorderResult } from "@/shared/utils/reorder";
import { PageBlocks, type PageBlock } from "../types/page";

export type FlatPageBlock = OrderableWithParent;

const getChildren = (block: PageBlock): PageBlock[] => {
    const content: any = block.content;
    switch (block.type) {
        case PageBlocks.Section:
        case PageBlocks.InfiniteSlider:
        case PageBlocks.SplitContent:
        case PageBlocks.List:
            return content?.content || [];
        case PageBlocks.Timeline:
            return content?.content || [];
        case PageBlocks.TimelineEntry:
            return content?.content || [];
        default:
            return [];
    }
};

export const flattenPageBlocks = (blocks: PageBlock[]): FlatPageBlock[] => {
    const flat: FlatPageBlock[] = [];

    const walk = (nodes: PageBlock[]) => {
        nodes.forEach((node) => {
            flat.push({ id: node.id, order: node.order, parent_block_id: node.parent_block_id });
            const children = getChildren(node);
            if (children?.length) {
                walk(children);
            }
        });
    };

    walk(blocks);
    return flat;
};

const withChildren = (block: PageBlock, children: PageBlock[]): PageBlock => {
    const content: any = block.content;
    switch (block.type) {
        case PageBlocks.Section:
        case PageBlocks.InfiniteSlider:
        case PageBlocks.SplitContent:
        case PageBlocks.List:
            return { ...block, content: { ...content, content: children } };
        case PageBlocks.Timeline:
            return { ...block, content: { ...content, content: children, entries: children.map((entry) => entry.content) } } as PageBlock;
        case PageBlocks.TimelineEntry:
            return { ...block, content: { ...content, content: children } } as PageBlock;
        default:
            return block;
    }
};

export const applyOrderUpdatesToBlocks = (blocks: PageBlock[], updates: Array<{ id: string; order: number }>): PageBlock[] => {
    if (updates.length === 0) return blocks;
    const orderMap = new Map(updates.map((u) => [u.id, u.order]));

    const sortAndUpdate = (nodes: PageBlock[]): PageBlock[] => {
        const updated = nodes.map((node) => {
            const children = getChildren(node);
            const nextChildren = children?.length ? sortAndUpdate(children) : children;
            const nextOrder = orderMap.has(node.id) ? orderMap.get(node.id)! : node.order;
            const nextNode = { ...node, order: nextOrder } as PageBlock;
            return nextChildren ? withChildren(nextNode, nextChildren) : nextNode;
        });

        return updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    return sortAndUpdate(blocks);
};

export const reorderPageBlocks = (
    blocks: PageBlock[],
    sourceId: string,
    targetId: string
): ReorderResult<OrderableWithParent> => {
    const flat = flattenPageBlocks(blocks);
    return reorderWithinParent(flat, sourceId, targetId);
};

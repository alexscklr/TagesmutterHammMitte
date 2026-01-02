export type OrderableWithParent = {
    id: string;
    order?: number | null;
    parent_block_id?: string | null;
};

export type ReorderResult<T> = {
    next: T[];
    changed: boolean;
    updates: Array<{ id: string; order: number }>;
};

export const reorderWithinParent = <T extends OrderableWithParent>(
    list: T[],
    sourceId: string,
    targetId: string
): ReorderResult<T> => {
    const source = list.find((item) => item.id === sourceId);
    const target = list.find((item) => item.id === targetId);

    if (!source || !target || source.parent_block_id !== target.parent_block_id) {
        return { next: list, changed: false, updates: [] };
    }

    const siblings = list
        .filter((item) => item.parent_block_id === source.parent_block_id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const oldIndex = siblings.findIndex((item) => item.id === sourceId);
    const newIndex = siblings.findIndex((item) => item.id === targetId);

    if (oldIndex === newIndex) return { next: list, changed: false, updates: [] };

    const newSiblings = [...siblings];
    const [movedItem] = newSiblings.splice(oldIndex, 1);
    newSiblings.splice(newIndex, 0, movedItem);

    const updates = newSiblings.map((item, idx) => ({ id: item.id, order: idx }));
    const orderMap = new Map(updates.map((u) => [u.id, u.order]));

    const next = list.map((item) => (orderMap.has(item.id) ? { ...item, order: orderMap.get(item.id)! } : item));

    return { next, changed: true, updates };
};

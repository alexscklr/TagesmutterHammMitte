import React, { useCallback, useState } from "react";

export type DragControls = {
    draggingId: string | null;
    getHandleProps: (id: string) => {
        draggable: boolean;
        onDragStart: (e: React.DragEvent) => void;
        onDragEnd: () => void;
    };
    getDropProps: (id: string) => {
        onDragOver: (e: React.DragEvent) => void;
        onDrop: (e: React.DragEvent) => void;
    };
    clearDragging: () => void;
};

type UseDragAndDropOptions = {
    onReorder: (sourceId: string, targetId: string) => void;
    disabled?: boolean;
};

export const useDragAndDrop = ({ onReorder, disabled = false }: UseDragAndDropOptions): DragControls => {
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const clearDragging = useCallback(() => setDraggingId(null), []);

    const getHandleProps = useCallback(
        (id: string) => ({
            draggable: !disabled,
            onDragStart: (e: React.DragEvent) => {
                if (disabled) return;
                e.stopPropagation();
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", id);
                setDraggingId(id);
            },
            onDragEnd: () => setDraggingId(null),
        }),
        [disabled]
    );

    const getDropProps = useCallback(
        (id: string) => ({
            onDragOver: (e: React.DragEvent) => {
                if (disabled || draggingId === id) return;
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "move";
            },
            onDrop: (e: React.DragEvent) => {
                if (disabled || !draggingId) return;
                e.preventDefault();
                e.stopPropagation();
                onReorder(draggingId, id);
                setDraggingId(null);
            },
        }),
        [disabled, draggingId, onReorder]
    );

    return { draggingId, getHandleProps, getDropProps, clearDragging };
};

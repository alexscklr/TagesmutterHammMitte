import React, { useCallback, useRef, useState } from "react";

export type DragControls = {
    draggingId: string | null;
    getHandleProps: (id: string) => {
        draggable: boolean;
        onDragStart: (e: React.DragEvent) => void;
        onDragEnd: () => void;
        onPointerDown: (e: React.PointerEvent) => void;
    };
    getDropProps: (id: string) => {
        onDragOver: (e: React.DragEvent) => void;
        onDrop: (e: React.DragEvent) => void;
        "data-drop-id": string;
    };
    clearDragging: () => void;
};

type UseDragAndDropOptions = {
    onReorder: (sourceId: string, targetId: string) => void;
    disabled?: boolean;
};

export const useDragAndDrop = ({ onReorder, disabled = false }: UseDragAndDropOptions): DragControls => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const pointerDraggingId = useRef<string | null>(null);

    const clearDragging = useCallback(() => {
        pointerDraggingId.current = null;
        setDraggingId(null);
    }, []);

    const endPointerDrag = useCallback(() => {
        pointerDraggingId.current = null;
        setDraggingId(null);
    }, []);

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
            onPointerDown: (e: React.PointerEvent) => {
                if (disabled) return;
                // Only handle touch/pen; mouse stays native drag/drop
                if (e.pointerType !== "touch" && e.pointerType !== "pen") return;
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();

                pointerDraggingId.current = id;
                setDraggingId(id);

                const handleEl = e.currentTarget as HTMLElement | null;

                // Capture to keep getting events if the pointer leaves the handle
                if (handleEl?.setPointerCapture) {
                    try { handleEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
                }

                const handleMove = (ev: PointerEvent) => {
                    if (pointerDraggingId.current !== id) return;
                    if (ev.pointerType !== "touch" && ev.pointerType !== "pen") return;

                    const target = document.elementFromPoint(ev.clientX, ev.clientY);
                    if (!target) return;
                    const dropNode = target.closest<HTMLElement>('[data-drop-id]');
                    const dropId = dropNode?.dataset.dropId;
                    if (!dropId || dropId === pointerDraggingId.current) return;

                    onReorder(pointerDraggingId.current, dropId);
                    pointerDraggingId.current = dropId;
                    setDraggingId(dropId);
                };

                const release = () => {
                    if (handleEl?.releasePointerCapture) {
                        try { handleEl.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
                    }
                    endPointerDrag();
                    window.removeEventListener("pointerup", release);
                    window.removeEventListener("pointercancel", release);
                    window.removeEventListener("pointermove", handleMove);
                };

                window.addEventListener("pointerup", release, { passive: true });
                window.addEventListener("pointercancel", release, { passive: true });
                window.addEventListener("pointermove", handleMove, { passive: false });
            },
        }),
        [disabled, endPointerDrag, onReorder]
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
            "data-drop-id": id,
        }),
        [disabled, draggingId, onReorder]
    );

    return { draggingId, getHandleProps, getDropProps, clearDragging };
};

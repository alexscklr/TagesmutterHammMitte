import React from "react";
import { RxDragHandleHorizontal } from "react-icons/rx";
import type { PageBlock } from "../../types/page";
import SelectableBlock from "./SelectableBlock";
import { usePageDrag } from "./PageDragContext";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import styles from "../renderer/PageRenderer.module.css";

export const DraggableBlock: React.FC<{ block: PageBlock }> = ({ block }) => {
    const { drag, isEditing } = usePageDrag();
    const { selectedBlock, setSelectedBlock } = useSelection();

    const isDragging = drag?.draggingId === block.id;
    const handleProps = drag ? drag.getHandleProps(block.id, block.parent_block_id ?? null) : { draggable: false, onDragStart: () => undefined, onDragEnd: () => undefined, onPointerDown: () => undefined };
    const dropProps = drag ? drag.getDropProps(block.id, block.parent_block_id ?? null) : { onDragOver: () => undefined, onDrop: () => undefined, "data-drop-id": block.id, "data-parent-id": block.parent_block_id ?? "" };
    const isSelected = selectedBlock?.id === block.id;

    return (
        <div
            className={`${styles.blockWrapper} ${isSelected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
            {...dropProps}
        >
            {isEditing && drag && (
                <button
                    type="button"
                    className={styles.dragHandle}
                    aria-label="Block verschieben"
                    {...handleProps}
                    onClick={(e) => e.stopPropagation()}
                >
                    <RxDragHandleHorizontal/>
                </button>
            )}

            <div
                className={styles.blockInner}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlock(block);
                }}
                style={{
                    minHeight: isEditing ? "48px" : undefined,
                    padding: isEditing ? "4px 0" : undefined,
                    cursor: isEditing ? "pointer" : undefined,
                    position: "relative",
                }}
            >
                <SelectableBlock block={block} />
            </div>
        </div>
    );
};

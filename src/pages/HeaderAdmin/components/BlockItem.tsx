import React from "react";
import { FaPencil, FaTrash, FaGripVertical } from "react-icons/fa6";
import { supabase } from "@/supabaseClient";
import type { HeaderBlock } from "@/layout/Header/types/header";
import { HeaderBlocks } from "@/layout/Header/types/header";

export type BlockItemProps = {
  block: HeaderBlock;
  blocks: HeaderBlock[];
  isNested?: boolean;
  styles: { [key: string]: string };
  getPageTitle: (id: string) => string;
  onEdit: (block: HeaderBlock) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
  draggingId?: string | null;
  setDraggingId?: (id: string | null) => void;
  onReorder?: (sourceId: string, targetId: string) => void;
};

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  blocks,
  isNested = false,
  styles,
  getPageTitle,
  onEdit,
  onDelete,
  readOnly = false,
  draggingId,
  setDraggingId,
  onReorder,
}) => {
  const content = block.content as any;
  const isDragging = draggingId === block.id;

  const handleDragStart = (e: React.DragEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", block.id);
    setDraggingId?.(block.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly || draggingId === block.id) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    if (readOnly || !draggingId) return;
    e.preventDefault();
    e.stopPropagation();
    onReorder?.(draggingId, block.id);
    setDraggingId?.(null);
  };

  const handleDragEnd = () => {
    setDraggingId?.(null);
  };

  const commonRowProps = {
    className: `${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""} ${isDragging ? styles.dragging : ""}`,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  const Actions = () => (
    <div className={styles.blockActions}>
      <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten" disabled={readOnly}><FaPencil /></button>
      <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen" disabled={readOnly}><FaTrash /></button>
    </div>
  );

  if (block.type === HeaderBlocks.Logo) {
    const { data } = supabase.storage.from("public_images").getPublicUrl(content.logo?.url || "");
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable={!readOnly}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLogo}`}>Logo</span>
          </div>
          <img src={data.publicUrl} alt="Logo" style={{ width: "60px", height: "auto" }} />
        </div>
        <Actions />
      </div>
    );
  }

  if (block.type === HeaderBlocks.Link) {
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable={!readOnly}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLink}`}>Link</span>
            <strong>{block.target_site_id ? `(Link zu) "${getPageTitle(block.target_site_id)}"` : content.url || "Nicht gesetzt"}</strong>
          </div>
        </div>
        <Actions />
      </div>
    );
  }

  if (block.type === HeaderBlocks.Dropdown) {
    const childBlocks = blocks
      .filter(b => b.parent_block_id === block.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable={!readOnly}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeDropdown}`}>Dropdown</span>
            <strong>{content.title?.[0]?.text || "Dropdown"}</strong>
          </div>
          {childBlocks.length > 0 && (
            <div className={styles.childList}>
              {childBlocks.map(child => (
                <BlockItem
                  key={child.id}
                  block={child}
                  blocks={blocks}
                  isNested
                  styles={styles}
                  getPageTitle={getPageTitle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  readOnly={readOnly}
                  draggingId={draggingId}
                  setDraggingId={setDraggingId}
                  onReorder={onReorder}
                />
              ))}
            </div>
          )}
        </div>
        <Actions />
      </div>
    );
  }

  return null;
};

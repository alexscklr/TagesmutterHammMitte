import React from "react";
import { FaPencil, FaTrash, FaPlus, FaGripVertical } from "react-icons/fa6";
import { supabase } from "@/supabaseClient";
import { FooterBlocks, type FooterBlock } from "@/layout/Footer/types";

export type BlockItemProps = {
  block: FooterBlock;
  blocks: FooterBlock[];
  isNested?: boolean;
  styles: { [key: string]: string };
  getPageTitle: (id: string) => string;
  onEdit: (block: FooterBlock) => void;
  onDelete: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  draggingId?: string | null;
  setDraggingId?: (id: string | null) => void;
  onReorder?: (sourceId: string, targetId: string) => void;
};

export const BlockItem: React.FC<BlockItemProps> = ({ block, blocks, isNested = false, styles, getPageTitle, onEdit, onDelete, onAddChild, draggingId, setDraggingId, onReorder }) => {
  const content = block.content as any;
  const isDragging = draggingId === block.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", block.id);
    setDraggingId?.(block.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (draggingId === block.id) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!draggingId) return;
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

  if (block.type === FooterBlocks.Portrait) {
    const { data } = supabase.storage.from("public_images").getPublicUrl(content.image?.url || "");
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgePortrait}`}>Portrait</span>
            <strong>{content.image?.alt || "Bild"}</strong>
          </div>
          {data?.publicUrl && <img src={data.publicUrl} alt={content.image?.alt || "Bild"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />}
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen"><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.Link) {
    const labelText = content.label?.[0]?.text;
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLink}`}>Link</span>
            <strong>{labelText || (block.target_site_id ? `(Link zu) "${getPageTitle(block.target_site_id)}"` : content.url || "Nicht gesetzt")}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen"><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.Text) {
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeText}`}>Text</span>
            <strong>{content.text?.slice(0, 60) || "Text"}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen"><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.CopyrightNotice) {
    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeCopyright}`}>Copyright</span>
            <strong>{content.notice || content.text || "Copyright"}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen"><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.List) {
    const childBlocks = blocks
      .filter(b => b.parent_block_id === block.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div {...commonRowProps}>
        <span
          className={styles.dragHandle}
          aria-label="Verschieben"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeList}`}>Liste</span>
            <strong>{`Einträge: ${childBlocks.length}`}</strong>
          </div>
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
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={onReorder}
              />
            ))}
          </div>
        </div>
        <div className={styles.blockActions}>
          {onAddChild && <button onClick={() => onAddChild(block.id)} className={styles.btn} title="Link hinzufügen"><FaPlus /> Link</button>}
          <button onClick={() => onEdit(block)} className={styles.ghostButton} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={`${styles.ghostButton} ${styles.ghostDelete}`} title="Löschen"><FaTrash /></button>
        </div>
      </div>
    );
  }

  return null;
}

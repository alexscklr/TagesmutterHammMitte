import React from "react";
import { FaPencil, FaTrash, FaGripVertical } from "react-icons/fa6";
import { supabase } from "@/supabaseClient";
import type { HeaderBlock } from "@/layout/Header/types/header";
import { HeaderBlocks } from "@/layout/Header/types/header";
import type { DragControls } from "@/shared/hooks/useDragAndDrop";

export type BlockItemProps = {
  block: HeaderBlock;
  blocks: HeaderBlock[];
  isNested?: boolean;
  styles: { [key: string]: string };
  getPageTitle: (id: string) => string;
  onEdit: (block: HeaderBlock) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
  drag?: DragControls;
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
  drag,
}) => {
  const content = block.content as any;
  const noopDrag = (e: React.DragEvent) => { /* no-op */ };
  const isDragging = drag?.draggingId === block.id;
  const handleProps = drag ? drag.getHandleProps(block.id) : { draggable: false, onDragStart: noopDrag, onDragEnd: () => undefined };
  const dropProps = drag ? drag.getDropProps(block.id) : { onDragOver: noopDrag, onDrop: noopDrag };

  const commonRowProps = {
    className: `${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""} ${isDragging ? styles.dragging : ""}`,
    ...dropProps,
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
          {...handleProps}
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
          {...handleProps}
        >
          <FaGripVertical />
        </span>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLink}`}>Link zu</span>
            <strong>{block.target_site_id ? `"${getPageTitle(block.target_site_id)}"` : content.url || "Nicht gesetzt"}</strong>
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
          {...handleProps}
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
                  drag={drag}
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

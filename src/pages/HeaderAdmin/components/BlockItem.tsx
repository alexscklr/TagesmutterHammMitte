import React from "react";
import { FaPencil, FaTrash } from "react-icons/fa6";
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
};

export const BlockItem: React.FC<BlockItemProps> = ({ block, blocks, isNested = false, styles, getPageTitle, onEdit, onDelete, readOnly = false }) => {
  const content = block.content as any;

  if (block.type === HeaderBlocks.Logo) {
    const { data } = supabase.storage.from("public_images").getPublicUrl(content.logo?.url || "");
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLogo}`}>Logo</span>
          </div>
          <img src={data.publicUrl} alt="Logo" style={{ width: "60px", height: "auto" }} />
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete} disabled={readOnly} title={readOnly ? "Nur Lesen" : "Löschen"}><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === HeaderBlocks.Link) {
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLink}`}>Link</span>
            <strong>{block.target_site_id ? `(Link zu) "${getPageTitle(block.target_site_id)}"` : content.url || "Nicht gesetzt"}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete} disabled={readOnly} title={readOnly ? "Nur Lesen" : "Löschen"}><FaTrash /></button>
        </div>
      </div>
    );
  }

  if (block.type === HeaderBlocks.Dropdown) {
    const childBlocks = blocks
      .filter(b => b.parent_block_id === block.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
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
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn} title="Bearbeiten"><FaPencil /></button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete} disabled={readOnly} title={readOnly ? "Nur Lesen" : "Löschen"}><FaTrash /></button>
        </div>
      </div>
    );
  }

  return null;
};

import React from "react";
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
};

export const BlockItem: React.FC<BlockItemProps> = ({ block, blocks, isNested = false, styles, getPageTitle, onEdit, onDelete }) => {
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
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
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
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
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
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  return null;
};

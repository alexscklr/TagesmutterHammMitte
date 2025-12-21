import React from "react";
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
};

export const BlockItem: React.FC<BlockItemProps> = ({ block, blocks, isNested = false, styles, getPageTitle, onEdit, onDelete, onAddChild }) => {
  const content = block.content as any;

  if (block.type === FooterBlocks.Portrait) {
    const { data } = supabase.storage.from("public_images").getPublicUrl(content.image?.url || "");
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgePortrait}`}>Portrait</span>
            <strong>{content.image?.alt || "Bild"}</strong>
          </div>
          {data?.publicUrl && <img src={data.publicUrl} alt={content.image?.alt || "Bild"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />}
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.Link) {
    const labelText = content.label?.[0]?.text;
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeLink}`}>Link</span>
            <strong>{labelText || (block.target_site_id ? `(Link zu) "${getPageTitle(block.target_site_id)}"` : content.url || "Nicht gesetzt")}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.Text) {
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeText}`}>Text</span>
            <strong>{content.text?.slice(0, 60) || "Text"}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.CopyrightNotice) {
    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
        <div className={styles.blockInfo}>
          <div className={styles.blockTitleRow}>
            <span className={`${styles.badge} ${styles.badgeCopyright}`}>Copyright</span>
            <strong>{content.notice || content.text || "Copyright"}</strong>
          </div>
        </div>
        <div className={styles.blockActions}>
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  if (block.type === FooterBlocks.List) {
    const childBlocks = blocks
      .filter(b => b.parent_block_id === block.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div className={`${styles.blockRow} ${isNested ? styles.nestedBlockRow : ""}`}>
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
              />
            ))}
          </div>
        </div>
        <div className={styles.blockActions}>
          {onAddChild && <button onClick={() => onAddChild(block.id)} className={styles.btn}>+ Link</button>}
          <button onClick={() => onEdit(block)} className={styles.btn}>✎</button>
          <button onClick={() => onDelete(block.id)} className={styles.btnDelete}>✕</button>
        </div>
      </div>
    );
  }

  return null;
}

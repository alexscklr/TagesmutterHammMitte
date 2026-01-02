import React, { useState } from "react";
import { FooterBlocks, type FooterBlock, type FooterBlockType } from "@/layout/Footer/types";
import type { PageMeta } from "@/features/pages/lib/pageQueries";

export type EditFormProps = {
  styles: { [key: string]: string };
  editingId: string;
  formData: Partial<FooterBlock>;
  pages: PageMeta[];
  blocks: FooterBlock[];
  onChangeContent: (updates: any) => void;
  onChangeFormData: (updates: Partial<FooterBlock>) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenImagePicker: () => void;
  onStartCreateChildLink: (parentId: string, type: FooterBlockType) => void;
};

export const EditForm: React.FC<EditFormProps> = ({ styles, editingId, formData, pages, onChangeContent, onChangeFormData, onSave, onCancel, onOpenImagePicker, onStartCreateChildLink }) => {
  const isNew = editingId.startsWith("new-");
  const content = (formData.content as any) || {};
  const [childType, setChildType] = useState<FooterBlockType>(FooterBlocks.Link);

  return (
    <div className={styles.editForm}>
      <h2>{isNew ? "Neuen Footer-Block erstellen" : "Footer-Block bearbeiten"}</h2>

      {/* Type specific */}
      {formData.type === FooterBlocks.Portrait && (
        <>
          <div className={styles.formGroup}>
            <label>Bild-Alt-Text</label>
            <input type="text" value={content.image?.alt || ""} onChange={e => onChangeContent({ image: { ...(content.image || {}), alt: e.target.value } })} />
          </div>
          <div className={styles.formActions}>
            <button className={styles.btn} onClick={onOpenImagePicker}>Bild auswählen</button>
          </div>
        </>
      )}

      {formData.type === FooterBlocks.Link && (
        <>
          <div className={styles.formGroup}>
            <label>Link-Label (optional)</label>
            <input type="text" value={content.label?.[0]?.text || ""} onChange={e => onChangeContent({ label: [{ text: e.target.value }] })} />
          </div>
          <div className={styles.formGroup}>
            <label>Interne Seite</label>
            <select value={formData.target_site_id || ""} onChange={e => onChangeFormData({ ...formData, target_site_id: e.target.value || null })}>
              <option value="">— Keine —</option>
              {pages.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Externe URL</label>
            <input type="text" value={content.url || ""} onChange={e => onChangeContent({ url: e.target.value })} />
          </div>
        </>
      )}

      {formData.type === FooterBlocks.Text && (
        <div className={styles.formGroup}>
          <label>Text</label>
          <textarea rows={4} value={content.text || ""} onChange={e => onChangeContent({ text: e.target.value })} />
        </div>
      )}

      {formData.type === FooterBlocks.CopyrightNotice && (
        <div className={styles.formGroup}>
          <label>Copyright-Hinweis</label>
          <input type="text" value={content.notice || content.text || ""} onChange={e => onChangeContent({ notice: e.target.value })} />
        </div>
      )}

      {formData.type === FooterBlocks.List && (
        <div className={styles.formGroup}>
          <label>Listen-Inhalt</label>
          <div className={styles.formActions}>
            <select
              value={childType}
              onChange={(e) => setChildType(e.target.value as FooterBlockType)}
              className={styles.select}
            >
              <option value={FooterBlocks.Link}>Link</option>
              <option value={FooterBlocks.Text}>Text</option>
              <option value={FooterBlocks.Portrait}>Portrait</option>
            </select>
            <button className={styles.btn} onClick={() => onStartCreateChildLink(formData.id as string, childType)}>+ Eintrag hinzufügen</button>
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button className={styles.btn} onClick={onSave}>Speichern</button>
        <button className={styles.btnSecondary} onClick={onCancel}>Abbrechen</button>
      </div>
    </div>
  );
};

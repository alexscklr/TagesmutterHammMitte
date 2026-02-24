import React from "react";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { supabase } from "@/supabaseClient";
import { HeaderBlocks } from "@/layout/Header/types/header";
import type { HeaderBlock } from "@/layout/Header/types/header";

export type EditFormProps = {
  styles: { [key: string]: string };
  editingId: string;
  formData: Partial<HeaderBlock>;
  pages: { id: string; title: string }[];
  blocks: HeaderBlock[];
  onChangeContent: (updates: any) => void;
  onChangeFormData: (fn: (prev: Partial<HeaderBlock>) => Partial<HeaderBlock>) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenImagePicker: () => void;
  onDeleteChild: (id: string) => void;
  onStartEdit: (block: HeaderBlock) => void;
  onStartCreateChildLink: (parentId: string) => void;
  getPageTitle: (id: string) => string;
  readOnly?: boolean;
};

const FormField: React.FC<{ label: string; children: React.ReactNode; styles: { [key: string]: string } }> = ({ label, children, styles }) => (
  <div className={styles.formGroup}>
    <label>{label}</label>
    {children}
  </div>
);

export const EditForm: React.FC<EditFormProps> = ({
  styles,
  editingId,
  formData,
  pages,
  blocks,
  onChangeContent,
  onChangeFormData,
  onSave,
  onCancel,
  onOpenImagePicker,
  onDeleteChild,
  onStartEdit,
  onStartCreateChildLink,
  getPageTitle,
  readOnly = false,
}) => {
  return (
    <div className={styles.editForm}>
      <h2>{editingId.startsWith("new-") ? "Neuer Block" : "Block bearbeiten"}</h2>

      {formData.type === HeaderBlocks.Logo && (
        <>
          <FormField label="Logo-Bild" styles={styles}>
            <>
              {(formData.content as any)?.logo?.url && (
                <img
                  src={(() => {
                    const { data } = supabase.storage.from("public_images").getPublicUrl((formData.content as any).logo.url);
                    return data.publicUrl;
                  })()}
                  alt="Logo Vorschau"
                  className={styles.preview}
                />
              )}
              <button type="button" onClick={onOpenImagePicker} className={styles.btn}>
                {(formData.content as any)?.logo?.url ? "Ändern" : "Auswählen"}
              </button>
            </>
          </FormField>
          <FormField label="Alt-Text" styles={styles}>
            <input
              type="text"
              value={(formData.content as any)?.logo?.alt || ""}
              onChange={(e) => onChangeContent({ logo: { ...(formData.content as any)?.logo, alt: e.target.value } })}
            />
          </FormField>
        </>
      )}

      {formData.type === HeaderBlocks.Link && (
        <>
          <FormField label="Seite (intern)" styles={styles}>
            <select
              value={(formData.target_site_id as any) || ""}
              onChange={(e) => onChangeFormData(prev => ({ ...prev, target_site_id: e.target.value }))}
              disabled={readOnly}
              title={readOnly ? "Nur Lesen" : undefined}
            >
              <option value="">-- Seite wählen --</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </FormField>
          <FormField label="Externe URL (optional)" styles={styles}>
            <input
              type="text"
              value={(formData.content as any)?.url || ""}
              onChange={(e) => onChangeContent({ url: e.target.value })}
              placeholder="https://example.com"
              disabled={readOnly}
              title={readOnly ? "Nur Lesen" : undefined}
            />
          </FormField>
        </>
      )}

      {formData.type === HeaderBlocks.Dropdown && (
        <>
          <FormField label="Dropdown-Titel" styles={styles}>
            <input
              type="text"
              value={(formData.content as any)?.title?.[0]?.text || ""}
              onChange={(e) => onChangeContent({ title: [{ text: e.target.value }] })}
              disabled={readOnly}
              title={readOnly ? "Nur Lesen" : undefined}
            />
          </FormField>
          <div className={styles.formGroup}>
            <label>Links in diesem Dropdown</label>
            {blocks.filter(b => b.parent_block_id === editingId && b.type === HeaderBlocks.Link).length === 0 ? (
              <p style={{ color: "var(--color-neutral-400)", fontSize: "0.9rem" }}>Keine Links vorhanden</p>
            ) : (
              blocks.filter(b => b.parent_block_id === editingId && b.type === HeaderBlocks.Link).map(childLink => (
                <div key={childLink.id} className={styles.nestedBlock}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: "var(--color-neutral-200)" }}>
                      {childLink.target_site_id ? `(Link zu) "${getPageTitle(childLink.target_site_id)}"` : (childLink.content as any).url || "Nicht gesetzt"}
                    </strong>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" onClick={() => onStartEdit(childLink)} className={styles.btn} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} title="Bearbeiten"><FaPencil /></button>
                    <button type="button" onClick={() => onDeleteChild(childLink.id)} className={styles.btnDelete} disabled={readOnly} title={readOnly ? "Nur Lesen" : "Löschen"}><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
            <button
              type="button"
              onClick={() => onStartCreateChildLink(editingId)}
              className={styles.btn}
              style={{ marginTop: "0.5rem" }}
              disabled={readOnly}
              title={readOnly ? "Nur Lesen" : undefined}
            >
              + Link hinzufügen
            </button>
          </div>
        </>
      )}

      <div className={styles.formActions}>
        <button onClick={onSave} className={styles.btnPrimary} disabled={readOnly} title={readOnly ? "Nur Lesen" : undefined}>Speichern</button>
        <button onClick={onCancel} className={styles.btnSecondary}>Abbrechen</button>
      </div>
    </div>
  );
};

import React from "react";
import styles from "./AdminSidebar.module.css";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEditing } from "@/features/admin/context/hooks/useEditing";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import type { PageBlock } from "@/features/pages/types/page";
import { RxDragHandleVertical } from "react-icons/rx";
// Editors are now rendered inline; sidebar reserved for page controls

// Helper to render editor with proper type narrowing via switch
// Inline editors are handled in PageBlockRenderer; keep sidebar minimal

export interface AdminSidebarProps {
  open?: boolean; // optional override, defaults to context
  selectedBlock?: PageBlock | null;
  onChangeBlock?: (next: PageBlock) => void;
  // Save/Cancel moved to inline editors
  // Removed header toggle; edit mode controlled by body button
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  open,
  selectedBlock,
  // onChangeBlock,
}) => {
  const { isEditing, setEditing } = useEditMode();
  const { canEdit } = useAuth();
  const { selectedBlock: ctxSelected, setSelectedBlock } = useSelection();
  const { isDirty } = useEditing();
  const visible = open ?? isEditing;
  const [width, setWidth] = React.useState<number>(300);
  const minWidth = 240;
  const maxWidth = 580;

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    const onMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
      setWidth(next);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!visible) return null;

  const renderBody = () => {
    const activeBlock = selectedBlock ?? ctxSelected;
    return (
      <div>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Editing</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={styles.button}
              onClick={() => canEdit && setEditing(!isEditing)}
              disabled={!canEdit}
              title={canEdit ? "Bearbeitungsmodus umschalten" : "Keine Berechtigung"}
            >
              {isEditing ? "Vorschau anzeigen" : "Bearbeitungsmodus aktivieren"}
            </button>
            {activeBlock && <button
              className={styles.button}
              onClick={() => setSelectedBlock(null)}
              disabled={!activeBlock}
              title={activeBlock ? "Block abwählen" : "Kein Block ausgewählt"}
            >
              Block abwählen
            </button>}
            {/* Save logic moved into inline editors via SaveBlockButton */}
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            {activeBlock ? `Ausgewählt: ${activeBlock.type}` : "Kein Block ausgewählt"}
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Tools</div>
          <div className={styles.toolsList}>
            <a className={styles.link} href="/admin/pages">Seitenverwaltung</a>
            <a className={styles.link} href="/admin/header">Header bearbeiten</a>
            <a className={styles.link} href="/admin/footer">Footer bearbeiten</a>
            <a className={styles.link} href="/admin/media">Medienverwaltung</a>
          </div>
        </section>
      </div>
    );
  };

  return (
    <aside className={styles.sidebar} style={{ width }}>
      <div className={styles.header}>
        <span className={styles.title}>Adminpanel {isDirty ? "• geändert" : ""}</span>
      </div>
      <div className={styles.resizer} onMouseDown={startResize} title="Seitenleiste vergrößern/verkleinern">
        <RxDragHandleVertical className={styles.resizerIcon} />
      </div>
      <div className={styles.body}>{renderBody()}</div>
      <div className={styles.footer}></div>
    </aside>
  );
};

export default AdminSidebar;

import React from "react";
import styles from "./AdminSidebar.module.css";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEditing } from "@/features/admin/context/hooks/useEditing";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import type { PageBlock } from "@/features/pages/types/page";
import { RxDragHandleVertical } from "react-icons/rx";
import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { TbDeselect } from "react-icons/tb";
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
          <div style={{ display: "flex", gap: "0.5rem", flexDirection: "row", flexWrap: "wrap" }}>
            <button
              className={styles.button}
              onClick={() => canEdit && setEditing(!isEditing)}
              disabled={!canEdit}
              title={canEdit ? "Bearbeitungsmodus umschalten" : "Keine Berechtigung"}
            >
              {isEditing ? <><FaRegEye className={styles.icon} /> Vorschau</> : <><FiEdit className={styles.icon} /> Bearbeiten</>}
            </button>
            {activeBlock && <button
              className={styles.button}
              onClick={() => setSelectedBlock(null)}
              disabled={!activeBlock}
              title={activeBlock ? "Block abwählen" : "Kein Block ausgewählt"}
            >
              <TbDeselect className={styles.icon} /> Block abwählen
            </button>}
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
            <a className={styles.link} href="/admin/reviews">Review-Verwaltung</a>
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

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
import { CgWebsite } from "react-icons/cg";
import { TbLayoutNavbarCollapseFilled, TbLayoutBottombarCollapseFilled, TbDeselect } from "react-icons/tb";
import { MdOutlinePermMedia, MdOutlineReviews } from "react-icons/md";
import { Link } from "@/shared/components";
import { FaDatabase } from "react-icons/fa";

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
  const [width, setWidth] = React.useState<number>(Math.min(300,window.screen.width * 0.8));
  const [scrollRatio, setScrollRatio] = React.useState<number | null>(null);

  // Restore scroll position after edit mode toggle
  React.useLayoutEffect(() => {
    if (scrollRatio !== null) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        window.scrollTo({ top: scrollRatio * scrollHeight, behavior: "instant" });
      }
      // Reset after restoring
      setScrollRatio(null);
    }
  }, [isEditing, scrollRatio]);

  const minWidth = 30;
  const maxWidth = 580;

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Only react to primary pointer (finger/left mouse)
    if (e.button !== 0 && e.pointerType === "mouse") return;

    // Keep events flowing even if pointer leaves the handle
    const resizerEl = e.currentTarget;
    const pointerId = e.pointerId;

    if (resizerEl?.setPointerCapture) {
      try { resizerEl.setPointerCapture(pointerId); } catch (_) { /* ignore */ }
    }

    const startX = e.clientX;
    const startWidth = width;

    const handleMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
      setWidth(next);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);

      if (resizerEl?.releasePointerCapture) {
        try { resizerEl.releasePointerCapture(pointerId); } catch (_) { /* ignore */ }
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
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
              onClick={() => {
                if (canEdit) {
                  // Save current scroll percentage
                  const scrollTop = window.scrollY;
                  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                  if (docHeight > 0) {
                    setScrollRatio(scrollTop / docHeight);
                  }
                  setEditing(!isEditing);
                }
              }}
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
            <Link href={"/admin/pages"} isExternal={false} ariaLabel={"Verwaltung der Seiten"} ariaDescription={"Link zur Verwaltung der Seiten im Adminpanel"} ><CgWebsite /> Seitenverwaltung</Link>
            <Link href={"/admin/header"} isExternal={false} ariaLabel={"Verwaltung der Headerinhalte"} ariaDescription={"Link zur Verwaltung der Headerinhalte im Adminpanel"} ><TbLayoutNavbarCollapseFilled /> Header bearbeiten</Link>
            <Link href={"/admin/footer"} isExternal={false} ariaLabel={"Verwaltung der Footerinhalte"} ariaDescription={"Link zur Verwaltung der Footerinhalte im Adminpanel"} ><TbLayoutBottombarCollapseFilled /> Footer bearbeiten</Link>
            <Link href={"/admin/media"} isExternal={false} ariaLabel={"Verwaltung der Medieninhalte"} ariaDescription={"Link zur Verwaltung der Medieninhalte im Adminpanel"} ><MdOutlinePermMedia /> Medienverwaltung</Link>
            <Link href={"/admin/reviews"} isExternal={false} ariaLabel={"Verwaltung der Rezensionen"} ariaDescription={"Link zur Verwaltung der Rezensionen im Adminpanel"} ><MdOutlineReviews /> Rezensionverwaltung</Link>
            <Link href={"/admin/backup"} isExternal={false} ariaLabel={"Backup und Restore"} ariaDescription={"Link zur Backup Verwaltung"} ><FaDatabase /> Backup & Restore</Link>
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
      <div className={styles.resizer} onPointerDown={startResize} title="Seitenleiste vergrößern/verkleinern">
        <RxDragHandleVertical className={styles.resizerIcon} />
      </div>
      <div className={styles.body}>{renderBody()}</div>
      <div className={styles.footer}></div>
    </aside>
  );
};

export default AdminSidebar;

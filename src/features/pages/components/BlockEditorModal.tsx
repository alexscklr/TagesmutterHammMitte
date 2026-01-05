import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaXmark } from "react-icons/fa6";
import styles from "./BlockEditorModal.module.css";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

// Lightweight modal used to edit blocks without shrinking the inline layout.
export const BlockEditorModal: React.FC<Props> = ({ open, title, onClose, actions, children }) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title || "Block Editor"}>
        <header className={styles.header}>
          <h3 className={styles.title}>{title || "Block bearbeiten"}</h3>
          <div className={styles.actions}>
            {actions}
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Schließen">
              <FaXmark />
            </button>
          </div>
        </header>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlockEditorModal;
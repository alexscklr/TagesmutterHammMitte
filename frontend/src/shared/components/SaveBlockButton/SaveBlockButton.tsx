import React from "react";
import { useEditing } from "@/features/admin/context/hooks/useEditing";
import styles from "./SaveBlockButton.module.css";

export interface SaveBlockButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SaveBlockButton: React.FC<SaveBlockButtonProps> = ({ className, style, children }) => {
  const { save, isDirty } = useEditing();
  const [status, setStatus] = React.useState<"idle"|"saving"|"success"|"error">("idle");

  const handleClick = async () => {
    if (!isDirty || status === "saving") return;
    try {
      setStatus("saving");
      const timeout = new Promise<void>((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000));
      await Promise.race([save(), timeout]);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1200);
    } catch (e) {
      console.error("SaveBlockButton: save failed", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const label = children ?? (status === "saving" ? "Speichern…" : status === "success" ? "Gespeichert" : status === "error" ? "Fehler beim Speichern" : "Änderungen speichern");

  return (
    <button className={`${styles.button} ${className ?? ""}`} style={style} onClick={handleClick} disabled={!isDirty || status === "saving"}>
      {label}
    </button>
  );
};

export default SaveBlockButton;

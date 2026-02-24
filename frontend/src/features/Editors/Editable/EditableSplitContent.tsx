import React from "react";
import type { SplitContent } from "@/features/pages/types/blocks";
import { SaveBlockButton } from "@/shared/components";

export interface EditableSplitContentProps {
  value: SplitContent;
  onChange: (value: SplitContent) => void;
}

const EditableSplitContent: React.FC<EditableSplitContentProps> = ({ value, onChange }) => {
  const firstItemWidth = value.firstItemWidth ?? 50;

  return (
    <div>
      <div style={{ marginTop: 8, display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label htmlFor="first-item-width" style={{ color: "var(--color-text)" }}>
          Breite erstes Element:
        </label>
        <input
          id="first-item-width"
          type="number"
          min="10"
          max="90"
          step="5"
          value={firstItemWidth}
          onChange={(e) => {
            const newWidth = Math.max(10, Math.min(90, Number(e.target.value)));
            onChange({ ...value, firstItemWidth: newWidth });
          }}
          style={{ 
            padding: "0.4rem 0.6rem", 
            borderRadius: "0.5rem",
            width: "80px"
          }}
        />
        <span style={{ color: "var(--color-text)" }}>%</span>
      </div>
      <div style={{ marginTop: 8, color: "var(--color-text)", fontSize: "0.9rem" }}>
        Die Child-Blöcke werden in den beiden Spalten angezeigt.
      </div>
      {/* Managing child content blocks is handled by the existing block editor UI */}
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableSplitContent;

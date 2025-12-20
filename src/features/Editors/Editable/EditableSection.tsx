import React from "react";
import type { Section } from "@/features/pages/types/blocks";
import { SectionAppearance } from "@/features/pages/types/blocks/Section";
import EditableHeading from "./EditableHeading";
import { SaveBlockButton } from "@/shared/components";

export interface EditableSectionProps {
  value: Section;
  onChange: (value: Section) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({ value, onChange }) => {
  return (
    <div>
      <EditableHeading
        value={value.heading}
        onChange={(heading) => onChange({ ...value, heading })}
      />
      <div style={{ marginTop: 8, display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label htmlFor="section-appearance" style={{ color: "var(--color-text)" }}>Darstellung:</label>
        <select
          id="section-appearance"
          className="section-appearance-select"
          value={value.appearance ?? SectionAppearance.Card}
          onChange={(e) => onChange({ ...value, appearance: e.target.value as SectionAppearance })}
          style={{ padding: "0.4rem 0.6rem", borderRadius: "0.5rem" }}
        >
          <option value={SectionAppearance.Card}>Karte</option>
          <option value={SectionAppearance.Flat}>Flach</option>
        </select>
      </div>
      {/* Managing child content blocks is handled by the existing block editor UI */}
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableSection;
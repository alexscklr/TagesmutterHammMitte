import React from "react";
import type { Paragraph } from "@/features/pages/types/blocks";
import { RichTextEditor } from "@/features/Editors/RichText/RichTextEditor";
import { SaveBlockButton } from "@/shared/components";

export interface EditableParagraphProps {
  value: Paragraph;
  onChange: (value: Paragraph) => void;
}

const EditableParagraph: React.FC<EditableParagraphProps> = ({ value, onChange }) => {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>
          Textausrichtung:
          <select
            value={value.align ?? "left"}
            onChange={(e) => onChange({ ...value, align: e.target.value as Paragraph["align"] })}
            style={{ marginLeft: 8 }}
          >
            <option value="left">Links</option>
            <option value="center">Zentriert</option>
            <option value="right">Rechts</option>
          </select>
        </label>
      </div>
      <RichTextEditor
        value={value.paragraph}
        onChange={(paragraph) => onChange({ ...value, paragraph })}
      />
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableParagraph;

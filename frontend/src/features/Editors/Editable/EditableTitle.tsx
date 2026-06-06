import React from "react";
import type { Title } from "@/features/pages/types/blocks/Title";
import { SaveBlockButton } from "@/shared/components";

export interface EditableTitleProps {
  value: Title;
  onChange: (value: Title) => void;
}

const EditableTitle: React.FC<EditableTitleProps> = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        placeholder="Seitentitel"
        style={{ width: "100%", padding: "0.5em" }}
      />
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableTitle;
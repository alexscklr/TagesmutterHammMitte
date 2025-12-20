import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { List } from "@/features/pages/types/blocks";

export interface EditableListProps {
  value: List;
  onChange: (value: List) => void;
}

const EditableList: React.FC<EditableListProps> = ({ value, onChange }) => {
  const update = <K extends keyof List>(k: K, v: List[K]) => onChange({ ...value, [k]: v });

  return (
    <div>
      <label style={{ display: "block", marginBottom: "0.5em" }}>
        Ordered:
        <input
          type="checkbox"
          checked={!!value.ordered}
          onChange={(e) => update("ordered", e.target.checked)}
          style={{ marginLeft: "0.5em" }}
        />
      </label>
      <select
        value={value.listStyle ?? "disc"}
        onChange={(e) => update("listStyle", e.target.value as List["listStyle"])}
      >
        {(["disc","circle","square","decimal","lower-alpha","upper-alpha","lower-roman","upper-roman", "none"] as const).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div style={{ marginTop: "0.5em" }}>
        <SaveBlockButton />
      </div>
      {/* Managing child content blocks is handled by the existing block editor UI */}
    </div>
  );
};

export default EditableList;

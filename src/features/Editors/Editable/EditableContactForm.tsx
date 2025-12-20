import React from "react";
import type { ContactForm } from "@/features/pages/types/blocks";
import { SaveBlockButton } from "@/shared/components";

export interface EditableContactFormProps {
  value: ContactForm;
  onChange: (value: ContactForm) => void;
}

const EditableContactForm: React.FC<EditableContactFormProps> = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        value={value.text}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="Formular Überschrift"
        style={{ width: "100%", padding: "0.5em" }}
      />
      <select
        value={value.level}
        onChange={(e) => onChange({ ...value, level: Number(e.target.value) as ContactForm["level"] })}
        style={{ marginTop: "0.5em" }}
      >
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
      </select>
      {/* Extend to edit fields configuration when available */}
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableContactForm;

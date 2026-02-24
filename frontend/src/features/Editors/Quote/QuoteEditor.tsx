import React, { useState } from "react";
import type { Quote } from "@/features/pages/types/blocks";
import { RichTextEditor } from "@/features/Editors/RichText/RichTextEditor";

export interface QuoteEditorProps {
  value: Quote;
  onChange: (value: Quote) => void;
}

const QuoteEditor: React.FC<QuoteEditorProps> = ({ value, onChange }) => {
  const [author, setAuthor] = useState<string>(value.author || "");

  return (
    <div>
      <RichTextEditor
        value={value.text}
        onChange={(text) => onChange({ ...value, text })}
      />
      <input
        type="text"
        placeholder="Autor (optional)"
        value={author}
        onChange={(e) => {
          const next = e.target.value;
          setAuthor(next);
          onChange({ ...value, author: next || undefined });
        }}
        style={{ width: "100%", padding: "0.5em", marginTop: "0.5em" }}
      />
    </div>
  );
};

export default QuoteEditor;

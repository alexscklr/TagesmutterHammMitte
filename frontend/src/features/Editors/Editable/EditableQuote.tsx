import React from "react";
import type { Quote } from "@/features/pages/types/blocks";
import QuoteEditor from "@/features/Editors/Quote/QuoteEditor";
import { SaveBlockButton } from "@/shared/components";

export interface EditableQuoteProps {
  value: Quote;
  onChange: (value: Quote) => void;
}

const EditableQuote: React.FC<EditableQuoteProps> = ({ value, onChange }) => {
  return (
    <div>
      <QuoteEditor value={value} onChange={onChange} />
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableQuote;

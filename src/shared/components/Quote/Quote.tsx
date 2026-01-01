import React from "react";
import type { RichTextSpan } from "@/shared/types";
import { renderRichText } from "@/shared/components/RichText/renderRichText";

export interface QuoteProps {
  text: RichTextSpan[];
  author?: string;
}

export const Quote: React.FC<QuoteProps> = ({ text, author }) => {
  return (
    <blockquote>
      <div>{renderRichText(text)}</div>
      {author && <cite>— {author}</cite>}
    </blockquote>
  );
};

export default Quote;

import React from "react";
import type { QuoteBlock } from "@/features/pages/types/blocks";
import { renderRichText } from "@/shared/utils/renderRichText";

export interface QuoteProps {
  block: QuoteBlock;
}

export const Quote: React.FC<QuoteProps> = ({ block }) => {
  const { text, author } = block.content;
  return (
    <blockquote>
      <div>{renderRichText(text)}</div>
      {author && <cite>— {author}</cite>}
    </blockquote>
  );
};

export default Quote;

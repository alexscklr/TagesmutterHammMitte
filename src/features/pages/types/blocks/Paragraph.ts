import type { RichTextSpan } from "@/shared/types/index"
import type { PageBlock, PageBlocks } from "../index";

export interface Paragraph {
  paragraph: RichTextSpan[];
}

export type ParagraphBlock = Extract<PageBlock, {type: typeof PageBlocks.Paragraph }>;
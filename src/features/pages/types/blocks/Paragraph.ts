import type { RichTextSpan } from "@/shared/types/index"
import type { PageBlock, PageBlocks } from "../index";

export interface Paragraph {
  paragraph: RichTextSpan[];
  align?: "left" | "center" | "right";
}

export type ParagraphBlock = Extract<PageBlock, {type: typeof PageBlocks.Paragraph }>;
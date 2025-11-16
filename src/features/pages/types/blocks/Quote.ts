import type { RichTextSpan } from "@/shared/types/index";
import type { PageBlock, PageBlocks } from "../index";

export interface Quote {
  text: RichTextSpan[];
  author?: string;
}

export type QuoteBlock = Extract<PageBlock, {type: typeof PageBlocks.Quote }>;
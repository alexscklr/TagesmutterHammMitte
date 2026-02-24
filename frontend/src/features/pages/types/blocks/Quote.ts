import type { RichTextContent } from "@/shared/types/index";
import type { PageBlock, PageBlocks } from "../index";

export interface Quote {
  text: RichTextContent;
  author?: string;
}

export type QuoteBlock = Extract<PageBlock, {type: typeof PageBlocks.Quote }>;
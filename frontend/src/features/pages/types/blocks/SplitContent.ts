import type { PageBlock, PageBlocks } from "../index";

export interface SplitContent {
  firstItemWidth?: number;
  content: PageBlock[];
}

export type SplitContentBlock = Extract<PageBlock, {type: typeof PageBlocks.SplitContent }>;

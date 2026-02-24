import type { PageBlock, PageBlocks } from "../index";

export interface SplitContent {
  firstItemWidth?: number; // Prozentuale Breite des ersten Items (0-100), default: 50
  content: PageBlock[]; // Genau 2 child blocks
}

export type SplitContentBlock = Extract<PageBlock, {type: typeof PageBlocks.SplitContent }>;

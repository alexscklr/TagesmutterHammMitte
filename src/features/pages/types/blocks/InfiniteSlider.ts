import type { PageBlock, PageBlocks } from "../page";

export interface InfiniteSlider {
  content: PageBlock[];
  speed: number;
}

export type InfiniteSliderBlock = Extract<PageBlock, {type: typeof PageBlocks.InfiniteSlider }>;
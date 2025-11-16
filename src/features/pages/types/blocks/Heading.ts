import type { PageBlock, PageBlocks } from "../index";

export interface Heading {
  text: string;
  level: 2 | 3 | 4;
}

export type HeadingBlock = Extract<PageBlock, {type: typeof PageBlocks.Heading }>;
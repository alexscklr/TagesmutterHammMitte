import type { PageBlock, PageBlocks } from "../index";

export interface IBouncyText {
  text: string;
  amplitude?: number;
  duration?: number;
  pauseDuration?: number;
  characterDelay?: number;
  frequency?: number;
}

export type BouncyTextBlock = Extract<PageBlock, {type: typeof PageBlocks.BouncyText }>;
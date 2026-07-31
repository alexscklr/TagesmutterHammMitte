import { type PageBlock, PageBlocks } from "../index";
import { type Heading } from "./index"

export const SectionAppearance = {
  Card: "card",
  Flat: "flat",
} as const;

export type SectionAppearance = typeof SectionAppearance[keyof typeof SectionAppearance];

export interface Section {
  heading: Heading;
  content: PageBlock[];
  appearance?: SectionAppearance;
}

export type SectionBlock = Extract<PageBlock, {type: typeof PageBlocks.Section }>;
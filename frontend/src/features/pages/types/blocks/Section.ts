import { type PageBlock, PageBlocks } from "../index";
import { type Heading } from "./index"

// Appearance options for Section blocks rendered at runtime
export const SectionAppearance = {
  Card: "card",
  Flat: "flat",
} as const;

export type SectionAppearance = typeof SectionAppearance[keyof typeof SectionAppearance];

export interface Section {
  heading: Heading;
  content: PageBlock[];
  appearance?: SectionAppearance; // default = card
}

export type SectionBlock = Extract<PageBlock, {type: typeof PageBlocks.Section }>;
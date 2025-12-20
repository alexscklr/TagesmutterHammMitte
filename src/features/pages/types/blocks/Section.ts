import type { PageBlock, PageBlocks } from "../index";
import { type Heading } from "./index"

// Appearance options for Section blocks rendered at runtime
export enum SectionAppearance {
  Card = "card",
  Flat = "flat",
}

export interface Section {
  heading: Heading;
  content: PageBlock[];
  appearance?: SectionAppearance; // default = card
}

export type SectionBlock = Extract<PageBlock, {type: typeof PageBlocks.Section }>;
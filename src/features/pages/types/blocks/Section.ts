import type { PageBlock, PageBlocks } from "../index";
import { type Heading } from "./index"

export interface Section {
  heading: Heading;
  content: PageBlock[];
}

export type SectionBlock = Extract<PageBlock, {type: typeof PageBlocks.Section }>;
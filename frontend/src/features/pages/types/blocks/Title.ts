import { PageBlocks, type PageBlock } from "../index"

export interface Title {
  title: string;
}

export type TitleBlock = Extract<PageBlock, { type: typeof PageBlocks.Title }>;
import type { FooterBlock, FooterBlocks } from "..";


export interface List {
  content: FooterBlock[];
}

export type ListBlock = Extract<FooterBlock, {type: typeof FooterBlocks.List }>;
import type { PageBlock, PageBlocks } from "../index";

export interface List {
  content: PageBlock[];
  listStyle?: "disc" | "circle" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman";
  ordered?: boolean;
  margin?: "left" | "center" | "right";
}

export type ListBlock = Extract<PageBlock, {type: typeof PageBlocks.List }>;
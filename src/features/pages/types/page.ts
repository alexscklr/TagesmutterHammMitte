import type {
  Title,
  Paragraph,
  BouncyText,
  Imagery,
  List,
  Quote,
  Timeline,
  Heading
} from "./blocks";

export const PageBlocks = {
  Title: "title",
  Paragraph: "paragraph",
  BouncyText: "bouncytext",
  Imagery: "imagery",
  List: "list",
  Quote: "quote",
  Timeline: "timeline",
  Heading: "heading",
  Section: "section"
} as const;

export type PageBlockType = typeof PageBlocks[keyof typeof PageBlocks];

export type PageBlock =
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Title; order: number; content: Title }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Paragraph; order: number; content: Paragraph }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.BouncyText; order: number; content: BouncyText }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Imagery; order: number; content: Imagery }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.List; order: number; content: List }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Quote; order: number; content: Quote }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Timeline; order: number; content: Timeline }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Heading; order: number; content: Heading }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Section; order: number; content: Section };

export interface Section {
  title: Heading;
  content: PageBlock[];
}

export type Page = PageBlock[];

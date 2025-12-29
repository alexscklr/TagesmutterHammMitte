
import type {
  Section,
  Title,
  Paragraph,
  IBouncyText,
  GoogleLocation,
  Imagery,
  List,
  Quote,
  Timeline,
  Heading,
  InfiniteSlider,
  TimelineEntry,
  ContactForm,
  SplitContent
} from "./blocks";

export const PageBlocks = {
  Title: "title",
  Paragraph: "paragraph",
  BouncyText: "bouncytext",
  Imagery: "imagery",
  List: "list",
  Quote: "quote",
  Timeline: "timeline",
  TimelineEntry: "timelineentry",
  Heading: "heading",
  Section: "section",
  InfiniteSlider: "infiniteslider",
  GoogleLocation: "googlelocation",
  ContactForm: "contactform",
  SplitContent: "splitcontent"
} as const;

export const ContainerBlocks = [
  PageBlocks.Section,
  PageBlocks.InfiniteSlider,
  PageBlocks.Timeline,
  PageBlocks.TimelineEntry,
  PageBlocks.SplitContent
]

export type PageBlockType = typeof PageBlocks[keyof typeof PageBlocks];

export type PageBlock =
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Title; order: number; content: Title }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Paragraph; order: number; content: Paragraph }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.BouncyText; order: number; content: IBouncyText }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Imagery; order: number; content: Imagery }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.List; order: number; content: List }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Quote; order: number; content: Quote }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Timeline; order: number; content: Timeline }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.TimelineEntry; order: number; content: TimelineEntry }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Heading; order: number; content: Heading }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.InfiniteSlider; order: number; content: InfiniteSlider }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.Section; order: number; content: Section }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.GoogleLocation; order: number; content: GoogleLocation }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.ContactForm; order: number; content: ContactForm }
  | { id: string; parent_block_id: string | null; type: typeof PageBlocks.SplitContent; order: number; content: SplitContent };

export type Page = PageBlock[];

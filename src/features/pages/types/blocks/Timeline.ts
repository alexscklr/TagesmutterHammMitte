import type { PageBlock, PageBlocks } from "../index";

export interface TimelineEntry {
  label: string;
  timeSpan: [string, string];
  title: string;
  content: PageBlock[];
}


export interface Timeline {
  entries: TimelineEntry[];
}

export type TimelineBlock = Extract<PageBlock, {type: typeof PageBlocks.Timeline }>;
export type TimelineEntryBlock = Extract<PageBlock, {type: typeof PageBlocks.TimelineEntry }>;
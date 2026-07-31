import type { PageBlock, PageBlocks } from "../index";

export interface TimelineEntry {
  label: string;
  title: string;
  content: PageBlock[];
  timeSpan?: [string, string];
  year?: number;
  yearSpan?: [number, number];
}


export interface Timeline {
  entries: TimelineEntry[];
  content?: PageBlock[];
}

export type TimelineBlock = Extract<PageBlock, {type: typeof PageBlocks.Timeline }>;
export type TimelineEntryBlock = Extract<PageBlock, {type: typeof PageBlocks.TimelineEntry }>;
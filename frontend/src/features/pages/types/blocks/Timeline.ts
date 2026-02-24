import type { PageBlock, PageBlocks } from "../index";

export interface TimelineEntry {
  label: string;
  title: string;
  content: PageBlock[];
  // Optional markers: support either time-of-day or year-based entries
  timeSpan?: [string, string]; // e.g. ["08:00", "10:30"]
  year?: number;              // e.g. 2021
  yearSpan?: [number, number]; // e.g. [2018, 2020]
}


export interface Timeline {
  entries: TimelineEntry[];
  content?: PageBlock[]; // Child TimelineEntry blocks for edit mode
}

export type TimelineBlock = Extract<PageBlock, {type: typeof PageBlocks.Timeline }>;
export type TimelineEntryBlock = Extract<PageBlock, {type: typeof PageBlocks.TimelineEntry }>;
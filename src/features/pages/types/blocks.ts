import type { RichTextSpan } from "./inline";

export interface Title {
  title: string;
}

export interface Heading {
  text: string;
  level: 2 | 3 | 4;
}

export interface Paragraph {
  paragraph: RichTextSpan[];
}

export interface BouncyText {
  text: string;
  amplitude?: number;
  duration?: number;
  pauseDuration?: number;
  characterDelay?: number;
  frequency?: number;
}

export interface Image {
  url: string;
  alt: string;
  source?: string;
  sourceUrl?: string;
  license?: string;
}

export interface Imagery {
  images: Image[];
}

export interface TimelineEntry {
  label: string;
  timeSpan: [string, string];
  title: string;
  description: RichTextSpan[];
  images?: Image[];
}

export interface Timeline {
  entries: TimelineEntry[];
}

export interface List {
  list_elements: string[];
}

export interface Quote {
  text: RichTextSpan[];
  author?: string;
}

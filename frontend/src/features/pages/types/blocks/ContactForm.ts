import type { PageBlock, PageBlocks } from "../index";

export interface ContactForm {
  text: string;
  level: 2 | 3 | 4;
}

export type ContactFormBlock = Extract<PageBlock, {type: typeof PageBlocks.ContactForm }>;
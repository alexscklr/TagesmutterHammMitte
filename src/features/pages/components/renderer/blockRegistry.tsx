import { type JSX } from "react";
import { PageBlocks, type PageBlock } from "../../types";
import {
  TitleBlock,
  HeadingBlock,
  ImageryBlock,
  ListBlock,
  ParagraphBlock,
  QuoteBlock,
  SectionBlock,
  TimelineBlock,
  InfiniteSliderBlock,
  TimelineEntryBlock,
  GoogleLocationBlock,
  ContactFormBlock,
  SplitContentBlock,
} from "../blocks";

import {
  type TitleBlock as TitleBlockType,
  type ImageryBlock as ImageryBlockType,
  type HeadingBlock as HeadingBlockType,
  type ListBlock as ListBlockType,
  type ParagraphBlock as ParagraphBlockType,
  type QuoteBlock as QuoteBlockType,
  type SectionBlock as SectionBlockType,
  type TimelineBlock as TimelineBlockType,
  type InfiniteSliderBlock as InfiniteSliderBlockType,
  type TimelineEntryBlock as TimelineEntryBlockType,
  type GoogleLocationBlock as GoogleLocationBlockType,
  type ContactFormBlock as ContactFormBlockType,
  type SplitContentBlock as SplitContentBlockType,
} from "../../types/blocks";

export type BlockComponentMap = {
  [PageBlocks.Title]: (block: TitleBlockType) => JSX.Element;
  [PageBlocks.Heading]: (block: HeadingBlockType) => JSX.Element;
  [PageBlocks.Paragraph]: (block: ParagraphBlockType) => JSX.Element;
  [PageBlocks.List]: (block: ListBlockType) => JSX.Element;
  [PageBlocks.Imagery]: (block: ImageryBlockType) => JSX.Element;
  [PageBlocks.Quote]: (block: QuoteBlockType) => JSX.Element;
  [PageBlocks.Timeline]: (block: TimelineBlockType) => JSX.Element;
  [PageBlocks.TimelineEntry]: (block: TimelineEntryBlockType) => JSX.Element;
  [PageBlocks.Section]: (block: SectionBlockType) => JSX.Element;
  [PageBlocks.InfiniteSlider]: (block: InfiniteSliderBlockType) => JSX.Element;
  [PageBlocks.GoogleLocation]: (block: GoogleLocationBlockType) => JSX.Element;
  [PageBlocks.ContactForm]: (block: ContactFormBlockType) => JSX.Element;
  [PageBlocks.SplitContent]: (block: SplitContentBlockType) => JSX.Element;
};

export const blockMap: BlockComponentMap = {
  [PageBlocks.Title]: (block) => <TitleBlock block={block} />,
  [PageBlocks.Heading]: (block) => <HeadingBlock block={block} />,
  [PageBlocks.Paragraph]: (block) => <ParagraphBlock block={block} />,
  [PageBlocks.List]: (block) => <ListBlock block={block} />,
  [PageBlocks.Imagery]: (block) => <ImageryBlock block={block} />,
  [PageBlocks.Quote]: (block) => <QuoteBlock block={block} />,
  [PageBlocks.Timeline]: (block) => <TimelineBlock block={block} />,
  [PageBlocks.TimelineEntry]: (block) => <TimelineEntryBlock block={block} />,
  [PageBlocks.Section]: (block) => <SectionBlock block={block} />,
  [PageBlocks.InfiniteSlider]: (block) => <InfiniteSliderBlock block={block} />,
  [PageBlocks.GoogleLocation]: (block) => <GoogleLocationBlock block={block} />,
  [PageBlocks.ContactForm]: (block) => <ContactFormBlock block={block} />,
  [PageBlocks.SplitContent]: (block) => <SplitContentBlock block={block} />,
};

export function getBlockComponent(block: PageBlock): JSX.Element | null {
    const renderer = blockMap[block.type as keyof BlockComponentMap] as ((block: PageBlock) => JSX.Element);
    if (!renderer) return null;
    return renderer(block);
}

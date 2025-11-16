// render/renderPageBlock.tsx
import type { JSX, ReactNode } from "react";
import { PageBlocks, type PageBlock } from "../types/index";
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
  BouncyTextBlock,
  TimelineEntryBlock,
  GoogleLocationBlock,
  ContactFormBlock
} from "./blocks/index";
import React from "react";

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
  type BouncyTextBlock as BouncyTextBlockType,
  type TimelineEntryBlock as TimelineEntryBlockType,
  type GoogleLocationBlock as GoogleLocationBlockType,
  type ContactFormBlock as ContactFormBlockType
} from "../types/blocks";




type BlockComponentMap = {
  [PageBlocks.Title]: (block: TitleBlockType) => JSX.Element;
  [PageBlocks.Heading]: (block: HeadingBlockType) => JSX.Element;
  [PageBlocks.Paragraph]: (block: ParagraphBlockType) => JSX.Element;
  [PageBlocks.List]: (block: ListBlockType) => JSX.Element;
  [PageBlocks.BouncyText]: (block: BouncyTextBlockType) => JSX.Element;
  [PageBlocks.Imagery]: (block: ImageryBlockType) => JSX.Element;
  [PageBlocks.Quote]: (block: QuoteBlockType) => JSX.Element;
  [PageBlocks.Timeline]: (block: TimelineBlockType) => JSX.Element;
  [PageBlocks.TimelineEntry]: (block: TimelineEntryBlockType) => JSX.Element;
  [PageBlocks.Section]: (block: SectionBlockType) => JSX.Element;
  [PageBlocks.InfiniteSlider]: (block: InfiniteSliderBlockType) => JSX.Element;
  [PageBlocks.GoogleLocation]: (block: GoogleLocationBlockType) => JSX.Element;
  [PageBlocks.ContactForm]: (block: ContactFormBlockType) => JSX.Element;
};


const blockMap: BlockComponentMap = {
  [PageBlocks.Title]: (block) => <TitleBlock block={block} />,
  [PageBlocks.Heading]: (block) => <HeadingBlock block={block} />,
  [PageBlocks.Paragraph]: (block) => <ParagraphBlock block={block} />,
  [PageBlocks.List]: (block) => <ListBlock block={block} />,
  [PageBlocks.BouncyText]: (block) => <BouncyTextBlock block={block} />,
  [PageBlocks.Imagery]: (block) => <ImageryBlock block={block} />,
  [PageBlocks.Quote]: (block) => <QuoteBlock block={block} />,
  [PageBlocks.Timeline]: (block) => <TimelineBlock block={block} />,
  [PageBlocks.TimelineEntry]: (block) => <TimelineEntryBlock block={block} />,
  [PageBlocks.Section]: (block) => <SectionBlock block={block} />,
  [PageBlocks.InfiniteSlider]: (block) => <InfiniteSliderBlock block={block} />,
  [PageBlocks.GoogleLocation]: (block) => <GoogleLocationBlock block={block} />,
  [PageBlocks.ContactForm]: (block) => <ContactFormBlock block={block} />
}


export function renderPageBlock(block: PageBlock): ReactNode {
  const render = blockMap[block.type] as ((block: PageBlock) => JSX.Element | null) | undefined;
  return <React.Fragment key={block.id}>{render ? render(block) : null}</React.Fragment>
}

import React, { type JSX } from "react";
import { PageBlocks, type PageBlock } from "../types";
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
  ContactFormBlock,
} from "./blocks";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useEditing } from "@/features/admin/context/hooks/useEditing";
import { DeleteBlockButton } from "./DeleteBlockButton";
import {
  EditableParagraph,
  EditableHeading,
  EditableQuote,
  EditableBouncyText,
  EditableTimelineEntry,
  EditableList,
  EditableImagery,
  EditableSection,
  EditableGoogleLocation,
  EditableContactForm,
} from "@/features/Editors";

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
  type ContactFormBlock as ContactFormBlockType,
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
  [PageBlocks.ContactForm]: (block) => <ContactFormBlock block={block} />,
};

export const SelectableBlock: React.FC<{ block: PageBlock }> = ({ block }) => {
  const { selectedBlock, setSelectedBlock } = useSelection();
  const { user } = React.useContext(AuthContext);
  const { isEditing } = useEditMode();
  const { changedBlock, setChangedBlock } = useEditing();
  const render = blockMap[block.type] as ((block: PageBlock) => JSX.Element | null) | undefined;
  const isSelected = selectedBlock?.id === block.id;
  const activeBlock = isSelected && changedBlock?.id === block.id ? changedBlock : block;

  const renderEditable = () => {
    if (!isEditing || !isSelected) return null;
    switch (activeBlock.type) {
      case PageBlocks.Paragraph:
        return (
          <div className="editable-inline" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
              <DeleteBlockButton blockId={activeBlock.id} />
            </div>
            <EditableParagraph
              value={activeBlock.content as ParagraphBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.Heading:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableHeading
              value={activeBlock.content as HeadingBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.Quote:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableQuote
              value={activeBlock.content as QuoteBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.BouncyText:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableBouncyText
              value={activeBlock.content as BouncyTextBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.TimelineEntry:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableTimelineEntry
              value={activeBlock.content as TimelineEntryBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.List:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableList
              value={activeBlock.content as ListBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.Imagery:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableImagery
              value={activeBlock.content as ImageryBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.Section:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableSection
              value={activeBlock.content as SectionBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.GoogleLocation:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableGoogleLocation
              value={activeBlock.content as GoogleLocationBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      case PageBlocks.ContactForm:
        return (
          <div className="editable-inline" style={{ display: "contents" }}>
            <EditableContactForm
              value={activeBlock.content as ContactFormBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      data-block-id={block.id}
      className="selectable-block-wrapper"
      style={{
        display: isEditing ? "block" : "contents",
        outline: isSelected ? "2px solid var(--color-accent)" : "none",
        borderRadius: isEditing ? "0.5rem" : "0",
        background: isEditing 
          ? (isSelected ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.04)") 
          : "transparent",
        padding: isEditing ? "0.75rem" : "0",
        marginBottom: isEditing ? "0.5rem" : "0",
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (user) setSelectedBlock(block);
      }}
    >
      {renderEditable() ?? (render ? render(activeBlock) : null)}
    </div>
  );
};

export default SelectableBlock;

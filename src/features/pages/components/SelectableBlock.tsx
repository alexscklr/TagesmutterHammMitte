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
  TimelineEntryBlock,
  GoogleLocationBlock,
  ContactFormBlock,
  SplitContentBlock,
} from "./blocks";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useEditing } from "@/features/admin/context/hooks/useEditing";
import { DeleteBlockButton } from "./DeleteBlockButton";
import { BlockEditorModal } from "./BlockEditorModal";
import {
  EditableParagraph,
  EditableHeading,
  EditableQuote,
  EditableTimelineEntry,
  EditableList,
  EditableImagery,
  EditableSection,
  EditableGoogleLocation,
  EditableContactForm,
  EditableSplitContent,
  EditableInfiniteSlider,
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
  type TimelineEntryBlock as TimelineEntryBlockType,
  type GoogleLocationBlock as GoogleLocationBlockType,
  type ContactFormBlock as ContactFormBlockType,
  type SplitContentBlock as SplitContentBlockType,
} from "../types/blocks";

type BlockComponentMap = {
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

const blockMap: BlockComponentMap = {
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

// Wrapper für editierbare Blöcke; delete stays with the modal header actions
const EditableBlockWrapper: React.FC<{ blockId: string; children: React.ReactNode }> = ({ blockId, children }) => (
  <div className="editable-inline" style={{ position: "relative", width: "100%", boxSizing: "border-box" }}>
    {children}
  </div>
);

export const SelectableBlock: React.FC<{ block: PageBlock }> = ({ block }) => {
  const { selectedBlock, setSelectedBlock } = useSelection();
  const { user } = React.useContext(AuthContext);
  const { isEditing } = useEditMode();
  const { changedBlock, setChangedBlock } = useEditing();
  const render = block.type in blockMap ? (blockMap[block.type as keyof typeof blockMap] as ((block: PageBlock) => JSX.Element | null)) : undefined;
  const isSelected = selectedBlock?.id === block.id;
  const activeBlock = isSelected && changedBlock?.id === block.id ? changedBlock : block;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isSelected) {
      setIsModalOpen(false);
    }
  }, [isSelected]);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
    // Deselect after a brief delay to allow modal close animation
    setTimeout(() => setSelectedBlock(null), 0);
  }, [setSelectedBlock]);

  const renderEditable = () => {
    if (!isEditing || !isSelected) return null;
    
    const blockType = activeBlock.type;
    const blockContent = activeBlock.content;
    const blockId = activeBlock.id;

    switch (blockType) {
      case PageBlocks.Paragraph:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableParagraph
              value={blockContent as ParagraphBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.Heading:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableHeading
              value={blockContent as HeadingBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.Quote:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableQuote
              value={blockContent as QuoteBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.TimelineEntry:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableTimelineEntry
              value={blockContent as TimelineEntryBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.List:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableList
              value={blockContent as ListBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.Imagery:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableImagery
              value={blockContent as ImageryBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.Section:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableSection
              value={blockContent as SectionBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.GoogleLocation:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableGoogleLocation
              value={blockContent as GoogleLocationBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.ContactForm:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableContactForm
              value={blockContent as ContactFormBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.SplitContent:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableSplitContent
              value={blockContent as SplitContentBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
        );
      case PageBlocks.InfiniteSlider:
        return (
          <EditableBlockWrapper blockId={blockId}>
            <EditableInfiniteSlider
              value={blockContent as InfiniteSliderBlockType["content"]}
              onChange={(content) => { setChangedBlock({ ...activeBlock, content } as PageBlock); }}
            />
          </EditableBlockWrapper>
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
          ? (isSelected ? "rgba(0,255,0,0.04)" : "rgba(0,0,0,0.04)") 
          : "transparent",
        padding: isEditing ? "0.75rem" : "0",
        marginBottom: isEditing ? "0.5rem" : "0",
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (user) {
          setSelectedBlock(block);
          if (isEditing) setIsModalOpen(true);
        }
      }}
    >
      {render ? render(activeBlock) : null}
      <BlockEditorModal
        open={isEditing && isSelected && isModalOpen}
        title="Block bearbeiten"
        onClose={handleCloseModal}
        actions={<DeleteBlockButton blockId={activeBlock.id} />}
      >
        {renderEditable() ?? <p style={{ margin: 0 }}>Für diesen Block ist kein Editor verfügbar.</p>}
      </BlockEditorModal>
    </div>
  );
};

export default SelectableBlock;

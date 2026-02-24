import { Timeline, TimelineItem } from "@/shared/components/Timeline/Timeline";
import type { TimelineBlock as TimelineBlockType, TimelineEntryBlock } from "../../types/index";
import { renderPageBlock } from "..";
import React from "react";
import { AddBlockButton } from "../editor/AddBlockButton";
import { useEditMode } from "@/features/admin/hooks/useEditMode";

interface TimelineBlockProps {
  block: TimelineBlockType;
}

export function TimelineBlock({ block }: TimelineBlockProps) {
  const { isEditing } = useEditMode();
  const entryBlocks = (block.content.content as TimelineEntryBlock[] | undefined) || [];
  const entries = block.content.entries || [];

  if (isEditing) {
    // In edit mode, wrap in Timeline container to keep the look
    return (
      <Timeline>
        <AddBlockButton order={0} parentBlockId={block.id} />
        {entryBlocks.map((entryBlock) => (
          <React.Fragment key={entryBlock.id}>
            <div
              style={{
                position: "relative",
              }}
            >
              {renderPageBlock(entryBlock, true)}
            </div>
            <AddBlockButton order={entryBlock.order + 1} parentBlockId={block.id} />
          </React.Fragment>
        ))}
      </Timeline>
    );
  }

  // In normal mode, use the Timeline presentation component
  return (
    <div style={{ width: "100%" }}>
      <Timeline key={block.id} data={entries} />
    </div>
  );
};



interface TimelineEntryBlockProps {
  block: TimelineEntryBlock;
}

export function TimelineEntryBlock({ block }: TimelineEntryBlockProps) {
  const { isEditing } = useEditMode();
  const children = block.content.content || [];

  if (isEditing) {
    // In edit mode (whether selected or not), use TimelineItem layout
    return (
      <TimelineItem
        label={block.content.label}
        title={block.content.title}
        isActive={true} // In edit mode, maybe force active or let Timeline handle it? 
        // For now force active so it's fully visible
      >
        <div style={{ marginTop: "0.5rem" }}>
          <AddBlockButton order={0} parentBlockId={block.id} />
          {children.map((child) => (
            <React.Fragment key={child.id}>
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                {renderPageBlock(child, true)}
              </div>
              <AddBlockButton order={child.order + 1} parentBlockId={block.id} />
            </React.Fragment>
          ))}
        </div>
      </TimelineItem>
    );
  }

  // Normal rendering should theoretically happen via Timeline data prop, 
  // but if this component is rendered directly (e.g. by direct renderPageBlock call),
  // we use TimelineItem.
  return (
    <TimelineItem
        label={block.content.label}
        title={block.content.title}
    >
      {children.map((child) => (
        <React.Fragment key={child.id}>
          {renderPageBlock(child)}
        </React.Fragment>
      ))}
    </TimelineItem>
  );
}
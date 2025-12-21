import { Timeline } from "@/shared/components";
import type { TimelineBlock as TimelineBlockType, TimelineEntryBlock } from "../../types/index";
import { renderPageBlock } from "..";
import React from "react";
import { AddBlockButton } from "../AddBlockButton";
import { DeleteBlockButton } from "../DeleteBlockButton";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { useSelection } from "@/features/admin/context/hooks/useSelection";

interface TimelineBlockProps {
  block: TimelineBlockType;
}

export function TimelineBlock({ block }: TimelineBlockProps) {
  const { isEditing } = useEditMode();
  const entryBlocks = (block.content.content as TimelineEntryBlock[] | undefined) || [];
  const entries = block.content.entries || [];

  if (isEditing) {
    // In edit mode, render entry blocks as selectable blocks
    return (
      <div style={{ width: "100%" }}>
        <AddBlockButton order={0} parentBlockId={block.id} />
        {entryBlocks.map((entryBlock) => (
          <React.Fragment key={entryBlock.id}>
            <div
              style={{
                position: "relative",
                padding: "1rem",
                marginBottom: "1rem",
                background: "rgba(0,0,0,0.03)",
                borderRadius: "0.6rem",
              }}
            >
              <DeleteBlockButton blockId={entryBlock.id} />
              {renderPageBlock(entryBlock)}
            </div>
            <AddBlockButton order={entryBlock.order + 1} parentBlockId={block.id} />
          </React.Fragment>
        ))}
      </div>
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
  const { selectedBlock } = useSelection();
  const children = block.content.content || [];
  const isSelected = selectedBlock?.id === block.id;

  if (isEditing && !isSelected) {
    // Edit mode but this TimelineEntry is not selected
    // Show normal content with add/delete buttons for children
    return (
      <div className="timeline-entry">
        <div className="time-box">{block.content.label}</div>
        <h3>{block.content.title}</h3>
        <div style={{ marginTop: "0.5rem" }}>
          <AddBlockButton order={0} parentBlockId={block.id} />
          {children.map((child) => (
            <React.Fragment key={child.id}>
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                <div style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
                  <DeleteBlockButton blockId={child.id} />
                </div>
                {renderPageBlock(child)}
              </div>
              <AddBlockButton order={child.order + 1} parentBlockId={block.id} />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Normal rendering (non-edit mode or when selected - EditableTimelineEntry is shown by SelectableBlock)
  return (
    <div className="timeline-entry">
      <div className="time-box">{block.content.label}</div>
      <h3>{block.content.title}</h3>
      {children.map((child) => (
        <div key={child.id} className="timeline-entry-content">
          {renderPageBlock(child)}
        </div>
      ))}
    </div>
  );
}
import { Timeline } from "@/shared/components";
import type { TimelineBlock, TimelineEntryBlock } from "../../types/index";
import { renderPageBlock } from "..";
import React from "react";
import { AddBlockButton } from "../AddBlockButton";

interface TimelineBlockProps {
    block: TimelineBlock;
}

export function TimelineBlock({ block }: TimelineBlockProps) {
    const entries = block.content.entries || [];
    return (
      <div style={{ width: "100%" }}>
        {/* Insert before first entry */}
        <AddBlockButton order={0} parentBlockId={block.id} />
        <Timeline key={block.id} data={entries} />
        {/* Insert after last entry */}
        <AddBlockButton order={entries.length} parentBlockId={block.id} />
      </div>
    );
};



interface TimelineEntryBlockProps {
  block: TimelineEntryBlock;
}

export function TimelineEntryBlock({ block }: TimelineEntryBlockProps) {
  return (
    <div className="timeline-entry">
      <div className="time-box">{block.content.label}</div>
      <h3>{block.content.title}</h3>
      {/* Insert before first child */}
      <AddBlockButton order={0} parentBlockId={block.id} />
      {block.content.content.map((child) => (
        <React.Fragment key={child.id}>
          <div className="timeline-entry-content">
            {renderPageBlock(child)}
          </div>
          <AddBlockButton order={child.order + 1} parentBlockId={block.id} />
        </React.Fragment>
      ))}
    </div>
  );
}
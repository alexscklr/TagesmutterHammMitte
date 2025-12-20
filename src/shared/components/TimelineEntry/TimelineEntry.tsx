import React from "react";
import type { TimelineEntryBlock } from "@/features/pages/types/blocks";
import { renderPageBlock } from "@/features/pages/components";

export interface TimelineEntryProps {
  block: TimelineEntryBlock;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ block }) => {
  const { label, title, content } = block.content;
  return (
    <div className="timeline-entry">
      <div className="time-box">{label}</div>
      <h3>{title}</h3>
      <div className="timeline-entry-content">
        {content.map((child) => (
          <div key={child.id}>{renderPageBlock(child)}</div>
        ))}
      </div>
    </div>
  );
};

export default TimelineEntry;

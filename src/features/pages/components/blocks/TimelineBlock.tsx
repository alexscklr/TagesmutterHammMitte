import { Timeline } from "@/shared/components";
import type { TimelineBlock, TimelineEntryBlock } from "../../types/index";
import { renderPageBlock } from "..";

interface TimelineBlockProps {
    block: TimelineBlock;
}

export function TimelineBlock({ block }: TimelineBlockProps) {

    return <Timeline key={block.id} data={block.content.entries} />;
};



interface TimelineEntryBlockProps {
  block: TimelineEntryBlock;
}

export function TimelineEntryBlock({ block }: TimelineEntryBlockProps) {
  return (
    <div className="timeline-entry">
      <div className="time-box">{block.content.label}</div>
      <h3>{block.content.title}</h3>

      {block.content.content.map((child) => (
        <div key={child.id} className="timeline-entry-content">
          {renderPageBlock(child)}
        </div>
      ))}
    </div>
  );
}
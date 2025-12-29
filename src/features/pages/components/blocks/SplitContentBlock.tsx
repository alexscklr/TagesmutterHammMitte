import type { SplitContentBlock as TSplitContentBlock } from "../../types/blocks";
import { renderPageBlock } from "..";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { AddBlockButton } from "../AddBlockButton";
import { SplitContent } from "@/shared/components";

interface SplitContentBlockProps {
  block: TSplitContentBlock;
}

export function SplitContentBlock({ block }: SplitContentBlockProps) {
  const { isEditing } = useEditMode();
  const children = block.content.content ?? [];
  const firstItemWidth = block.content.firstItemWidth ?? 50;

  // In edit mode, we show the structure with add buttons
  if (isEditing) {
    return (
      <SplitContent firstItemWidth={firstItemWidth}>
        <div>
          {!children[0] ? (
            <AddBlockButton order={0} parentBlockId={block.id} />
          ) : (
            <div style={{ position: "relative" }}>
              {renderPageBlock(children[0])}
            </div>
          )}
        </div>
        
        <div>
          {!children[1] ? (
            <AddBlockButton order={children[0] ? children[0].order + 1 : 1} parentBlockId={block.id} />
          ) : (
            <div style={{ position: "relative" }}>
              {renderPageBlock(children[1])}
            </div>
          )}
        </div>
      </SplitContent>
    );
  }

  // In view mode, use the shared SplitContent component
  return (
    <SplitContent firstItemWidth={firstItemWidth}>
      {children[0] ? renderPageBlock(children[0]) : <div />}
      {children[1] ? renderPageBlock(children[1]) : <div />}
    </SplitContent>
  );
}

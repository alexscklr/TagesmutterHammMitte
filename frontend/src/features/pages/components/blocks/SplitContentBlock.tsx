import type { SplitContentBlock as TSplitContentBlock } from "../../types/blocks";
import { renderPageBlock } from "..";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { AddBlockButton } from "../editor/AddBlockButton";
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
    const firstChild = (
      <div>
        {!children[0] ? (
          <AddBlockButton order={0} parentBlockId={block.id} />
        ) : (
          <div style={{ position: "relative" }}>
            {renderPageBlock(children[0], true)}
          </div>
        )}
      </div>
    );

    const secondChild = (
      <div>
        {!children[1] ? (
          <AddBlockButton order={children[0] ? children[0].order + 1 : 1} parentBlockId={block.id} />
        ) : (
          <div style={{ position: "relative" }}>
            {renderPageBlock(children[1], true)}
          </div>
        )}
      </div>
    );

    return (
      <SplitContent firstItemWidth={firstItemWidth} children={[firstChild, secondChild]} />
    );
  }

  // In view mode, use the shared SplitContent component
  const firstChild = children[0] ? renderPageBlock(children[0]) : <div />;
  const secondChild = children[1] ? renderPageBlock(children[1]) : <div />;
  
  return (
    <SplitContent firstItemWidth={firstItemWidth} children={[firstChild, secondChild]} />
  );
}

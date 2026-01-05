// ...existing code...
import { List } from "@/shared/components/List/List";
import { type PageBlock } from "../../types";
import type { ListBlock as TListBlock } from "../../types";
import { renderPageBlock } from "..";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
// ...existing code...

interface ListBlockProps {
  block: TListBlock;
}

export function ListBlock({ block }: ListBlockProps) {
  const { isEditing } = useEditMode();
  
  const children = (block.content?.content ?? []) as PageBlock[];
  const hasItems = children.length > 0;

  return (
    <List
      listStyle={block.content.listStyle || "disc"}
      ordered={block.content.ordered || false}
      margin={block.content.margin}
      width={isEditing ? "full" : "default"}
      style={isEditing ? { minHeight: "110px", padding: "0.4rem 0" } : undefined}
    >
      {hasItems
        ? children.map((childBlock) => (
            <li key={childBlock.id}>{renderPageBlock(childBlock)}</li>
          ))
        : isEditing && <li style={{ opacity: 0.7, fontStyle: "italic", pointerEvents: "none" }}>Liste ist leer</li>
      }
    </List>
  );
}
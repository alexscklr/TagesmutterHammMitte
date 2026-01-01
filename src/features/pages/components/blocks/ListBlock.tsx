// ...existing code...
import { List } from "@/shared/components/List/List";
import { type PageBlock } from "../../types";
import type { ListBlock as TListBlock } from "../../types";
import { renderPageBlock } from "..";
// ...existing code...

interface ListBlockProps {
  block: TListBlock;
}

export function ListBlock({ block }: ListBlockProps) {
  
  const children = (block.content?.content ?? []) as PageBlock[];

  return (
    <List
      listStyle={block.content.listStyle || "disc"}
      ordered={block.content.ordered || false}
      margin={block.content.margin}
    >
      {children.map((childBlock) => (
        <li key={childBlock.id}>{renderPageBlock(childBlock)}</li>
      ))}
    </List>
  );
}
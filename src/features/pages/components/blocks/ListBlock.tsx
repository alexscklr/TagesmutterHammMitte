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
      content={children.map((childBlock) => (renderPageBlock(childBlock)))}
      listStyle={block.content.listStyle || "disc"}
      ordered={block.content.ordered || false}
    />
  );
}
// ...existing code...
import { List } from "@/shared/components/List/List";
import type { FooterBlock, ListBlock as TListBlock } from "../../types";
import { renderFooterBlock } from "../FooterBlockRenderer";

interface ListBlockProps {
  block: TListBlock;
}

export function ListBlock({ block }: ListBlockProps) {

  const children = (block.content?.content ?? []) as FooterBlock[];

  return (
    <div className="footerBlock">
      <List
        listStyle={"none"}
        ordered={false}
      >
        {children.map((childBlock) => (
          <li key={(childBlock as any).id}>{renderFooterBlock(childBlock)}</li>
        ))}
      </List>
    </div>
  );
}
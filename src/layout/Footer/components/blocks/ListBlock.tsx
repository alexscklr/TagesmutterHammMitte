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
        content={children.map((childBlock) => (renderFooterBlock(childBlock)))}
        listStyle={"none"}
        ordered={false}
      />
    </div>
  );
}
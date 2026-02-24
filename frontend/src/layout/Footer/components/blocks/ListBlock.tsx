// ...existing code...
import { List } from "@/shared/components/List/List";
import type { FooterBlock, ListBlock as TListBlock } from "../../types";
import { renderFooterBlock } from "../FooterBlockRenderer";
import styles from "../../Footer.module.css";

interface ListBlockProps {
  block: TListBlock;
}

export function ListBlock({ block }: ListBlockProps) {

  const children = (block.content?.content ?? []) as FooterBlock[];

  return (
    <div className={styles.footerBlock}>
      <List
        listStyle={"none"}
        ordered={false}
        width={"full"}
      >
        {children.map((childBlock) => (
          <li key={(childBlock as any).id}>{renderFooterBlock(childBlock)}</li>
        ))}
      </List>
    </div>
  );
}
import type { CopyrightNoticeBlock } from "../../types";
import styles from "../../Footer.module.css";


interface CopyrightNoticeBlockProps {
  block: CopyrightNoticeBlock;
}

export function CopyrightNoticeBlock({ block }: CopyrightNoticeBlockProps) {
  return (
    <div className={styles.copyrightNotice}>
      <p>{(block.content as any).notice || (block.content as any).text || ""}</p>
    </div>
  );
}

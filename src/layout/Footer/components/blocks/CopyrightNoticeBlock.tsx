import type { CopyrightNoticeBlock } from "../../types";


interface CopyrightNoticeBlockProps {
  block: CopyrightNoticeBlock;
}

export function CopyrightNoticeBlock({ block }: CopyrightNoticeBlockProps) {
  return (
    <div className="copyright-notice">
      <p>{(block.content as any).notice || (block.content as any).text || ""}</p>
    </div>
  );
}

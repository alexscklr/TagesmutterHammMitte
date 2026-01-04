import styles from "./Paragraph.module.css";
import type { RichTextSpan } from "@/shared/types";
import { renderRichText } from "@/shared/components";

interface ParagraphProps {
  text: RichTextSpan[];
  align?: "left" | "center" | "right";
}

export function Paragraph({ text, align }: ParagraphProps) {
  return <p className={styles.p} style={{ textAlign: align }}>{renderRichText(text)}</p>;
}
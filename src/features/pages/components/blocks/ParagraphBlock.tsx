import type { ParagraphBlock } from "../../types/index";
import { renderRichText } from "@/shared/utils";

interface ParagraphBlockProps {
    block: ParagraphBlock;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {

    return <p key={block.id}>{renderRichText(block.content.paragraph)}</p>;
};
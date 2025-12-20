import { Paragraph } from "@/shared/components/Paragraph/Paragraph";
import type { ParagraphBlock } from "../../types/index";

interface ParagraphBlockProps {
    block: ParagraphBlock;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
    return (
        <Paragraph
            text={block.content.paragraph}
            align={block.content.align}
            key={block.id}
        />
    );
}
import type { QuoteBlock } from "../../types/index";
import { Quote } from "@/shared/components";

interface QuoteBlockProps {
    block: QuoteBlock;
}

export function QuoteBlock({ block }: QuoteBlockProps) {
    return <Quote text={block.content.text} author={block.content.author} />;
};
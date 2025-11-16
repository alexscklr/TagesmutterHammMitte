import type { QuoteBlock } from "../../types/index";
import { renderRichText } from "@/shared/utils";

interface QuoteBlockProps {
    block: QuoteBlock;
}

export function QuoteBlock({ block }: QuoteBlockProps) {

    return (
        <blockquote key={block.id}>
            {renderRichText(block.content.text)}
            {block.content.author && <footer>{block.content.author}</footer>}
        </blockquote>
    );
};
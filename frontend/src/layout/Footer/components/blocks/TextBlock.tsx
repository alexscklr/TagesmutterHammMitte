import type { TextBlock } from "../../types";

interface TextBlockProps {
    block: TextBlock;
}

export function TextBlock({ block }: TextBlockProps) {
    return (
        <>
            {block.content.text}
        </>
    );
}
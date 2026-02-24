import type { HeadingBlock } from "../../types/index";
import { Heading } from "@/shared/components/Heading/Heading";

interface HeadingBlockProps {
    block: HeadingBlock;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
    if (!block.content.level || !block.content.text) return <></>

    return <Heading title={block.content.text} level={block.content.level} />;
};
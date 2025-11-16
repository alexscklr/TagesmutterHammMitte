import type { TitleBlock } from "../../types/index";
import { Heading } from "@/shared/components/Heading/Heading";

interface TitleBlockProps {
    block: TitleBlock;
}

export function TitleBlock({ block }: TitleBlockProps) {
    
    return <Heading title={block.content.title} level={1} />;
};
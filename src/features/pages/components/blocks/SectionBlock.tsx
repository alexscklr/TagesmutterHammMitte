import type { SectionBlock } from "../../types/index";
import { Section } from "@/shared/components/Section/Section";

interface SectionBlockProps {
    block: SectionBlock;
}

export function SectionBlock({ block }: SectionBlockProps) {

    return (
        <Section id={block.id} heading_level={block.content.heading.level} heading_text={block.content.heading.text} content={block.content.content}/>
    );
};


import React from "react";
import type { SectionBlock } from "../../types/index";
import { SectionAppearance } from "../../types/blocks/Section";
import { Section } from "@/shared/components/Section/Section";
import styles from "@/shared/components/Section/Section.module.css";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import { AddBlockButton } from "../AddBlockButton";
import { renderPageBlock } from "../index";

interface SectionBlockProps {
    block: SectionBlock;
}

export function SectionBlock({ block }: SectionBlockProps) {
    const { isEditing } = useEditMode();
    const appearance = block.content.appearance ?? SectionAppearance.Card;
    const appearanceClass = appearance === SectionAppearance.Flat ? styles.flat : styles.card;

    if (!isEditing) {
        return (
            <Section
                id={block.id}
                heading_level={block.content.heading.level}
                heading_text={block.content.heading.text}
                content={block.content.content}
                appearance={appearance}
            />
        );
    }

    const children = block.content.content ?? [];

    return (
        <section
            id={block.id}
            aria-labelledby={`section-heading-${block.id}`}
            className={`${styles.section} ${appearanceClass}`}
        >
            {block.content.heading?.text && block.content.heading?.level &&
                React.createElement(
                    `h${block.content.heading.level}` as any,
                    { id: `section-heading-${block.id}` },
                    block.content.heading.text
                )}

            {/* Insert button before first child */}
            <AddBlockButton order={0} parentBlockId={block.id} />

            {children.map((child) => (
                <React.Fragment key={child.id}>
                    <div style={{ position: "relative" }}>
                        {renderPageBlock(child)}
                    </div>
                    <AddBlockButton order={child.order + 1} parentBlockId={block.id} />
                </React.Fragment>
            ))}
        </section>
    );
};


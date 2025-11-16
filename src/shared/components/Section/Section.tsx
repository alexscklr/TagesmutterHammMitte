import { renderPageBlock } from "@/features/pages/components";
import type { PageBlock } from "@/features/pages/types";
import React from "react";
import styles from "./Section.module.css";


export interface SectionProps {
    id: string;
    heading_level: number;
    heading_text: string;
    content: PageBlock[];
}

export const Section = (props : SectionProps) => {


    return (
        <section
            id={props.id}
            aria-labelledby={`section-heading-${props.id}`}
            className={styles.section}
        >
            {props.heading_text && props.heading_level &&
                React.createElement(
                    `h${props.heading_level}`,
                    { id: `section-heading-${props.id}` },
                    props.heading_text
                )}
            {props.content.map(renderPageBlock)}
        </section>
    )
}
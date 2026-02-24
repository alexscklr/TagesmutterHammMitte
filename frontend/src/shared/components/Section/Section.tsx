import { SectionAppearance } from "@/features/pages/types/blocks/Section";
import React, { type ReactNode } from "react";
import styles from "./Section.module.css";


export interface SectionProps {
    id: string;
    heading_level: number;
    heading_text: string;
    children: ReactNode;
    appearance?: SectionAppearance;
}

export const Section = (props : SectionProps) => {
    const appearance = props.appearance ?? SectionAppearance.Card;
    const appearanceClass = appearance === SectionAppearance.Flat ? styles.flat : styles.card;

    return (
        <section
            id={props.id}
            aria-labelledby={`section-heading-${props.id}`}
            className={`${styles.section} ${appearanceClass}`}
        >
            {props.heading_text && props.heading_level &&
                React.createElement(
                    `h${props.heading_level}`,
                    { id: `section-heading-${props.id}` },
                    props.heading_text
                )}
            {props.children}
        </section>
    )
}
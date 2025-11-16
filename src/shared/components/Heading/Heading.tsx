import type { JSX } from "react";
import styles from "./Heading.module.css"


interface HeadingProps {
    title: string;
    level: 1 | 2 | 3 | 4;
}

export const Heading = (props: HeadingProps) => {
    const HeadingTag = `h${props.level}` as keyof JSX.IntrinsicElements;


    return (
        <HeadingTag className={styles.heading}>{props.title}</HeadingTag>
    )
}
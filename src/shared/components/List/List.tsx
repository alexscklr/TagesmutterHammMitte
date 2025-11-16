// ...existing code...
import styles from "./List.module.css";
import type { ReactNode } from "react";

interface ListProps {
  content: ReactNode[];
  listStyle?:
    | "disc" | "circle" | "square"
    | "decimal" | "lower-alpha" | "upper-alpha"
    | "lower-roman" | "upper-roman" | "none";
  ordered?: boolean;
}

export function List({ content, listStyle, ordered }: ListProps) {
  if (ordered) {
    return (
      <ol className={styles.ol} style={{ listStyleType: listStyle }}>
        {content.map((item, idx) => (
          <li key={`ordered-${idx}`}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={styles.ul} style={{ listStyleType: listStyle}}>
      {content.map((item, idx) => (
        <li key={`unordered-${idx}`}>{item}</li>
      ))}
    </ul>
  );
}
// ...existing code...
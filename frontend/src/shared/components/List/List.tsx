// ...existing code...
import styles from "./List.module.css";
import type { ReactNode, CSSProperties } from "react";

interface ListProps {
  children: ReactNode;
  listStyle?:
    | "disc" | "circle" | "square"
    | "decimal" | "lower-alpha" | "upper-alpha"
    | "lower-roman" | "upper-roman" | "none";
  ordered?: boolean;
  margin?: "left" | "center" | "right";
  width?: "full" | "default";
  style?: CSSProperties;
}

export function List({ children, listStyle, ordered, margin, width, style }: ListProps) {
  const withMarkers = listStyle && listStyle !== "none";

  const marginStyle = margin === "left" ? { marginLeft: 0 }
    : margin === "center" ? { marginLeft: "auto", marginRight: "auto" }
      : margin === "right" ? { marginRight: 0 }
        : {};
  
  const widthStyle = width === "full" ? { width: "100%" }
    : width === "default" ? { width: "80%" } : {};

  const baseStyle = { listStyleType: listStyle, ...marginStyle, ...widthStyle, ...style };

  if (ordered) {
    return (
      <ol className={`${styles.ol} ${withMarkers ? styles.withMarkers : ""}`} style={baseStyle}>
        {children}
      </ol>
    );
  }

  return (
    <ul className={`${styles.ul} ${withMarkers ? styles.withMarkers : ""}`} style={baseStyle}>
      {children}
    </ul>
  );
}
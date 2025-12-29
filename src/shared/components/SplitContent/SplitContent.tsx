import React, { type ReactNode } from "react";
import styles from "./SplitContent.module.css";

export interface SplitContentProps {
  firstItemWidth?: number; // Percentage width for first item (default: 50)
  children: [ReactNode, ReactNode]; // Exactly 2 children
}

export const SplitContent: React.FC<SplitContentProps> = ({ 
  firstItemWidth = 50, 
  children 
}) => {
  return (
    <div 
      className={styles.splitContainer}
      style={{
        "--first-item-width": `${firstItemWidth}%`
      } as React.CSSProperties}
    >
      <div className={styles.splitItem}>
        {children[0]}
      </div>
      <div className={styles.splitItem}>
        {children[1]}
      </div>
    </div>
  );
};

export default SplitContent;

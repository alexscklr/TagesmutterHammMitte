import { useEffect, useRef, useState } from "react";
import styles from "./Timeline.module.css";
import type { TimelineEntry } from "@/features/pages/types/blocks";
import { renderPageBlock } from "@/features/pages/components";
import React from "react";

export interface TimelineProps {
  data?: TimelineEntry[];
  children?: React.ReactNode;
}

export const TimelineItem = ({
  label,
  title,
  children,
  className,
  isActive = false,
  isAdjacent = false,
  ...props
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  isAdjacent?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`${styles.timelineItem} ${isActive
        ? styles.active
        : isAdjacent
          ? styles.adjacent
          : styles.inactive
        } ${className || ""}`}
      {...props}
    >
      <div className={styles.content}>
        <div className={`${styles.timeBox}`}>
          {label}
        </div>
        <h3>{title}</h3>

        <div className={styles.timelineEntryContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Timeline = ({ data, children }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    if (!containerRef.current) return;
    
    const options = {
      root: null, // viewport
      rootMargin: '-45% 0px -45% 0px', // Trigger when element is near the middle (45-55% range)
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          // Only update if changed to avoid unnecessary re-renders
          setActiveIndex((prev) => (prev !== index ? index : prev));
        }
      });
    }, options);

    const childElements = Array.from(containerRef.current.children);
    // Observe all timelineItems (excluding the line div at the end if it's a child)
    childElements.forEach((child, index) => {
        if (child.classList.contains(styles.timelineItem)) {
            (child as HTMLElement).dataset.index = index.toString();
            observer.observe(child);
        }
    });

    return () => observer.disconnect();
  }, [data, children]);
  
  const checkCurrent = (entry: TimelineEntry) => {
      const now = new Date();
      if (entry.timeSpan) {
        const [[hours1, minutes1], [hours2, minutes2]] = [
          entry.timeSpan[0].split(":").map(Number),
          entry.timeSpan[1].split(":").map(Number),
        ];
        const start = new Date(); start.setHours(hours1, minutes1, 0, 0);
        const end = new Date(); end.setHours(hours2, minutes2, 0, 0);
        return now >= start && now < end;
      }
      const currentYear = now.getFullYear();
      if (typeof entry.year === "number") return currentYear === entry.year;
      if (entry.yearSpan && entry.yearSpan.length === 2) {
        const [from, to] = entry.yearSpan;
        return currentYear >= from && currentYear <= to;
      }
      return false;
  }

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      {/* Render Data if provided */}
      {data && data.map((item, index) => (
        <div
          key={index}
          className={`${styles.timelineItem} ${index === activeIndex
            ? styles.active
            : index === activeIndex - 1 || index === activeIndex + 1
              ? styles.adjacent
              : styles.inactive
            }`}
        >
          <div className={styles.content}>
            <div
              className={`${styles.timeBox} ${checkCurrent(item) ? styles.current : ""}`}
            >
              {item.label}
            </div>
            <h3>{item.title}</h3>

            <div className={styles.timelineEntryContent}>
              {item.content.map((block, i) => (
                <React.Fragment key={i}>{renderPageBlock(block, false)}</React.Fragment>
              ))}
            </div>

          </div>
        </div>
      ))}
      
      {/* Render Children if provided (Edit Mode usually) */}
      {!data && children && React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
             const isActive = index === activeIndex;
             const isAdjacent = index === activeIndex - 1 || index === activeIndex + 1;
             
             return React.cloneElement(child as React.ReactElement<any>, { 
                 isActive,
                 isAdjacent
             });
          }
          return child;
      })}

      <div className={styles.timelineLine} />
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import styles from "./Timeline.module.css";
import type { TimelineEntry } from "@/features/pages/types/blocks";
import { renderPageBlock } from "@/features/pages/components";
import React from "react";

export interface TimelineProps {
  data: TimelineEntry[];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      const items = Array.from(containerRef.current!.children);
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();

        let distance: number;
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          // Das Element schneidet die Mitte des Viewports
          distance = 0;
        } else {
          distance = Math.min(
            Math.abs(rect.top - viewportCenter),
            Math.abs(rect.bottom - viewportCenter)
          );
        }

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial beim Laden berechnen

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  const checkIfInCurrent = (entry: TimelineEntry) => {
    const now = new Date();
    // Clock time within today
    if (entry.timeSpan) {
      const [[hours1, minutes1], [hours2, minutes2]] = [
        entry.timeSpan[0].split(":").map(Number),
        entry.timeSpan[1].split(":").map(Number),
      ];

      const start = new Date();
      start.setHours(hours1, minutes1, 0, 0);

      const end = new Date();
      end.setHours(hours2, minutes2, 0, 0);

      return now >= start && now < end;
    }

    const currentYear = now.getFullYear();
    // Exact year match
    if (typeof entry.year === "number") {
      return currentYear === entry.year;
    }
    // Year range match (inclusive)
    if (entry.yearSpan && entry.yearSpan.length === 2) {
      const [from, to] = entry.yearSpan;
      return currentYear >= from && currentYear <= to;
    }
    return false;
  };

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      {data.map((item, index) => (
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
              className={`${styles.timeBox} ${checkIfInCurrent(item) ? styles.current : ""}`}
            >
              {item.label}
            </div>
            <h3>{item.title}</h3>

            <div className={styles.timelineEntryContent}>
              {item.content.map((block, i) => (
                <React.Fragment key={i}>{renderPageBlock(block)}</React.Fragment>
              ))}
            </div>

          </div>
        </div>
      ))}
      <div className={styles.timelineLine} />
    </div>
  );
};

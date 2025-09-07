import { useEffect, useRef, useState } from "react";
import "./Timeline.css";
import type { TimelineEntry } from "@/features/pageBlocks/types"
import { renderRichText } from "../pageBlocks/utils/renderRichText";

export interface TimelineProps {
  data: TimelineEntry[];
}


export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkIfInCurrent = (timeSpan: [string, string] | undefined) => {
    if (timeSpan === undefined) { return false; }

    const now = new Date();
    const [[hours1, minutes1], [hours2, minutes2]] = [timeSpan[0].split(":").map(Number), timeSpan[1].split(":").map(Number)];

    const target1 = new Date();
    target1.setHours(hours1);
    target1.setMinutes(minutes1);

    const target2 = new Date();
    target2.setHours(hours2);
    target2.setMinutes(minutes2);

    const isPast1: boolean = (now >= target1);
    const isBefore2: boolean = (now < target2);

    return (isPast1) && (isBefore2);
  }


  useEffect(() => {
    if (!containerRef.current) return;

    const items = Array.from(containerRef.current.children);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = items.indexOf(entry.target);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.8 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [data]);

  
  return (
    <div className="timeline-container" ref={containerRef}>
      {data.map((item, index) => (
        <div
          key={index}
          className={`timeline-item ${index === activeIndex
            ? "active"
            : index === activeIndex - 1 || index === activeIndex + 1
              ? "adjacent"
              : "inactive"
            }`}
        >
          <div className="content">
            <div className={`time-box ${checkIfInCurrent(item.timeSpan) ? "current" : ""}`}>{item.label}</div>
            <h3>{item.title}</h3>
            <div className="description">{renderRichText(item.description)}</div>
            {item.image_urls && item.image_urls.length >= 0 && (
              <div style={{ display: "flex" }}>
                {item.image_urls.length == 1 && (<img src={item.image_urls[0]} width="61%" />)}
                {item.image_urls.length == 2 && (
                  <>
                    <img src={item.image_urls[0]} width="39%" style={{ margin: "2%" }} />
                    <img src={item.image_urls[1]} width="39%" style={{ margin: "2%" }} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="timeline-line" />
    </div>
  );
};
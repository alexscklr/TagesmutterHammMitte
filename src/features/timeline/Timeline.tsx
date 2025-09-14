import { useEffect, useRef, useState } from "react";
import "./Timeline.css";
import type { TimelineEntry } from "@/features/pages/types/types";
import { renderRichText } from "../pages/utils/renderRichText";

export interface TimelineProps {
  data: TimelineEntry[];
}

export const Timeline = ({ data }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkIfInCurrent = (timeSpan: [string, string] | undefined) => {
    if (!timeSpan) return false;

    const now = new Date();
    const [[hours1, minutes1], [hours2, minutes2]] = [
      timeSpan[0].split(":").map(Number),
      timeSpan[1].split(":").map(Number),
    ];

    const target1 = new Date();
    target1.setHours(hours1, minutes1, 0, 0);

    const target2 = new Date();
    target2.setHours(hours2, minutes2, 0, 0);

    return now >= target1 && now < target2;
  };

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
            <div
              className={`time-box ${checkIfInCurrent(item.timeSpan) ? "current" : ""
                }`}
            >
              {item.label}
            </div>
            <h3>{item.title}</h3>
            <p className="description">
              {renderRichText(item.description)}
            </p>
            {item.images && item.images.length == 1 && (
              <div className="single-image-container">
                <img src={item.images[0].url} alt={item.images[0].alt} />
              </div>
            )}
            {item.images && item.images.length >= 2 && (
              <div className="double-image-container">
                <img src={item.images[0].url} alt={item.images[0].alt} />
                <img src={item.images[1].url} alt={item.images[1].alt} />
              </div>
            )}
            
          </div>
        </div>
      ))}
      <div className="timeline-line" />
    </div>
  );
};

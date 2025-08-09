import React, { useEffect, useRef, useState } from "react";
import "./Timeline.css";

export interface TimelineItem {
  time: string;
  title: string;
  description: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineItem[];
}


export const Timeline = ({ data } : TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const children = Array.from(containerRef.current.children);
      const centerY = window.innerHeight / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - childCenter);

        if (distance < minDistance) {
          closestIndex = index;
          minDistance = distance;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="timeline-container" ref={containerRef}>
      {data.map((item, index) => (
        <div
          key={index}
          className={`timeline-item ${
            index === activeIndex
              ? "active"
              : index === activeIndex - 1 || index === activeIndex + 1
              ? "adjacent"
              : "inactive"
          }`}
        >
          <div className="content">
            <div className="time-box">{item.time}</div>
            <h3>{item.title}</h3>
            <div className="description">{item.description}</div>
          </div>
        </div>
      ))}
      <div className="timeline-line" />
    </div>
  );
};
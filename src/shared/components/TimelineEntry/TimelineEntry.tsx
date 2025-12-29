import React, { type ReactNode } from "react";

export interface TimelineEntryProps {
  label: string;
  title: string;
  children: ReactNode;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ label, title, children }) => {
  return (
    <div className="timeline-entry">
      <div className="time-box">{label}</div>
      <h3>{title}</h3>
      <div className="timeline-entry-content">
        {children}
      </div>
    </div>
  );
};

export default TimelineEntry;

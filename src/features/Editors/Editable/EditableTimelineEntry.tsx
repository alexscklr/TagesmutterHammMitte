import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { TimelineEntry } from "@/features/pages/types/blocks";

export interface EditableTimelineEntryProps {
  value: TimelineEntry;
  onChange: (value: TimelineEntry) => void;
}

const EditableTimelineEntry: React.FC<EditableTimelineEntryProps> = ({ value, onChange }) => {
  const updateField = <K extends keyof TimelineEntry>(key: K, val: TimelineEntry[K]) => onChange({ ...value, [key]: val });

  return (
    <div>
      <input
        type="text"
        value={value.label}
        onChange={(e) => updateField("label", e.target.value)}
        placeholder="Label (z.B. 08:00–10:00 oder 2019)"
        style={{ width: "100%", padding: "0.5em" }}
      />
      <input
        type="text"
        value={value.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Titel"
        style={{ width: "100%", padding: "0.5em", marginTop: "0.5em" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5em", marginTop: "0.5em" }}>
        <input
          type="text"
          placeholder="Startzeit (HH:MM)"
          value={value.timeSpan?.[0] ?? ""}
          onChange={(e) => updateField("timeSpan", [e.target.value, value.timeSpan?.[1] ?? ""]) }
        />
        <input
          type="text"
          placeholder="Endzeit (HH:MM)"
          value={value.timeSpan?.[1] ?? ""}
          onChange={(e) => updateField("timeSpan", [value.timeSpan?.[0] ?? "", e.target.value]) }
        />
        <input
          type="number"
          placeholder="Jahr"
          value={value.year ?? ""}
          onChange={(e) => updateField("year", e.target.value === "" ? undefined : Number(e.target.value)) }
        />
        <input
          type="text"
          placeholder="Jahres-Spanne (von, bis)"
          value={value.yearSpan ? `${value.yearSpan[0]}` : ""}
          onChange={(e) => updateField("yearSpan", [Number(e.target.value || 0), value.yearSpan?.[1] ?? 0]) }
        />
        <input
          type="text"
          placeholder="Jahres-Spanne (bis)"
          value={value.yearSpan ? `${value.yearSpan[1]}` : ""}
          onChange={(e) => updateField("yearSpan", [value.yearSpan?.[0] ?? 0, Number(e.target.value || 0)]) }
        />
      </div>
      {/* Editing of child content blocks would be handled by an editor list UI elsewhere */}
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableTimelineEntry;

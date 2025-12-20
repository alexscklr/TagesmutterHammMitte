import React from "react";
import type { IBouncyText } from "@/features/pages/types/blocks";

export interface EditableBouncyTextProps {
  value: IBouncyText;
  onChange: (value: IBouncyText) => void;
}

const EditableBouncyText: React.FC<EditableBouncyTextProps> = ({ value, onChange }) => {
  const handleNumber = (key: keyof IBouncyText) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = raw === "" ? undefined : Number(raw);
    onChange({ ...value, [key]: num } as IBouncyText);
  };

  return (
    <div>
      <input
        type="text"
        value={value.text}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="Text"
        style={{ width: "100%", padding: "0.5em" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5em", marginTop: "0.5em" }}>
        <input type="number" placeholder="Amplitude" value={value.amplitude ?? ""} onChange={handleNumber("amplitude")} />
        <input type="number" placeholder="Dauer" value={value.duration ?? ""} onChange={handleNumber("duration")} />
        <input type="number" placeholder="Pause-Dauer" value={value.pauseDuration ?? ""} onChange={handleNumber("pauseDuration")} />
        <input type="number" placeholder="Zeichen-Verzögerung" value={value.characterDelay ?? ""} onChange={handleNumber("characterDelay")} />
        <input type="number" placeholder="Frequenz" value={value.frequency ?? ""} onChange={handleNumber("frequency")} />
      </div>
    </div>
  );
};

export default EditableBouncyText;

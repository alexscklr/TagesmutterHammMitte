import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { Imagery } from "@/features/pages/types/blocks";
import type { Image } from "@/shared/types/Image";
import { listImages } from "@/features/media/lib/storage";

export interface EditableImageryProps {
  value: Imagery;
  onChange: (value: Imagery) => void;
}

const EditableImagery: React.FC<EditableImageryProps> = ({ value, onChange }) => {
  const updateImage = (index: number, field: "url"|"alt"|"source"|"sourceUrl"|"license", val: string) => {
    const images: Image[] = value.images.slice();
    images[index] = { ...images[index], [field]: val };
    onChange({ ...value, images });
  };

  const updateWidth = (index: number, val: string) => {
    const width = val === "" ? undefined : Number(val);
    const images: Image[] = value.images.slice();
    images[index] = { ...images[index], width };
    onChange({ ...value, images });
  };

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [files, setFiles] = React.useState<{ name: string }[]>([]);
  const [pickIndex, setPickIndex] = React.useState<number | null>(null);

  const openPicker = async (index: number) => {
    setPickIndex(index);
    setPickerOpen(true);
    const items = await listImages("");
    setFiles(items.map(i => ({ name: i.name })));
  };

  const chooseFile = (name: string) => {
    if (pickIndex == null) return;
    const images: Image[] = value.images.slice();
    images[pickIndex] = { ...images[pickIndex], url: name };
    onChange({ ...value, images });
    setPickerOpen(false);
    setPickIndex(null);
  };

  return (
    <>
    <div>
      {value.images.map((img, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5em", marginBottom: "0.5em" }}>
          <input type="text" placeholder="URL" value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)} />
          <button type="button" onClick={() => openPicker(i)}>Bild wählen</button>
          <input type="text" placeholder="Alt" value={img.alt ?? ""} onChange={(e) => updateImage(i, "alt", e.target.value)} />
          <input type="number" placeholder="Breite (px)" value={img.width ?? ""} onChange={(e) => updateWidth(i, e.target.value)} />
          <input type="text" placeholder="Quelle (Name)" value={img.source ?? ""} onChange={(e) => updateImage(i, "source", e.target.value)} />
          <input type="text" placeholder="Quelle URL" value={img.sourceUrl ?? ""} onChange={(e) => updateImage(i, "sourceUrl", e.target.value)} />
          <input type="text" placeholder="Lizenz" value={img.license ?? ""} onChange={(e) => updateImage(i, "license", e.target.value)} />
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...value, images: [...value.images, { url: "", alt: "" }] as Image[] })}
      >
        Bild hinzufügen
      </button>
    </div>
    {pickerOpen && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "grid", placeItems: "center" }}>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: "0.5rem", maxWidth: 700, width: "90%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" }}>
            <strong>Bild wählen</strong>
            <button onClick={() => { setPickerOpen(false); setPickIndex(null); }}>Schließen</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: ".5rem" }}>
            {files.map(f => (
              <button key={f.name} onClick={() => chooseFile(f.name)} style={{ border: "1px solid #ddd", borderRadius: ".5rem", padding: ".5rem", textAlign: "left" }}>
                <div style={{ fontSize: ".8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default EditableImagery;

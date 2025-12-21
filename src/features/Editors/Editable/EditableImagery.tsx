import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { Imagery } from "@/features/pages/types/blocks";
import type { Image } from "@/shared/types/Image";
import { listImages } from "@/features/media/lib/storage";
import { supabase } from "@/supabaseClient";

export interface EditableImageryProps {
  value: Imagery;
  onChange: (value: Imagery) => void;
}

const EditableImagery: React.FC<EditableImageryProps> = ({ value, onChange }) => {
  const updateImage = (index: number, field: "alt"|"source"|"sourceUrl"|"license", val: string) => {
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
  const [files, setFiles] = React.useState<{ name: string; url: string }[]>([]);
  const [pickIndex, setPickIndex] = React.useState<number | null>(null);

  const openPicker = async (index: number) => {
    setPickIndex(index);
    setPickerOpen(true);
    const items = await listImages("");
    // Get public URLs for all images
    const filesWithUrls = items.map(i => {
      const { data } = supabase.storage.from("public_images").getPublicUrl(i.name);
      return { name: i.name, url: data.publicUrl };
    });
    setFiles(filesWithUrls);
  };

  const chooseFile = (name: string) => {
    if (pickIndex == null) return;
    const images: Image[] = value.images.slice();
    images[pickIndex] = { ...images[pickIndex], url: name };
    onChange({ ...value, images });
    setPickerOpen(false);
    setPickIndex(null);
  };

  const removeImage = (index: number) => {
    const images = value.images.filter((_, i) => i !== index);
    onChange({ ...value, images });
  };

  const getImagePreviewUrl = (imageName: string) => {
    const { data } = supabase.storage.from("public_images").getPublicUrl(imageName);
    return data.publicUrl;
  };

  return (
    <>
    <div>
      {value.images.map((img, i) => (
        <div key={i} style={{ 
          border: "1px solid #ddd", 
          borderRadius: "0.5rem", 
          padding: "1rem", 
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9"
        }}>
          {/* Image Preview and Selection */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
            {img.url && (
              <img 
                src={getImagePreviewUrl(img.url)} 
                alt={img.alt || "Preview"} 
                style={{ 
                  width: "150px", 
                  height: "150px", 
                  objectFit: "cover", 
                  borderRadius: "0.4rem",
                  border: "2px solid #ccc"
                }} 
              />
            )}
            <div style={{ flex: 1 }}>
              <button 
                type="button" 
                onClick={() => openPicker(i)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.4rem",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  width: "100%"
                }}
              >
                {img.url ? "Bild ändern" : "Bild auswählen"}
              </button>
              {img.url && (
                <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                  Ausgewählt: {img.url}
                </div>
              )}
            </div>
          </div>

          {/* Image Metadata */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
            <input 
              type="text" 
              placeholder="Alt-Text" 
              value={img.alt ?? ""} 
              onChange={(e) => updateImage(i, "alt", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
            />
            <input 
              type="number" 
              placeholder="Breite (px)" 
              value={img.width ?? ""} 
              onChange={(e) => updateWidth(i, e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
            />
            <input 
              type="text" 
              placeholder="Quelle (Name)" 
              value={img.source ?? ""} 
              onChange={(e) => updateImage(i, "source", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
            />
            <input 
              type="text" 
              placeholder="Quelle URL" 
              value={img.sourceUrl ?? ""} 
              onChange={(e) => updateImage(i, "sourceUrl", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
            />
            <input 
              type="text" 
              placeholder="Lizenz" 
              value={img.license ?? ""} 
              onChange={(e) => updateImage(i, "license", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc", gridColumn: "span 2" }}
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeImage(i)}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 0.8rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
              fontSize: "0.85rem"
            }}
          >
            Bild entfernen
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => onChange({ ...value, images: [...value.images, { url: "", alt: "" }] as Image[] })}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "0.4rem",
          cursor: "pointer",
          marginBottom: "0.5rem"
        }}
      >
        + Bild hinzufügen
      </button>

      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>

    {pickerOpen && (
      <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.6)", 
          display: "grid", 
          placeItems: "center",
          zIndex: 10000
        }}
        onClick={() => { setPickerOpen(false); setPickIndex(null); }}
      >
        <div 
          style={{ 
            background: "#fff", 
            padding: "1.5rem", 
            borderRadius: "0.5rem", 
            maxWidth: "900px", 
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <strong style={{ fontSize: "1.2rem" }}>Bild auswählen</strong>
            <button 
              onClick={() => { setPickerOpen(false); setPickIndex(null); }}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer"
              }}
            >
              Schließen
            </button>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "1rem" 
          }}>
            {files.map(f => (
              <button 
                key={f.name} 
                onClick={() => chooseFile(f.name)} 
                style={{ 
                  border: "2px solid #ddd", 
                  borderRadius: "0.5rem", 
                  padding: "0.5rem", 
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img 
                  src={f.url} 
                  alt={f.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "0.3rem",
                    marginBottom: "0.5rem"
                  }}
                />
                <div style={{ 
                  fontSize: "0.85rem", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap",
                  color: "#333"
                }}>
                  {f.name}
                </div>
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

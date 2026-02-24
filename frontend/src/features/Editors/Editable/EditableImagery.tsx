import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { Imagery } from "@/features/pages/types/blocks";
import { listImages } from "@/features/media/lib/storage";
import { supabase } from "@/supabaseClient";
import { createPortal } from "react-dom";

export interface EditableImageryProps {
  value: Imagery;
  onChange: (value: Imagery) => void;
}

const EditableImagery: React.FC<EditableImageryProps> = ({ value, onChange }) => {
  // Ensure we always have exactly one image
  const img = value.images[0] || { url: "", alt: "" };

  const updateImage = (field: "alt"|"source"|"sourceUrl"|"license", val: string) => {
    const updatedImage = { ...img, [field]: val };
    onChange({ ...value, images: [updatedImage] });
  };

  const updateWidth = (val: string) => {
    const width = val === "" ? undefined : Number(val);
    const updatedImage = { ...img, width };
    onChange({ ...value, images: [updatedImage] });
  };

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [files, setFiles] = React.useState<{ name: string; url: string }[]>([]);

  const openPicker = async () => {
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
    const updatedImage = { ...img, url: name };
    onChange({ ...value, images: [updatedImage] });
    setPickerOpen(false);
  };

  const getImagePreviewUrl = (imageName: string) => {
    const { data } = supabase.storage.from("public_images").getPublicUrl(imageName);
    return data.publicUrl;
  };

  return (
    <>
    <div>
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "0.5rem", 
        padding: "1rem", 
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
              onClick={openPicker}
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
            onChange={(e) => updateImage("alt", e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
          />
          <input 
            type="number" 
            placeholder="Breite (%)" 
            min="1"
            max="100"
            value={img.width ?? ""} 
            onChange={(e) => updateWidth(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
          />
          <input 
            type="text" 
            placeholder="Quelle (Name)" 
            value={img.source ?? ""} 
            onChange={(e) => updateImage("source", e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
          />
          <input 
            type="text" 
            placeholder="Quelle URL" 
            value={img.sourceUrl ?? ""} 
            onChange={(e) => updateImage("sourceUrl", e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }}
          />
          <input 
            type="text" 
            placeholder="Lizenz" 
            value={img.license ?? ""} 
            onChange={(e) => updateImage("license", e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc", gridColumn: "span 2" }}
          />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <SaveBlockButton />
      </div>
    </div>

    {pickerOpen && createPortal(
      <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.6)", 
          display: "grid", 
          placeItems: "center",
          zIndex: 10000
        }}
        onClick={() => setPickerOpen(false)}
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
              onClick={() => setPickerOpen(false)}
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
      </div>,
      document.body
    )}
    </>
  );
};

export default EditableImagery;

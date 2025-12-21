import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import styles from "./PageAdmin.module.css";
import { listImages } from "@/features/media/lib/storage";

interface GradientStop {
  color: string;
}

interface Gradient {
  stops: GradientStop[];
  direction: string;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  sitetitle: string;
  created_at: string;
  background: {
    gradient?: Gradient;
    image_url?: string;
  } | null;
}

const gradientToCss = (gradient?: Gradient): string => {
  if (!gradient || !gradient.stops || gradient.stops.length === 0) return "";
  const colors = gradient.stops.map(stop => stop.color).join(", ");
  return `linear-gradient(${gradient.direction || "0deg"}, ${colors})`;
};

const PageAdmin: React.FC = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageData>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<{ name: string; url: string }[]>([]);

  const loadPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setPages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Seiten");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const startEdit = (page: PageData) => {
    setEditingId(page.id);
    setFormData(page);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      slug: "",
      title: "",
      sitetitle: "",
      background: { 
        gradient: { stops: [{ color: "#FAF4DC" }, { color: "#B4BEDC" }], direction: "0deg" }, 
        image_url: "" 
      },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const savePage = async () => {
    try {
      if (isCreating) {
        const { error: insertError } = await supabase
          .from("pages")
          .insert([{
            slug: formData.slug,
            title: formData.title,
            sitetitle: formData.sitetitle,
            background: formData.background || null,
          }]);

        if (insertError) throw insertError;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from("pages")
          .update({
            slug: formData.slug,
            title: formData.title,
            sitetitle: formData.sitetitle,
            background: formData.background || null,
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
      }

      await loadPages();
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Möchten Sie diese Seite wirklich löschen?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("pages")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      await loadPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const updateFormField = (field: keyof PageData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBackground = (field: "image_url", value: string) => {
    setFormData(prev => ({
      ...prev,
      background: {
        ...prev.background,
        [field]: value,
      },
    }));
  };

  const updateGradientStop = (index: number, color: string) => {
    setFormData(prev => {
      const currentStops = prev.background?.gradient?.stops || [];
      const newStops = [...currentStops];
      newStops[index] = { color };
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: newStops,
            direction: prev.background?.gradient?.direction || "0deg",
          },
        },
      };
    });
  };

  const updateGradientDirection = (direction: string) => {
    setFormData(prev => ({
      ...prev,
      background: {
        ...prev.background,
        gradient: {
          stops: prev.background?.gradient?.stops || [],
          direction,
        },
      },
    }));
  };

  const addGradientStop = () => {
    setFormData(prev => {
      const currentStops = prev.background?.gradient?.stops || [];
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: [...currentStops, { color: "#FFFFFF" }],
            direction: prev.background?.gradient?.direction || "0deg",
          },
        },
      };
    });
  };

  const removeGradientStop = (index: number) => {
    setFormData(prev => {
      const currentStops = prev.background?.gradient?.stops || [];
      if (currentStops.length <= 2) return prev; // Mindestens 2 Stops behalten
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: currentStops.filter((_, i) => i !== index),
            direction: prev.background?.gradient?.direction || "0deg",
          },
        },
      };
    });
  };

  const openImagePicker = async () => {
    setImagePickerOpen(true);
    const items = await listImages("");
    const filesWithUrls = items.map(i => {
      const { data } = supabase.storage.from("public_images").getPublicUrl(i.name);
      return { name: i.name, url: data.publicUrl };
    });
    setAvailableImages(filesWithUrls);
  };

  const selectBackgroundImage = (imageName: string) => {
    updateBackground("image_url", imageName);
    setImagePickerOpen(false);
  };

  const getImagePreviewUrl = (imageName: string) => {
    if (!imageName) return "";
    const { data } = supabase.storage.from("public_images").getPublicUrl(imageName);
    return data.publicUrl;
  };

  if (loading) {
    return <div className={styles.container}>Lädt...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Seitenverwaltung</h1>
        {!isCreating && !editingId && (
          <button onClick={startCreate} className={styles.createButton}>
            + Neue Seite erstellen
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {(isCreating || editingId) ? (
        <div className={styles.editForm}>
          <h2>{isCreating ? "Neue Seite erstellen" : "Seite bearbeiten"}</h2>
          
          <div className={styles.formGroup}>
            <label>Slug (URL)</label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => updateFormField("slug", e.target.value)}
              placeholder="z.B. ueber-uns"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Titel</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => updateFormField("title", e.target.value)}
              placeholder="Seitentitel"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Site-Titel (Browser-Tab)</label>
            <input
              type="text"
              value={formData.sitetitle || ""}
              onChange={(e) => updateFormField("sitetitle", e.target.value)}
              placeholder="Titel für Browser-Tab"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Hintergrund - Gradient</label>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--color-neutral-400)" }}>Richtung</label>
              <input
                type="text"
                value={formData.background?.gradient?.direction || "0deg"}
                onChange={(e) => updateGradientDirection(e.target.value)}
                placeholder="z.B. 0deg, 90deg, 180deg"
              />
            </div>
            <label style={{ fontSize: "0.9rem", color: "var(--color-neutral-400)", marginBottom: "0.5rem", display: "block" }}>Farben</label>
            {(formData.background?.gradient?.stops || []).map((stop, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateGradientStop(index, e.target.value)}
                  style={{ width: "60px", height: "40px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateGradientStop(index, e.target.value)}
                  placeholder="#FFFFFF"
                  style={{ flex: 1 }}
                />
                {(formData.background?.gradient?.stops?.length || 0) > 2 && (
                  <button
                    type="button"
                    onClick={() => removeGradientStop(index)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "0.3rem",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGradientStop}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              + Farbe hinzufügen
            </button>
            {formData.background?.gradient && (
              <div
                style={{
                  marginTop: "1rem",
                  height: "60px",
                  borderRadius: "0.4rem",
                  background: gradientToCss(formData.background.gradient),
                  border: "1px solid var(--color-neutral-600)",
                }}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Hintergrund - Bild</label>
            {formData.background?.image_url && (
              <div style={{ marginBottom: "1rem" }}>
                <img 
                  src={getImagePreviewUrl(formData.background.image_url)} 
                  alt="Hintergrundbild Vorschau"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "0.4rem",
                    border: "2px solid var(--color-neutral-600)"
                  }}
                />
                <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-400)", marginTop: "0.5rem" }}>
                  Ausgewählt: {formData.background.image_url}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={openImagePicker}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-accent)",
                color: "white",
                border: "none",
                borderRadius: "0.4rem",
                cursor: "pointer",
                marginRight: "0.5rem"
              }}
            >
              {formData.background?.image_url ? "Bild ändern" : "Bild auswählen"}
            </button>
            {formData.background?.image_url && (
              <button
                type="button"
                onClick={() => updateBackground("image_url", "")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "0.4rem",
                  cursor: "pointer",
                }}
              >
                Bild entfernen
              </button>
            )}
          </div>

          <div className={styles.formActions}>
            <button onClick={savePage} className={styles.saveButton}>
              Speichern
            </button>
            <button onClick={cancelEdit} className={styles.cancelButton}>
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.pageList}>
          <table className={styles.table}>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Titel</th>
              <th>Site-Titel</th>
              <th>Erstellt am</th>
              <th>Hintergrund</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>
                  <code>{page.slug}</code>
                </td>
                <td>{page.title}</td>
                <td>{page.sitetitle}</td>
                <td>{new Date(page.created_at).toLocaleDateString("de-DE")}</td>
                <td>
                  <div className={styles.backgroundPreview}>
                    {page.background?.gradient && (
                      <div className={styles.previewItem}>
                        <span className={styles.label}>Gradient:</span>
                        <div
                          className={styles.gradientPreview}
                          style={{ background: gradientToCss(page.background.gradient) }}
                        />
                      </div>
                    )}
                    {page.background?.image_url && (
                      <div className={styles.previewItem}>
                        <span className={styles.label}>Bild:</span>
                        <span className={styles.imageUrl}>{page.background.image_url}</span>
                      </div>
                    )}
                    {!page.background?.gradient && !page.background?.image_url && (
                      <span className={styles.noBackground}>Kein Hintergrund</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => startEdit(page)}
                      className={styles.editButton}
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className={styles.deleteButton}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {imagePickerOpen && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0.6)", 
            display: "grid", 
            placeItems: "center",
            zIndex: 10000
          }}
          onClick={() => setImagePickerOpen(false)}
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
              <strong style={{ fontSize: "1.2rem", color: "#333" }}>Hintergrundbild auswählen</strong>
              <button 
                onClick={() => setImagePickerOpen(false)}
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
              {availableImages.map(img => (
                <button 
                  key={img.name} 
                  onClick={() => selectBackgroundImage(img.name)} 
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
                    src={img.url} 
                    alt={img.name}
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
                    {img.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageAdmin;

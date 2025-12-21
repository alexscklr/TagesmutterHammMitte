import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { listImages } from "@/features/media/lib/storage";
import styles from "./PageAdmin.module.css";
import { PageList } from "./components/PageList";
import { ImagePickerModal } from "./components/ImagePickerModal";
import type { Gradient, PageData } from "./types";
import { gradientToCss } from "./utils";

const DEFAULT_GRADIENT: Gradient = {
  stops: [{ color: "#FAF4DC" }, { color: "#B4BEDC" }],
  direction: "0deg",
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
        gradient: DEFAULT_GRADIENT,
        image_url: "",
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
          .insert([
            {
              slug: formData.slug,
              title: formData.title,
              sitetitle: formData.sitetitle,
              background: formData.background || null,
            },
          ]);

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
      const { error: deleteError } = await supabase.from("pages").delete().eq("id", id);
      if (deleteError) throw deleteError;
      await loadPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const updateFormField = (field: keyof PageData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBackground = (field: "image_url", value: string) => {
    setFormData(prev => ({
      ...prev,
      background: {
        ...(prev.background || { gradient: DEFAULT_GRADIENT, image_url: "" }),
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
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
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
          stops: prev.background?.gradient?.stops || DEFAULT_GRADIENT.stops,
          direction,
        },
      },
    }));
  };

  const addGradientStop = () => {
    setFormData(prev => {
      const currentStops = prev.background?.gradient?.stops || DEFAULT_GRADIENT.stops;
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: [...currentStops, { color: "#FFFFFF" }],
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
          },
        },
      };
    });
  };

  const removeGradientStop = (index: number) => {
    setFormData(prev => {
      const currentStops = prev.background?.gradient?.stops || [];
      if (currentStops.length <= 2) return prev;
      return {
        ...prev,
        background: {
          ...prev.background,
          gradient: {
            stops: currentStops.filter((_, i) => i !== index),
            direction: prev.background?.gradient?.direction || DEFAULT_GRADIENT.direction,
          },
        },
      };
    });
  };

  const openImagePicker = async () => {
    setImagePickerOpen(true);
    try {
      const items = await listImages("");
      const filesWithUrls = items.map(i => {
        const { data } = supabase.storage.from("public_images").getPublicUrl(i.name);
        return { name: i.name, url: data.publicUrl };
      });
      setAvailableImages(filesWithUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Bilder");
      setImagePickerOpen(false);
    }
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

      {isCreating || editingId ? (
        <div className={styles.editForm}>
          <h2>{isCreating ? "Neue Seite erstellen" : "Seite bearbeiten"}</h2>

          <div className={styles.formGroup}>
            <label>Slug (URL)</label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={e => updateFormField("slug", e.target.value)}
              placeholder="z.B. ueber-uns"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Titel</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={e => updateFormField("title", e.target.value)}
              placeholder="Seitentitel"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Site-Titel (Browser-Tab)</label>
            <input
              type="text"
              value={formData.sitetitle || ""}
              onChange={e => updateFormField("sitetitle", e.target.value)}
              placeholder="Titel für Browser-Tab"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Hintergrund - Gradient</label>
            <div className={styles.gradientControlRow}>
              <label>Richtung</label>
              <input
                type="text"
                value={formData.background?.gradient?.direction || DEFAULT_GRADIENT.direction}
                onChange={e => updateGradientDirection(e.target.value)}
                placeholder="z.B. 0deg, 90deg, 180deg"
              />
            </div>
            <label className={styles.subLabel}>Farben</label>
            {(formData.background?.gradient?.stops || DEFAULT_GRADIENT.stops).map((stop, index) => (
              <div key={index} className={styles.gradientStopRow}>
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => updateGradientStop(index, e.target.value)}
                  className={styles.colorInput}
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={e => updateGradientStop(index, e.target.value)}
                  placeholder="#FFFFFF"
                />
                {(formData.background?.gradient?.stops?.length || DEFAULT_GRADIENT.stops.length) > 2 && (
                  <button type="button" onClick={() => removeGradientStop(index)} className={styles.removeStopButton}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addGradientStop} className={styles.addColorButton}>
              + Farbe hinzufügen
            </button>
            {formData.background?.gradient && (
              <div className={styles.gradientPreviewBox} style={{ background: gradientToCss(formData.background.gradient) }} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Hintergrund - Bild</label>
            {formData.background?.image_url && (
              <div className={styles.imagePreview}>
                <img src={getImagePreviewUrl(formData.background.image_url)} alt="Hintergrundbild Vorschau" />
                <div className={styles.imageMeta}>Ausgewählt: {formData.background.image_url}</div>
              </div>
            )}
            <div className={styles.imageActions}>
              <button type="button" onClick={openImagePicker} className={styles.pickImageButton}>
                {formData.background?.image_url ? "Bild ändern" : "Bild auswählen"}
              </button>
              {formData.background?.image_url && (
                <button type="button" onClick={() => updateBackground("image_url", "")} className={styles.removeImageButton}>
                  Bild entfernen
                </button>
              )}
            </div>
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
        <PageList pages={pages} styles={styles} gradientToCss={gradientToCss} onEdit={startEdit} onDelete={deletePage} />
      )}

      <ImagePickerModal
        open={imagePickerOpen}
        images={availableImages}
        styles={styles}
        onSelect={selectBackgroundImage}
        onClose={() => setImagePickerOpen(false)}
        title="Hintergrundbild auswählen"
      />
    </div>
  );
};

export default PageAdmin;

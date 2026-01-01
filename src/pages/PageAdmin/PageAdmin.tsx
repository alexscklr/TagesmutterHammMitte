import React, { useEffect } from "react";
import styles from "./PageAdmin.module.css";
import { PageList } from "./components/PageList";
import { ImagePickerModal } from "./components/ImagePickerModal";
import { GradientEditor } from "./components/GradientEditor";
import { ColorSpotsEditor } from "./components/ColorSpotsEditor";
import { gradientToCss } from "./utils";
import { usePageManagement } from "./hooks/usePageManagement";
import { useGradientEditor } from "./hooks/useGradientEditor";
import { useColorSpotEditor } from "./hooks/useColorSpotEditor";
import { useImagePicker } from "./hooks/useImagePicker";
import { pageQueries } from "./lib/pageQueries";
import type { PageData } from "./types";

const PageAdmin: React.FC = () => {
  const pageManagement = usePageManagement();
  const gradientEditor = useGradientEditor(pageManagement.formData, pageManagement.setFormData);
  const colorSpotEditor = useColorSpotEditor(pageManagement.formData, pageManagement.setFormData);
  const imagePicker = useImagePicker();

  useEffect(() => {
    const load = async () => {
      pageManagement.setLoading(true);
      pageManagement.setError(null);
      try {
        const data = await pageQueries.loadPages();
        pageManagement.setPages(data);
      } catch (err) {
        pageManagement.setError(
          err instanceof Error ? err.message : "Fehler beim Laden der Seiten"
        );
      } finally {
        pageManagement.setLoading(false);
      }
    };
    load();
  }, []);

  const startEdit = (page: PageData) => {
    pageManagement.setEditingId(page.id);
    pageManagement.setFormData(page);
    pageManagement.setIsCreating(false);
    pageManagement.setError(null);
  };

  const startCreate = () => {
    pageManagement.setIsCreating(true);
    pageManagement.setEditingId(null);
    pageManagement.setFormData({
      slug: "",
      title: "",
      sitetitle: "",
      background: {
        gradient: gradientEditor.DEFAULT_GRADIENT,
        image_url: "",
      },
    });
    pageManagement.setError(null);
  };

  const cancelEdit = () => {
    pageManagement.setEditingId(null);
    pageManagement.setIsCreating(false);
    pageManagement.setFormData({});
    pageManagement.setError(null);
  };

  const savePage = async () => {
    try {
      await pageQueries.savePage(pageManagement.formData, pageManagement.editingId);
      const data = await pageQueries.loadPages();
      pageManagement.setPages(data);
      cancelEdit();
    } catch (err) {
      pageManagement.setError(
        err instanceof Error ? err.message : "Fehler beim Speichern"
      );
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Möchten Sie diese Seite wirklich löschen?")) return;

    try {
      const page = pageManagement.pages.find(p => p.id === id);
      if (page?.is_static) {
        pageManagement.setError("Statische Seiten können nicht gelöscht werden.");
        return;
      }

      await pageQueries.deletePage(id);
      const data = await pageQueries.loadPages();
      pageManagement.setPages(data);
    } catch (err) {
      pageManagement.setError(
        err instanceof Error ? err.message : "Fehler beim Löschen"
      );
    }
  };

  if (pageManagement.loading) {
    return <div className={styles.container}>Lädt...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Seitenverwaltung</h1>
        {!pageManagement.isCreating && !pageManagement.editingId && (
          <button onClick={startCreate} className={styles.createButton}>
            + Neue Seite erstellen
          </button>
        )}
      </div>

      {pageManagement.error && <div className={styles.error}>{pageManagement.error}</div>}

      {pageManagement.isCreating || pageManagement.editingId ? (
        <div className={styles.editForm}>
          <h2>{pageManagement.isCreating ? "Neue Seite erstellen" : "Seite bearbeiten"}</h2>

          <div className={styles.formGroup}>
            <label>
              Slug (URL)
              {pageManagement.formData.is_static && (
                <span className={styles.staticLabel}> (nicht änderbar)</span>
              )}
            </label>
            <input
              type="text"
              value={pageManagement.formData.slug || ""}
              onChange={e => pageManagement.updateFormField("slug", e.target.value)}
              placeholder="z.B. ueber-uns"
              disabled={pageManagement.formData.is_static}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Titel</label>
            <input
              type="text"
              value={pageManagement.formData.title || ""}
              onChange={e => pageManagement.updateFormField("title", e.target.value)}
              placeholder="Seitentitel"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Site-Titel (Browser-Tab)</label>
            <input
              type="text"
              value={pageManagement.formData.sitetitle || ""}
              onChange={e => pageManagement.updateFormField("sitetitle", e.target.value)}
              placeholder="Titel für Browser-Tab"
            />
          </div>

          <GradientEditor
            formData={pageManagement.formData}
            isDraggingWheel={gradientEditor.isDraggingWheel}
            onWheelDrag={gradientEditor.handleWheelDrag}
            onUpdateStop={gradientEditor.updateGradientStop}
            onAddStop={gradientEditor.addGradientStop}
            onRemoveStop={gradientEditor.removeGradientStop}
            defaultGradient={gradientEditor.DEFAULT_GRADIENT}
          />

          <ColorSpotsEditor
            formData={pageManagement.formData}
            onAddSpot={colorSpotEditor.addColorSpot}
            onUpdateSpot={colorSpotEditor.updateColorSpot}
            onRemoveSpot={colorSpotEditor.removeColorSpot}
          />

          <div className={styles.formGroup}>
            <label>Hintergrund - Bild</label>
            {pageManagement.formData.background?.image_url && (
              <div className={styles.imagePreview}>
                <img
                  src={imagePicker.getImagePreviewUrl(pageManagement.formData.background.image_url)}
                  alt="Hintergrundbild Vorschau"
                />
                <div className={styles.imageMeta}>
                  Ausgewählt: {pageManagement.formData.background.image_url}
                </div>
              </div>
            )}
            <div className={styles.imageActions}>
              <button
                type="button"
                onClick={() =>
                  imagePicker.openImagePicker(pageManagement.setError)
                }
                className={styles.pickImageButton}
              >
                {pageManagement.formData.background?.image_url
                  ? "Bild ändern"
                  : "Bild auswählen"}
              </button>
              {pageManagement.formData.background?.image_url && (
                <button
                  type="button"
                  onClick={() => pageManagement.updateBackground("image_url", "")}
                  className={styles.removeImageButton}
                >
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
        <PageList
          pages={pageManagement.pages}
          styles={styles}
          gradientToCss={gradientToCss}
          onEdit={startEdit}
          onDelete={deletePage}
        />
      )}

      <ImagePickerModal
        open={imagePicker.imagePickerOpen}
        images={imagePicker.availableImages}
        styles={styles}
        onSelect={(imageName: string) => {
          pageManagement.updateBackground("image_url", imageName);
          imagePicker.setImagePickerOpen(false);
        }}
        onClose={() => imagePicker.setImagePickerOpen(false)}
        title="Hintergrundbild auswählen"
      />
    </div>
  );
};

export default PageAdmin;

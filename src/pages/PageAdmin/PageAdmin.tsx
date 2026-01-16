import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PageAdmin.module.css";
import { PageList } from "./components/PageList";
import { ImagePickerModal } from "./components/ImagePickerModal";
import { GradientEditor } from "./components/GradientEditor";
import { ColorSpotsEditor } from "./components/ColorSpotsEditor";
import { gradientToCss } from "./utils";
import { backgroundStyleToCSS } from "../../layout/Main/utils/translations";
import { useBackgroundPreview } from "../../layout/Main/context/BackgroundContext";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewStyle, setPreviewStyle] = React.useState<string>("");
  const { setPreviewBackground } = useBackgroundPreview();

  // Live update of the main page background
  useEffect(() => {
    // Only update if we are editing or creating
    if (pageManagement.isCreating || pageManagement.editingId) {
       setPreviewBackground(pageManagement.formData.background as any);
    } else {
       setPreviewBackground(null);
    }

    // Cleanup when component unmounts or we leave edit mode
    return () => setPreviewBackground(null); 
  }, [pageManagement.formData.background, pageManagement.isCreating, pageManagement.editingId, setPreviewBackground]);

  // Sync URL with State
  useEffect(() => {
    if (pageManagement.loading) return;

    const editId = searchParams.get("edit");
    const createMode = searchParams.get("create");

    if (editId) {
      const page = pageManagement.pages.find((p) => p.id === editId);
      if (page) {
        if (pageManagement.editingId !== editId) {
          pageManagement.setEditingId(editId);
          pageManagement.setFormData(JSON.parse(JSON.stringify(page)));
          pageManagement.setIsCreating(false);
          pageManagement.setError(null);
        }
      } else {
        // Page not found (e.g. deleted or invalid ID), return to list
        setSearchParams({});
      }
    } else if (createMode) {
      if (!pageManagement.isCreating) {
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
      }
    } else {
      // List Mode
      if (pageManagement.editingId || pageManagement.isCreating) {
        pageManagement.setEditingId(null);
        pageManagement.setIsCreating(false);
        pageManagement.setFormData({});
        pageManagement.setError(null);
      }
    }
  }, [
    searchParams,
    pageManagement.loading,
    pageManagement.pages,
    pageManagement.editingId,
    pageManagement.isCreating,
    // Note: We deliberately exclude pageManagement methods and gradientEditor.DEFAULT_GRADIENT 
    // to avoid unnecessary re-runs, assuming they are stable or don't change meaningfully.
  ]);

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
    setSearchParams({ edit: page.id });
  };

  const startCreate = () => {
    setSearchParams({ create: "true" });
  };

  const cancelEdit = () => {
    setSearchParams({});
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
            previewStyle={previewStyle}
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

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={pageManagement.formData.is_public ?? true} // Default true
                onChange={e => pageManagement.updateFormField("is_public", e.target.checked)}
              />
              Öffentlich sichtbar
            </label>
            <div className={styles.helpText}>
              Private Seiten sind nur für eingeloggte Administratoren sichtbar.
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

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { listImages } from "@/features/media/lib/storage";
import { fetchAllPages, type PageMeta } from "@/features/pages/lib/pageQueries";
import type { HeaderBlock, HeaderBlockType } from "@/layout/Header/types/header";
import { HeaderBlocks } from "@/layout/Header/types/header";
import { fetchHeaderBlocks, saveHeaderBlock, deleteHeaderBlock, upsertHeaderOrder } from "./lib/api";
import styles from "./HeaderAdmin.module.css";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { canEdit } from "@/features/auth/lib/permissions";
import { BlockItem } from "./components/BlockItem";
import { EditForm } from "./components/EditForm";
import { ImagePickerModal } from "./components/ImagePickerModal";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import { reorderWithinParent } from "@/shared/utils/reorder";

const HeaderAdmin: React.FC = () => {
  const { role } = useAuth();
  const readOnly = !canEdit(role);
  const [blocks, setBlocks] = useState<HeaderBlock[]>([]);
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HeaderBlock>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<{ name: string; url: string }[]>([]);
  const loadBlocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHeaderBlocks();
      setBlocks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Header-Blöcke");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPages = useCallback(async () => {
    const allPages = await fetchAllPages();
    setPages(allPages);
  }, []);

  useEffect(() => {
    loadBlocks();
    loadPages();
  }, [loadBlocks, loadPages]);

  const startEdit = (block: HeaderBlock) => {
    setEditingId(block.id);
    setFormData(block);
  };

  const startCreate = (blockType: HeaderBlockType, parentBlockId?: string) => {
    if (readOnly) return; // auditors: no create
    const defaults: Record<string, any> = {
      [HeaderBlocks.Logo]: { logo: { url: "", alt: "" } },
      [HeaderBlocks.Link]: { target_site_id: "", url: "", label: [] },
      [HeaderBlocks.Dropdown]: { title: [] },
    };

    setEditingId("new-" + blockType);
    setFormData({
      type: blockType,
      order: parentBlockId ? 0 : blocks.length,
      parent_block_id: parentBlockId || null,
      target_site_id: null,
      content: defaults[blockType],
    });
  };

  const startCreateChildLink = (parentId: string) => {
    startCreate(HeaderBlocks.Link, parentId);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveBlock = async () => {
    if (readOnly) return; // auditors: no save
    const isNew = editingId?.startsWith("new-");
    try {
      const payload = {
        type: formData.type,
        order: formData.order,
        parent_block_id: formData.parent_block_id,
        target_site_id: formData.target_site_id,
        content: formData.content,
      };

      await saveHeaderBlock(payload as Partial<HeaderBlock>, isNew ? undefined : editingId || undefined);

      await loadBlocks();
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    }
  };

  const deleteBlock = async (id: string) => {
    if (readOnly) return; // auditors: no delete
    if (!confirm("Möchten Sie diesen Block wirklich löschen?")) return;

    try {
      await deleteHeaderBlock(id);
      await loadBlocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const openImagePicker = async () => {
    setImagePickerOpen(true);
    const items = await listImages("");
    const withUrls = items.map(i => {
      const { data } = supabase.storage.from("public_images").getPublicUrl(i.name);
      return { name: i.name, url: data.publicUrl };
    });
    setAvailableImages(withUrls);
  };

  const selectLogoImage = (imageName: string) => {
    const content = formData.content as any || {};
    setFormData(prev => ({
      ...prev,
      content: { ...content, logo: { ...content.logo, url: imageName } }
    }));
    setImagePickerOpen(false);
  };

  const updateContent = (updates: any) => {
    setFormData(prev => ({
      ...prev,
      content: { ...(prev.content as any), ...updates }
    }));
  };

  const deleteChildBlock = async (childId: string) => {
    if (!confirm("Möchten Sie diesen Link wirklich löschen?")) return;
    try {
      const { error: err } = await supabase.from("header_blocks").delete().eq("id", childId);
      if (err) throw err;
      await loadBlocks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const persistOrder = useCallback(async (updates: Array<{ id: string; order: number }>) => {
    if (updates.length === 0) return;

    console.log("Sende Updates an DB:", updates);

    const data = await upsertHeaderOrder(updates);
    if (data) console.log("DB Update erfolgreich. Rückgabe:", data);
  }, []);

  const handleReorder = useCallback(async (sourceId: string, targetId: string) => {
    const { next, changed, updates } = reorderWithinParent(blocks, sourceId, targetId);

    if (!changed) return;

    setBlocks(next);

    try {
      await persistOrder(updates);
    } catch (err) {
      console.error("Reorder failed, lade Originalzustand...", err);
      setError("Fehler beim Speichern der Reihenfolge");
      await loadBlocks();
    }
  }, [blocks, persistOrder, loadBlocks]);

  const drag = useDragAndDrop({ onReorder: handleReorder, disabled: readOnly });

  const getPageTitle = (pageId: string) => pages.find(p => p.id === pageId)?.title || pageId;

  if (loading) return <div className={styles.container}>Lädt...</div>;

  const logo = blocks.find(b => b.type === HeaderBlocks.Logo);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Header-Verwaltung</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {editingId ? (
        <EditForm
          styles={styles}
          editingId={editingId}
          formData={formData}
          pages={pages}
          blocks={blocks}
          onChangeContent={updateContent}
          onChangeFormData={setFormData}
          onSave={saveBlock}
          onCancel={cancelEdit}
          onOpenImagePicker={openImagePicker}
          onDeleteChild={deleteChildBlock}
          onStartEdit={startEdit}
          onStartCreateChildLink={startCreateChildLink}
          getPageTitle={getPageTitle}
          readOnly={readOnly}
        />
      ) : (
        <>
          {/* Logo Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Logo</h2>
              {!logo && <button onClick={() => startCreate(HeaderBlocks.Logo)} className={styles.btn} disabled={readOnly} title={readOnly ? "Nur Lesen" : undefined}>+ Hinzufügen</button>}
            </div>
            {logo ? (
              <BlockItem
                block={logo}
                blocks={blocks}
                styles={styles}
                getPageTitle={getPageTitle}
                onEdit={startEdit}
                onDelete={deleteBlock}
                readOnly={readOnly}
                drag={drag}
              />
            ) : (
              <p style={{ color: "var(--color-neutral-400)" }}>Kein Logo vorhanden</p>
            )}
          </section>

          {/* Navigation Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Navigation</h2>
              
            </div>

            {blocks.filter(b => b.parent_block_id === null && b.type !== HeaderBlocks.Logo).length === 0 ? (
              <p style={{ color: "var(--color-neutral-400)" }}>Keine Navigation vorhanden</p>
            ) : (
              <div className={styles.navigationStack}>
                {blocks
                  .filter(b => b.parent_block_id === null && b.type !== HeaderBlocks.Logo)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(block => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      blocks={blocks}
                      styles={styles}
                      getPageTitle={getPageTitle}
                      onEdit={startEdit}
                      onDelete={deleteBlock}
                      readOnly={readOnly}
                      drag={drag}
                    />
                  ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => startCreate(HeaderBlocks.Link)} className={styles.btn} disabled={readOnly} title={readOnly ? "Nur Lesen" : undefined}>+ Link</button>
                <button onClick={() => startCreate(HeaderBlocks.Dropdown)} className={styles.btn} disabled={readOnly} title={readOnly ? "Nur Lesen" : undefined}>+ Dropdown</button>
              </div>
          </section>
        </>
      )}

      <ImagePickerModal
        open={imagePickerOpen}
        images={availableImages}
        styles={styles}
        onSelect={selectLogoImage}
        onClose={() => setImagePickerOpen(false)}
      />
    </div>
  );
};

export default HeaderAdmin;

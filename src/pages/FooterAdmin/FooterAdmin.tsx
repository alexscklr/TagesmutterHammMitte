import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { listImages } from "@/features/media/lib/storage";
import styles from "./FooterAdmin.module.css";
import { FooterBlocks, type FooterBlock, type FooterBlockType } from "@/layout/Footer/types";
import { BlockItem } from "./components/BlockItem";
import { EditForm } from "./components/EditForm";
import { ImagePickerModal } from "./components/ImagePickerModal";
import { fetchAllPages, type PageMeta } from "@/features/pages/lib/pageQueries";
import { fetchFooterBlocks, saveFooterBlock, deleteFooterBlock, upsertFooterOrder } from "./lib/api";

const FooterAdmin: React.FC = () => {
  const [blocks, setBlocks] = useState<FooterBlock[]>([]);
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FooterBlock>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [availableImages, setAvailableImages] = useState<{ name: string; url: string }[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const loadBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFooterBlocks();
      setBlocks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Footer-Blöcke");
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    const allPages = await fetchAllPages();
    setPages(allPages);
  };

  useEffect(() => {
    loadBlocks();
    loadPages();
  }, []);

  const startEdit = (block: FooterBlock) => {
    setEditingId(block.id);
    setFormData(block);
  };

  const startCreate = (blockType: FooterBlockType, parentBlockId?: string) => {
    const defaults: Record<string, any> = {
      [FooterBlocks.Portrait]: { image: { url: "", alt: "" } },
      [FooterBlocks.Link]: { target_site_id: "", url: "", label: [] },
      [FooterBlocks.List]: { content: [] },
      [FooterBlocks.Text]: { text: "" },
      [FooterBlocks.CopyrightNotice]: { notice: "© " }
    };

    // Only one copyright block at root
    if (blockType === FooterBlocks.CopyrightNotice && blocks.some(b => b.type === FooterBlocks.CopyrightNotice && b.parent_block_id === null)) {
      alert("Es gibt bereits einen Copyright-Hinweis.");
      return;
    }

    setEditingId("new-" + blockType);
    setFormData({
      type: blockType,
      order: parentBlockId ? 0 : blocks.length,
      parent_block_id: parentBlockId || null,
      target_site_id: null,
      content: defaults[blockType],
    } as Partial<FooterBlock>);
  };

  const startCreateChildLink = (parentId: string) => {
    startCreate(FooterBlocks.Link, parentId);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveBlock = async () => {
    const isNew = editingId?.startsWith("new-");
    try {
      const payload = {
        type: formData.type,
        order: formData.order,
        parent_block_id: formData.parent_block_id,
        target_site_id: formData.target_site_id,
        content: formData.content,
      } as Partial<FooterBlock>;

      await saveFooterBlock(payload, isNew ? undefined : (editingId ?? undefined));

      await loadBlocks();
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Möchten Sie diesen Block wirklich löschen?")) return;

    try {
      await deleteFooterBlock(id);
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

  const selectPortraitImage = (imageName: string) => {
    const content = (formData.content as any) || {};
    setFormData(prev => ({
      ...prev,
      content: { ...content, image: { ...(content.image || {}), url: imageName } }
    }));
    setImagePickerOpen(false);
  };

  const updateContent = (updates: any) => {
    setFormData(prev => ({
      ...prev,
      content: { ...(prev.content as any), ...updates }
    }));
  };

  const reorderBlocks = (
    list: FooterBlock[],
    sourceId: string,
    targetId: string
  ): { next: FooterBlock[]; changed: boolean; updates: Array<{ id: string; order: number }> } => {
    const source = list.find((b) => b.id === sourceId);
    const target = list.find((b) => b.id === targetId);

    // Nur innerhalb derselben Parent-Gruppe verschieben
    if (!source || !target || source.parent_block_id !== target.parent_block_id) {
      return { next: list, changed: false, updates: [] };
    }

    const siblings = list
      .filter((b) => b.parent_block_id === source.parent_block_id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const oldIndex = siblings.findIndex((b) => b.id === sourceId);
    const newIndex = siblings.findIndex((b) => b.id === targetId);

    if (oldIndex === newIndex) return { next: list, changed: false, updates: [] };

    const newSiblings = [...siblings];
    const [movedItem] = newSiblings.splice(oldIndex, 1);
    newSiblings.splice(newIndex, 0, movedItem);

    const updates = newSiblings.map((b, idx) => ({ id: b.id, order: idx }));
    const updateMap = new Map(updates.map((u) => [u.id, u.order]));

    const next = list.map((b) => (updateMap.has(b.id) ? { ...b, order: updateMap.get(b.id)! } : b));

    return { next, changed: true, updates };
  };

  const persistOrder = async (updates: Array<{ id: string; order: number }>) => {
    if (updates.length === 0) return;

    console.log("Sende Updates an DB:", updates);

    const data = await upsertFooterOrder(updates);
    if (data) console.log("DB Update erfolgreich. Rückgabe:", data);
  };

  const handleReorder = async (sourceId: string, targetId: string) => {
    const { next, changed, updates } = reorderBlocks(blocks, sourceId, targetId);

    if (!changed) return;

    setBlocks(next);

    try {
      await persistOrder(updates);
    } catch (err) {
      console.error("Reorder failed, lade Originalzustand...", err);
      setError("Fehler beim Speichern der Reihenfolge");
      await loadBlocks();
    }
  };

  const getPageTitle = (pageId: string) => pages.find(p => p.id === pageId)?.title || pageId;

  if (loading) return <div className={styles.container}>Lädt...</div>;

  const copyright = blocks.find(b => b.type === FooterBlocks.CopyrightNotice && b.parent_block_id === null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Footer-Verwaltung</h1>
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
          onStartCreateChildLink={startCreateChildLink}
        />
      ) : (
        <>
          {/* Top Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Inhalt</h2>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                <button onClick={() => startCreate(FooterBlocks.Portrait)} className={styles.btn}>+ Portrait</button>
                <button onClick={() => startCreate(FooterBlocks.List)} className={styles.btn}>+ Liste</button>
                <button onClick={() => startCreate(FooterBlocks.Link)} className={styles.btn}>+ Link</button>
                <button onClick={() => startCreate(FooterBlocks.Text)} className={styles.btn}>+ Text</button>
                {!copyright && <button onClick={() => startCreate(FooterBlocks.CopyrightNotice)} className={styles.btn}>+ Copyright</button>}
              </div>
            </div>

            {blocks.filter(b => b.parent_block_id === null).length === 0 ? (
              <p style={{ color: "var(--color-neutral-400)" }}>Noch keine Footer-Inhalte</p>
            ) : (
              <div className={styles.navigationStack}>
                {blocks
                  .filter(b => b.parent_block_id === null)
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
                      onAddChild={block.type === FooterBlocks.List ? startCreateChildLink : undefined}
                      draggingId={draggingId}
                      setDraggingId={setDraggingId}
                      onReorder={handleReorder}
                    />
                  ))}
              </div>
            )}
          </section>
        </>
      )}

      <ImagePickerModal
        open={imagePickerOpen}
        images={availableImages}
        styles={styles}
        onSelect={selectPortraitImage}
        onClose={() => setImagePickerOpen(false)}
        title="Portrait auswählen"
      />
    </div>
  );
};

export default FooterAdmin;

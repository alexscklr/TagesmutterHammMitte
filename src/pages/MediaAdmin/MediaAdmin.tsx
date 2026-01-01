import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaUpload, FaTrash, FaPen } from "react-icons/fa6";
import { TbReplace } from "react-icons/tb";
import styles from "./MediaAdmin.module.css";
import { listImages, getImageSignedUrl, uploadImage, deleteImage } from "@/features/media/lib/storage";
import { ImageEditorModal } from "./ImageEditorModal";

type ImageItem = {
    name: string;
    url: string;
};

const MediaAdmin: React.FC = () => {
    const [items, setItems] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorUrl, setEditorUrl] = useState<string | null>(null);
    const [editorLoading, setEditorLoading] = useState(false);

    const isMounted = useRef(true);

    const refresh = useCallback(async () => {
        if (!isMounted.current) return;
        setError(null);
        setLoading(true);
        try {
            const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000));
            const files = await Promise.race([listImages(""), timeout]);
            if (!isMounted.current) return;
            const names = files.map(f => ({ name: f.name, url: "" }));
            setItems(names);
            const updateOne = async (idx: number, name: string) => {
                try {
                    const url = (await getImageSignedUrl(name)) ?? "";
                    if (!isMounted.current) return;
                    setItems(prev => {
                        if (!prev[idx] || prev[idx].name !== name) return prev;
                        const next = prev.slice();
                        next[idx] = { name, url };
                        return next;
                    });
                } catch (e) {
                    console.error("signed url error", e);
                }
            };
            names.forEach((it, i) => { void updateOne(i, it.name); });
        } catch (e) {
            console.error("MediaAdmin refresh error", e);
            if (isMounted.current) {
                setError(e instanceof Error && e.message === "timeout" ? "Zeitüberschreitung beim Laden" : "Fehler beim Laden der Bilder");
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        void refresh();
        return () => { isMounted.current = false; };
    }, [refresh]);

    const onUpload = async (file?: File) => {
        if (!file) return;
        try {
            setUploading(true);
            const path = await uploadImage(file);
            if (!path) throw new Error("Upload fehlgeschlagen");
            await refresh();
        } catch (e) {
            console.error(e);
            setError("Fehler beim Hochladen");
        } finally {
            setUploading(false);
        }
    };

    const onReplace = async (file?: File) => {
        if (!file || !selected) return;
        try {
            setUploading(true);
            const ok = await uploadImage(file, selected);
            if (!ok) throw new Error("Ersetzen fehlgeschlagen");
            await refresh();
        } catch (e) {
            console.error(e);
            setError("Fehler beim Ersetzen");
        } finally {
            setUploading(false);
        }
    };

    const onDelete = async () => {
        if (!selected) return;
        if (!window.confirm(`Möchtest du das Bild ${selected} wirklich löschen?`)) return;
        const ok = await deleteImage(selected);
        if (ok) {
            setSelected(null);
            await refresh();
        } else {
            setError("Fehler beim Löschen");
        }
    };

    const openEditor = async () => {
        if (!selected) return;
        try {
            setEditorLoading(true);
            const url = (await getImageSignedUrl(selected)) ?? "";
            setEditorUrl(url);
            setEditorOpen(true);
        } catch (e) {
            console.error(e);
            setError("Fehler beim Laden des Editors");
        } finally {
            setEditorLoading(false);
        }
    };

    const handleSaveEdited = async (blob: Blob, mode: "replace" | "copy") => {
        if (!selected) return;
        try {
            setUploading(true);
            const ext = selected.split(".").pop()?.toLowerCase() || "jpg";
            const base = selected.replace(/\.[^.]+$/, "");
            const targetName = mode === "replace" ? selected : `${base}-edit-${Date.now()}.${ext}`;
            const file = new File([blob], targetName, { type: blob.type || "image/jpeg" });
            const saved = await uploadImage(file, mode === "replace" ? selected : undefined);
            if (!saved) throw new Error("Speichern fehlgeschlagen");
            await refresh();
            setSelected(targetName);
            setEditorOpen(false);
            setEditorUrl(null);
        } catch (e) {
            console.error(e);
            setError("Fehler beim Speichern");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Medienverwaltung</h1>
                    {selected && <p className={styles.selectedInfo}>Ausgewählt: <strong>{selected}</strong></p>}
                </div>
                <div className={styles.actions}>
                    <label className={styles.uploadButton}>
                        <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0] ?? undefined)} disabled={uploading} />
                        <FaUpload /> Neues Bild
                    </label>
                    {selected && (
                        <label className={styles.replaceButton}>
                            <input type="file" accept="image/*" onChange={(e) => onReplace(e.target.files?.[0] ?? undefined)} disabled={uploading} />
                            <TbReplace /> Ersetzen
                        </label>
                    )}
                    {selected && (
                        <button className={styles.editButton} onClick={openEditor} disabled={uploading || editorLoading} title="Bild zuschneiden / blurren">
                            <FaPen /> Bearbeiten
                        </button>
                    )}
                    {selected && (
                        <button className={styles.deleteButton} onClick={onDelete} disabled={uploading} title="Ausgewähltes Bild löschen">
                            <FaTrash /> Löschen
                        </button>
                    )}
                </div>
            </header>
            {error && <div className={styles.error}>{error}</div>}
            {uploading && <div className={styles.loadingBar}><div className={styles.loadingProgress}></div></div>}
            {loading && !uploading ? (
                <div>Wird geladen…</div>
            ) : (
                <div className={styles.grid}>
                    {items.map((it) => (
                        <button key={it.name} className={`${styles.card} ${selected === it.name ? styles.selected : ""}`} onClick={() => setSelected(it.name)}>
                            {it.url ? (
                                <img src={it.url} alt={it.name} />
                            ) : (
                                <div className={styles.placeholder}>Lädt URL...</div>
                            )}
                            <div className={styles.caption}>{it.name}</div>
                        </button>
                    ))}
                    {items.length === 0 && <div>Keine Bilder gefunden.</div>}
                </div>
            )}
            <ImageEditorModal
                open={editorOpen}
                imageUrl={editorUrl}
                imageName={selected}
                onClose={() => setEditorOpen(false)}
                onSave={handleSaveEdited}
            />
        </div>
    );
};

export default MediaAdmin;
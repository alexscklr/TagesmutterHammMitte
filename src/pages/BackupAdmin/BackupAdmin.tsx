import React, { useState, useRef } from 'react';
import { renderPageBlock } from '@/features/pages/components/renderer/renderPageBlock';
import styles from './BackupAdmin.module.css';
import { supabase } from '@/supabaseClient';
import { FaDownload, FaUpload, FaSpinner, FaCheck } from 'react-icons/fa';

// Constants
const TABLES = [
  'pages', 
  'page_blocks',
  'header_blocks', 
  'footer_blocks', 
  'reviews', 
  'review_tokens'
];
const STORAGE_BUCKETS = ['public_images'];

// Types
type ChangeType = 'NEW' | 'DELETED' | 'MODIFIED' | 'UNCHANGED';

interface DiffItem {
  id: string; // ID for DB rows, path for Storage
  type: ChangeType;
  collection: string; // Table name or Bucket name
  isStorage: boolean;
  oldData: any;
  newData: any;
  selected: boolean;
}

export const BackupAdmin = () => {
    const [status, setStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [diffs, setDiffs] = useState<DiffItem[]>([]);
    const [previewMode, setPreviewMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- HELPER FUNCTIONS ---

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const base64ToBlob = async (base64: string): Promise<Blob> => {
        const res = await fetch(base64);
        return await res.blob();
    };

    const listAllFiles = async (bucket: string, path = ''): Promise<{ name: string; id: string | null }[]> => {
      let results: { name: string; id: string | null }[] = [];
      let offset = 0;
      const LIMIT = 100;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase.storage.from(bucket).list(path, { limit: LIMIT, offset: offset });
        if (error) throw error;
        
        if (!data || data.length === 0) {
          hasMore = false;
          break;
        }

        for (const item of data) {
          const itemPath = path ? `${path}/${item.name}` : item.name;
          if (!item.id) {
            const subFiles = await listAllFiles(bucket, itemPath);
            results = [...results, ...subFiles];
          } else {
            results.push({ name: itemPath, id: item.id });
          }
        }

        if (data.length < LIMIT) hasMore = false;
        else offset += LIMIT;
      }
      return results;
    };

    // --- ACTIONS ---

    const handleBackup = async () => {
        try {
            setIsLoading(true);
            setStatus('Fetching database data...');

            const backupData: any = {
                timestamp: Date.now(),
                tables: {},
                storage: {}
            };

            for (const table of TABLES) {
                setStatus(`Fetching table: ${table}...`);
                const { data, error } = await supabase.from(table).select('*');
                if (error) throw error;
                backupData.tables[table] = data;
            }

            for (const bucket of STORAGE_BUCKETS) {
                setStatus(`Scanning bucket: ${bucket}...`);
                const files = await listAllFiles(bucket);
                backupData.storage[bucket] = [];
                for (const file of files) {
                    if (file.name.endsWith('.emptyFolderPlaceholder')) continue;
                    setStatus(`Downloading: ${bucket}/${file.name}...`);
                    const { data: blob, error: downloadError } = await supabase.storage.from(bucket).download(file.name);
                    if (downloadError) {
                        console.error(`Failed to download ${file.name}`, downloadError);
                        continue;
                    }
                    if (blob) {
                        const base64 = await blobToBase64(blob as Blob);
                        backupData.storage[bucket].push({
                            name: file.name,
                            type: blob.type,
                            data: base64
                        });
                    }
                }
            }

            setStatus('Generating JSON...');
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('Backup complete!');
        } catch (e: any) {
            console.error(e);
            setStatus(`Backup failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setStatus('Analyzing backup file...');
            const text = await file.text();
            const backupData = JSON.parse(text);

            if (!backupData.tables || !backupData.storage) {
                throw new Error('Invalid backup file format');
            }

            const calculatedDiffs: DiffItem[] = [];

            // 1. Compare Tables (ignore system fields)
            const clean = (obj: any) => {
                if (!obj) return obj;
                const { created_at, updated_at, inserted_at, modified_at, deleted_at, ...rest } = obj;
                return rest;
            };
            for (const table of TABLES) {
                setStatus(`Comparing table: ${table}...`);
                const { data: currentRows, error } = await supabase.from(table).select('*');
                if (error) throw error;
                const backupRows = backupData.tables[table] || [];
                const currentMap = new Map((currentRows || []).map((r: any) => [r.id, r]));
                const backupMap = new Map(backupRows.map((r: any) => [r.id, r]));
                // NEW & MODIFIED
                for (const backupRow of backupRows) {
                    const currentRow = currentMap.get(backupRow.id);
                    if (!currentRow) {
                        calculatedDiffs.push({
                            id: backupRow.id,
                            type: 'NEW',
                            collection: table,
                            isStorage: false,
                            oldData: null,
                            newData: backupRow,
                            selected: true
                        });
                    } else {
                        if (JSON.stringify(clean(currentRow)) !== JSON.stringify(clean(backupRow))) {
                            calculatedDiffs.push({
                                id: backupRow.id,
                                type: 'MODIFIED',
                                collection: table,
                                isStorage: false,
                                oldData: currentRow,
                                newData: backupRow,
                                selected: true
                            });
                        }
                    }
                }
                // DELETED
                for (const currentRow of (currentRows || [])) {
                    if (!backupMap.has((currentRow as any).id)) {
                        calculatedDiffs.push({
                            id: (currentRow as any).id,
                            type: 'DELETED',
                            collection: table,
                            isStorage: false,
                            oldData: currentRow,
                            newData: null,
                            selected: true
                        });
                    }
                }
            }


            // 2. Compare Storage (optimiert)
            const getOriginalSize = (base64: string) => {
                const base64String = base64.split(',')[1] || base64;
                return Math.floor((base64String.length * 3) / 4) - (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0);
            };
            for (const bucket of STORAGE_BUCKETS) {
                setStatus(`Comparing bucket: ${bucket}...`);
                const { data: currentFiles, error: listError } = await supabase.storage.from(bucket).list('', { limit: 10000 });
                if (listError) throw listError;
                const backupFiles = backupData.storage[bucket] || [];
                const currentMap = new Map((currentFiles || []).map(f => [f.name, f]));
                const backupMap = new Map(backupFiles.map((f: any) => [f.name, f]));
                for (const backupFile of backupFiles) {
                    const currentFile = currentMap.get(backupFile.name);
                    if (!currentFile) {
                        calculatedDiffs.push({
                            id: backupFile.name,
                            type: 'NEW',
                            collection: bucket,
                            isStorage: true,
                            oldData: null,
                            newData: backupFile,
                            selected: true
                        });
                    } else {
                        // 1. ETag/Hash
                        const backupEtag = backupFile.etag || backupFile.hash || backupFile.md5Hash;
                        const currentEtag = currentFile.metadata?.etag || currentFile.metadata?.hash || currentFile.metadata?.md5Hash;
                        if (backupEtag && currentEtag && backupEtag === currentEtag) continue;
                        // 2. updated_at
                        if (backupFile.updated_at && currentFile.updated_at && backupFile.updated_at === currentFile.updated_at) continue;
                        // 3. Größe
                        const backupSize = getOriginalSize(backupFile.data);
                        const currentSize = currentFile.metadata?.size;
                        if (backupSize === currentSize) {
                            // 4. Optional: Base64-Vergleich (nur wenn Größe gleich, aber ETag/updated_at unterschiedlich)
                            setStatus(`Vergleiche Bildinhalt: ${bucket}/${backupFile.name}`);
                            const { data: blob, error } = await supabase.storage.from(bucket).download(backupFile.name);
                            if (error || !blob) {
                                calculatedDiffs.push({
                                    id: backupFile.name,
                                    type: 'MODIFIED',
                                    collection: bucket,
                                    isStorage: true,
                                    oldData: { name: currentFile.name },
                                    newData: backupFile,
                                    selected: true
                                });
                                continue;
                            }
                            const currentBase64 = await blobToBase64(blob as Blob);
                            if (currentBase64 !== backupFile.data) {
                                calculatedDiffs.push({
                                    id: backupFile.name,
                                    type: 'MODIFIED',
                                    collection: bucket,
                                    isStorage: true,
                                    oldData: { name: currentFile.name, size: currentSize, type: (blob as Blob).type },
                                    newData: { ...backupFile, size: backupSize },
                                    selected: true
                                });
                            }
                            // else: identical
                        } else {
                            calculatedDiffs.push({
                                id: backupFile.name,
                                type: 'MODIFIED',
                                collection: bucket,
                                isStorage: true,
                                oldData: { name: currentFile.name, size: currentSize },
                                newData: { ...backupFile, size: backupSize },
                                selected: true
                            });
                        }
                    }
                }
                // DELETED
                for (const currentFile of currentFiles || []) {
                    if (!backupMap.has(currentFile.name)) {
                        calculatedDiffs.push({
                            id: currentFile.name,
                            type: 'DELETED',
                            collection: bucket,
                            isStorage: true,
                            oldData: currentFile,
                            newData: null,
                            selected: true
                        });
                    }
                }
            }

            setDiffs(calculatedDiffs);
            setPreviewMode(true);
            setStatus('');

        } catch (e: any) {
            console.error(e);
            setStatus(`Analysis failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDiffSelection = (index: number) => {
        setDiffs(prev => prev.map((d, i) => i === index ? { ...d, selected: !d.selected } : d));
    };

    const toggleAll = (select: boolean) => {
        setDiffs(prev => prev.map(d => ({ ...d, selected: select })));
    };

    const executeRestore = async () => {
        if (!confirm("Are you sure you want to apply the selected changes? Database content will be overwritten.")) return;

        setIsLoading(true);
        setStatus("Applying changes...");
        
        try {
            const selectedDiffs = diffs.filter(d => d.selected);

            // Group by operation
            // Deletes must happen first (for FK constraints? actually maybe reverse order for deletes)
            // Inserts last.
            // Updates middle.
            
            // To be safe and respect constraints, we probably should disable constraints or be very smart.
            // But we are working table by table in order or reverse order.
            
            // Strategy:
            // 1. DELETEs (Reverse Table Order)
            // 2. UPSERTs (Normal Table Order) (Covers NEW and MODIFIED)

            // Let's organize diffs by collection and type
            const deletes = selectedDiffs.filter(d => d.type === 'DELETED');
            const upserts = selectedDiffs.filter(d => d.type === 'NEW' || d.type === 'MODIFIED');

            // 1. Deletes - Storage
            const storageDeletes = deletes.filter(d => d.isStorage);
            const buckets = [...new Set(storageDeletes.map(d => d.collection))];
            for (const bucket of buckets) {
                const files = storageDeletes.filter(d => d.collection === bucket).map(d => d.id);
                if (files.length) {
                    setStatus(`Deleting files in ${bucket}...`);
                     const { error } = await supabase.storage.from(bucket).remove(files);
                     if (error) console.error("Error removing files", error);
                }
            }

            // 2. Deletes - Tables (Reverse Order)
            const reverseTables = [...TABLES].reverse();
            for (const table of reverseTables) {
                const tableDeletes = deletes.filter(d => d.collection === table && !d.isStorage);
                if (tableDeletes.length) {
                    setStatus(`Deleting rows from ${table}...`);
                    const ids = tableDeletes.map(d => d.id);
                    // Batch delete
                    const chunkSize = 100;
                    for (let i = 0; i < ids.length; i += chunkSize) {
                        const batch = ids.slice(i, i + chunkSize);
                        const { error } = await supabase.from(table).delete().in('id', batch);
                        if (error) throw error;
                    }
                }
            }

            // 3. Upserts - Tables (Normal Order)
            for (const table of TABLES) {
                const tableUpserts = upserts.filter(d => d.collection === table && !d.isStorage);
                if (tableUpserts.length) {
                     setStatus(`Updating/Inserting rows in ${table}...`);
                     const rows = tableUpserts.map(d => d.newData);
                     // Batch upsert
                     const { error } = await supabase.from(table).upsert(rows);
                     if (error) throw error;
                }
            }

            // 4. Upserts - Storage
            const storageUpserts = upserts.filter(d => d.isStorage);
            for (const update of storageUpserts) {
                setStatus(`Uploading ${update.collection}/${update.id}...`);
                const blob = await base64ToBlob(update.newData.data);
                const { error } = await supabase.storage.from(update.collection).upload(update.id, blob, { upsert: true });
                if (error) console.error("Error uploading file", error);
            }

             setStatus('Restore complete!');
             setTimeout(() => {
                 setPreviewMode(false);
                 setDiffs([]);
                 window.location.reload();
             }, 1500);

        } catch (e: any) {
            console.error(e);
            setStatus(`Restore execution failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER ---

    const renderDiffList = () => {
        // Group by collection for display
        const grouped = diffs.reduce((acc, curr) => {
            if (!acc[curr.collection]) acc[curr.collection] = [];
            acc[curr.collection].push(curr);
            return acc;
        }, {} as Record<string, DiffItem[]>);

        // Übersetzungen für Status
        const statusLabel = (type: ChangeType) => {
            switch (type) {
                case 'NEW': return 'Neu aus Backup';
                case 'DELETED': return 'Entfernt (im Backup nicht vorhanden)';
                case 'MODIFIED': return 'Wird überschrieben';
                case 'UNCHANGED': return 'Unverändert';
                default: return type;
            }
        };
        return (
            <div className={styles.diffContainer}>
                {Object.entries(grouped).map(([collection, items]) => (
                    <div key={collection} className={styles.diffSection}>
                        <div className={styles.sectionTitle}>
                             {collection}
                        </div>
                        <table className={styles.diffTable}>
                            <thead>
                                <tr>
                                    <th style={{width: '40px'}}>
                                        <input 
                                            type="checkbox" 
                                            checked={items.every(i => i.selected)}
                                            onChange={(e) => {
                                                 const checked = e.target.checked;
                                                 setDiffs(prev => prev.map(d => d.collection === collection ? { ...d, selected: checked } : d));
                                            }}
                                        />
                                    </th>
                                    <th>Aktion</th>
                                    <th>ID / Name</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => {
                                    const realIndex = diffs.indexOf(item);
                                    return (
                                        <tr key={`${item.id}-${idx}`} className={`${styles.diffRow} ${item.selected ? styles.selected : ''}`}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={item.selected}
                                                    onChange={() => toggleDiffSelection(realIndex)}
                                                />
                                            </td>
                                            <td>
                                                <span className={`${styles.chip} ${styles[`chip${item.type}`]}`}>
                                                    {statusLabel(item.type)}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item.type === 'MODIFIED' && !item.isStorage && (
                                                    <div style={{display: 'flex', gap: '1rem'}}>
                                                        <div style={{flex: 1, minWidth: 0}}>
                                                            <div style={{fontWeight: 600, marginBottom: 2}}>Aktueller Stand</div>
                                                            <div className={styles.previewBox} style={{background: '#fff'}}>
                                                                {renderPageBlock(item.oldData, false) || <pre>{JSON.stringify(item.oldData, null, 2)}</pre>}
                                                            </div>
                                                        </div>
                                                        <div style={{flex: 1, minWidth: 0}}>
                                                            <div style={{fontWeight: 600, marginBottom: 2}}>Backup-Version</div>
                                                            <div className={styles.previewBox} style={{background: '#fff'}}>
                                                                {renderPageBlock(item.newData, false) || <pre>{JSON.stringify(item.newData, null, 2)}</pre>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.isStorage && item.type === 'MODIFIED' && (
                                                    <div>
                                                        <div>Bild wird durch Backup-Version ersetzt</div>
                                                        <div style={{fontSize: '0.85em', color: '#888'}}>
                                                            <b>Aktuell:</b> {item.oldData?.type} ({item.oldData?.size} bytes)<br/>
                                                            <b>Backup:</b> {item.newData?.type} ({item.newData?.size} bytes)
                                                        </div>
                                                    </div>
                                                )}
                                                {item.isStorage && item.type === 'NEW' && <div className={styles.contextInfo}>Bild wird aus Backup hinzugefügt</div>}
                                                {item.isStorage && item.type === 'DELETED' && <div className={styles.contextInfo}>Bild wird entfernt (im Backup nicht vorhanden)</div>}
                                                {item.isStorage && item.type === 'UNCHANGED' && <div className={styles.contextInfo}>Bild unverändert</div>}
                                                {item.type === 'DELETED' && !item.isStorage && <div className={styles.contextInfo}>Datensatz wird entfernt (im Backup nicht vorhanden)</div>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );
    };

    if (previewMode) {
        return (
            <section className={styles.container}>
                <h1 className={styles.title}>Backup-Wiederherstellung: Vorschau der Änderungen</h1>
                <div className={styles.card}>
                   <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'flex-end'}}>
                       <button className={styles.button} onClick={() => toggleAll(true)} style={{backgroundColor: '#6c757d'}}>Alle auswählen</button>
                       <button className={styles.button} onClick={() => toggleAll(false)} style={{backgroundColor: '#6c757d'}}>Alle abwählen</button>
                       <button className={styles.button} onClick={() => { setPreviewMode(false); setDiffs([]); }}>Abbrechen</button>
                   </div>
                   {renderDiffList()}
                   <div className={styles.actionBar}>
                       <span>{diffs.filter(d => d.selected).length} Änderungen ausgewählt</span>
                       <button className={styles.button} onClick={executeRestore} disabled={isLoading || diffs.filter(d => d.selected).length === 0}>
                           {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                           Ausgewählte Änderungen aus Backup übernehmen
                       </button>
                   </div>
                </div>
                {isLoading && (
                    <div className={styles.loadingOverlay}>
                        <FaSpinner className="animate-spin" size={48} />
                        <div>{status}</div>
                    </div>
                )}
            </section>
        );
    }

    return (
        <section className={styles.container}>
             <h1 className={styles.title}>Backup & Restore</h1>
             
             <div className={styles.card}>
                 <div className={styles.sectionTitle}>
                     Datenbank sichern (Herunterladen)
                 </div>
                 <p>Speichert alle Seiten, Inhalte und Bilder als JSON-Datei.</p>
                 <button className={styles.button} onClick={handleBackup} disabled={isLoading}>
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                    Backup erstellen
                </button>
             </div>

             <div className={styles.card}>
                 <div className={styles.sectionTitle}>
                     Backup wiederherstellen
                 </div>
                 <p>Lädt ein Backup hoch und zeigt die Unterschiede zur aktuellen Datenbank an. Du kannst entscheiden, welche Änderungen übernommen werden sollen.</p>
                 
                 <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                     <FaUpload size={32} color="#ccc" />
                     <div style={{marginTop: '0.5rem'}}>Klicken um Backup-Datei (.json) auszuwählen</div>
                 </div>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".json"
                    onChange={handleFileSelect}
                />
             </div>
             
             {status && <div className={styles.status} style={{marginTop: '1rem'}}>{status}</div>}
             
             {isLoading && (
                 <div className={styles.loadingOverlay}>
                     <FaSpinner className="animate-spin" size={48} />
                     <div>{status}</div>
                 </div>
             )}
        </section>
    );
};

export default BackupAdmin;

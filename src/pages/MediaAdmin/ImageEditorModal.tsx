import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaX, FaCropSimple, FaFillDrip, FaRotateLeft, FaTrash, FaCheck, FaCopy } from "react-icons/fa6";
import { RiImageAiLine } from "react-icons/ri";
import styles from "./ImageEditorModal.module.css";

export type BlurRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Mode = "crop" | "blur";

type Props = {
  open: boolean;
  imageUrl: string | null;
  imageName: string | null;
  onClose: () => void;
  onSave: (blob: Blob, mode: "replace" | "copy") => Promise<void>;
};

type Rect = { x: number; y: number; width: number; height: number };

const clampRect = (r: Rect, bounds: Rect): Rect => ({
  x: Math.min(Math.max(r.x, bounds.x), bounds.x + bounds.width),
  y: Math.min(Math.max(r.y, bounds.y), bounds.y + bounds.height),
  width: Math.min(r.width, bounds.width),
  height: Math.min(r.height, bounds.height),
});

const normalize = (start: { x: number; y: number }, end: { x: number; y: number }): Rect => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  width: Math.abs(start.x - end.x),
  height: Math.abs(start.y - end.y),
});

export const ImageEditorModal: React.FC<Props> = ({ open, imageUrl, imageName, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>("crop");
  const [crop, setCrop] = useState<Rect | null>(null);
  const [blurs, setBlurs] = useState<BlurRect[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);
  const [scale, setScale] = useState(1);
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [saving, setSaving] = useState(false);
  const [blurStrength, setBlurStrength] = useState(14);
  const [isWebP, setIsWebP] = useState(false);
  const [isSVG, setIsSVG] = useState(false);

  // Load image when url changes
  useEffect(() => {
    if (!open || !imageUrl) {
      setImg(null);
      setCrop(null);
      setBlurs([]);
      setIsWebP(false);
      setIsSVG(false);
      return;
    }
    
    // Check if image is WebP or SVG based on Content-Type header
    const checkImageFormat = async () => {
      try {
        const response = await fetch(imageUrl, { method: "HEAD" });
        const contentType = response.headers.get("content-type")?.toLowerCase() || "";
        setIsWebP(contentType.includes("webp"));
        setIsSVG(contentType.includes("svg"));
      } catch {
        // Fallback: check filename if fetch fails
        const isWebPFallback = imageName?.toLowerCase().endsWith(".webp") || imageUrl.toLowerCase().includes(".webp");
        const isSVGFallback = imageName?.toLowerCase().endsWith(".svg") || imageUrl.toLowerCase().includes(".svg");
        setIsWebP(isWebPFallback);
        setIsSVG(isSVGFallback);
      }
    };
    
    checkImageFormat();
    
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => {
      setImg(i);
      setCrop({ x: 0, y: 0, width: i.naturalWidth, height: i.naturalHeight });
      const maxW = 1000;
      const maxH = 620;
      const s = Math.min(maxW / i.naturalWidth, maxH / i.naturalHeight, 1);
      setScale(s);
      setDisplaySize({ w: Math.round(i.naturalWidth * s), h: Math.round(i.naturalHeight * s) });
    };
    i.onerror = () => setImg(null);
    i.src = imageUrl;
  }, [imageUrl, open, imageName]);

  const bounds = useMemo<Rect | null>(() => {
    if (!img) return null;
    return { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
  }, [img]);

  // Draw preview
  useEffect(() => {
    if (!img || !canvasRef.current || !crop || !bounds) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = displaySize.w;
    canvasRef.current.height = displaySize.h;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw image scaled
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, displaySize.w, displaySize.h);

    // Overlays
    // Crop outline
    const toDisplay = (r: Rect) => ({
      x: r.x * scale,
      y: r.y * scale,
      width: r.width * scale,
      height: r.height * scale,
    });
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    const cropD = toDisplay(crop);
    ctx.strokeRect(cropD.x, cropD.y, cropD.width, cropD.height);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    // darken outside crop
    ctx.beginPath();
    ctx.rect(0, 0, displaySize.w, displaySize.h);
    ctx.rect(cropD.x, cropD.y, cropD.width, cropD.height);
    ctx.fill("evenodd");

    // Blurs (preview) by redrawing region with blur filter
    blurs.forEach(b => {
      const bd = toDisplay(b);
      ctx.save();
      ctx.filter = `blur(${blurStrength}px)`;
      ctx.drawImage(img, b.x, b.y, b.width, b.height, bd.x, bd.y, bd.width, bd.height);
      ctx.filter = "none";
      ctx.strokeStyle = "rgba(124,135,248,0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(bd.x, bd.y, bd.width, bd.height);
      ctx.restore();
    });

    // Draft rectangle while dragging
    if (draft) {
      const dd = toDisplay(draft);
      ctx.strokeStyle = mode === "crop" ? "#00e676" : "#e65100";
      ctx.lineWidth = 2;
      ctx.strokeRect(dd.x, dd.y, dd.width, dd.height);
    }
    ctx.restore();
  }, [img, crop, blurs, draft, scale, displaySize, bounds, mode]);

  const pointFromEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    // Get coordinates from mouse or touch event
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate position relative to canvas display size
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    // Convert to image natural coordinates using display size ratio
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const px = mouseX * scaleX / scale;
    const py = mouseY * scaleY / scale;
    
    if (!bounds) return null;
    return {
      x: Math.min(Math.max(px, bounds.x), bounds.x + bounds.width),
      y: Math.min(Math.max(py, bounds.y), bounds.y + bounds.height),
    };
  };

  const handleDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!bounds) return;
    const pt = pointFromEvent(e);
    if (!pt) return;
    setDragStart(pt);
    setDraft({ x: pt.x, y: pt.y, width: 0, height: 0 });
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dragStart) return;
    const pt = pointFromEvent(e);
    if (!pt) return;
    const rect = normalize(dragStart, pt);
    setDraft(rect);
  };

  const handleUp = () => {
    if (!dragStart || !draft || !bounds) {
      setDragStart(null);
      setDraft(null);
      return;
    }
    const finalRect = clampRect(draft, bounds);
    if (finalRect.width < 6 || finalRect.height < 6) {
      setDragStart(null);
      setDraft(null);
      return;
    }
    if (mode === "crop") {
      setCrop(finalRect);
    } else {
      setBlurs(prev => [...prev, { id: crypto.randomUUID(), ...finalRect }]);
    }
    setDragStart(null);
    setDraft(null);
  };

  const resetCrop = () => {
    if (!img) return;
    setCrop({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
  };

  const clearBlurs = () => setBlurs([]);

  const deleteBlur = (id: string) => setBlurs(prev => prev.filter(b => b.id !== id));

  const exportBlob = async (format: "jpeg" | "webp" = "jpeg"): Promise<Blob | null> => {
    if (!img || !crop) return null;
    const maxOut = 2200;
    const scaleOut = Math.min(maxOut / crop.width, maxOut / crop.height, 1);
    const outW = Math.max(1, Math.round(crop.width * scaleOut));
    const outH = Math.max(1, Math.round(crop.height * scaleOut));

    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    const ctx = out.getContext("2d");
    if (!ctx) return null;

    // draw base crop
    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, outW, outH);

    // apply blurs
    for (const b of blurs) {
      const overlapX = Math.max(0, Math.min(crop.x + crop.width, b.x + b.width) - Math.max(crop.x, b.x));
      const overlapY = Math.max(0, Math.min(crop.y + crop.height, b.y + b.height) - Math.max(crop.y, b.y));
      if (overlapX <= 0 || overlapY <= 0) continue;
      const sx = Math.max(b.x, crop.x);
      const sy = Math.max(b.y, crop.y);
      const sw = Math.min(b.x + b.width, crop.x + crop.width) - sx;
      const sh = Math.min(b.y + b.height, crop.y + crop.height) - sy;

      const dx = (sx - crop.x) * scaleOut;
      const dy = (sy - crop.y) * scaleOut;
      const dw = sw * scaleOut;
      const dh = sh * scaleOut;

      const temp = document.createElement("canvas");
      temp.width = Math.max(1, Math.round(dw));
      temp.height = Math.max(1, Math.round(dh));
      const tctx = temp.getContext("2d");
      if (!tctx) continue;
      tctx.filter = `blur(${blurStrength}px)`;
      tctx.drawImage(img, sx, sy, sw, sh, 0, 0, temp.width, temp.height);
      ctx.drawImage(temp, dx, dy, dw, dh);
    }

    const mimeType = format === "webp" ? "image/webp" : "image/jpeg";
    const quality = format === "webp" ? 0.85 : 0.9;
    return await new Promise<Blob | null>(resolve => out.toBlob(blob => resolve(blob), mimeType, quality));
  };

  const handleSave = async (mode: "replace" | "copy", format: "jpeg" | "webp" = "jpeg") => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await exportBlob(format);
      if (!blob) throw new Error("Konnte kein Bild rendern");
      await onSave(blob, mode);
    } catch (e) {
      console.error(e);
      alert("Fehler beim Speichern. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bild bearbeiten {imageName ? `(${imageName})` : ""}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen"><FaX /></button>
        </div>
        <div className={styles.body}>
          <div className={styles.canvasShell}>
            {!img && <div className={styles.emptyState}>Bild wird geladen…</div>}
            {img && (
              <>
                <div className={styles.overlayNote} style={{ pointerEvents: 'none' }}>Modus: {mode === "crop" ? "Zuschneiden" : "Bereich zum Verpixeln ziehen"}</div>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  width={displaySize.w}
                  height={displaySize.h}
                  onMouseDown={handleDown}
                  onMouseMove={handleMove}
                  onMouseUp={handleUp}
                  onMouseLeave={handleUp}
                  onTouchStart={handleDown}
                  onTouchMove={handleMove}
                  onTouchEnd={handleUp}
                  onTouchCancel={handleUp}
                />
              </>
            )}
          </div>
          <div className={styles.sidebar}>
            <p className={styles.sectionLabel}>Modus</p>
            <div className={styles.modeToggle}>
              <button className={`${styles.toggleBtn} ${mode === "crop" ? styles.active : ""}`} onClick={() => setMode("crop")}>
                <FaCropSimple /> Zuschneiden
              </button>
              <button className={`${styles.toggleBtn} ${mode === "blur" ? styles.active : ""}`} onClick={() => setMode("blur")}>
                <FaFillDrip /> Zensieren
              </button>
            </div>
            <p className={styles.hint}>Klicke und ziehe im Bild, um einen Bereich zu setzen.</p>

            <p className={styles.sectionLabel}>Aktionen</p>
            <div className={styles.buttonRow}>
              <button className={styles.smallBtn} onClick={resetCrop}><FaRotateLeft /> Zensierung zurücksetzen</button>
              <button className={styles.smallBtn} onClick={clearBlurs}><FaTrash /> Zensierungen leeren</button>
            </div>

            <p className={styles.sectionLabel}>Zensierungs-Stärke</p>
            <div className={styles.sliderRow}>
              <input
                type="range"
                min={4}
                max={40}
                step={2}
                value={blurStrength}
                onChange={e => setBlurStrength(Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{blurStrength}px</span>
            </div>

            <p className={styles.sectionLabel}>Zensierungs-Bereiche</p>
            <div className={styles.blurList}>
              {blurs.length === 0 && <span className={styles.hint}>Noch keine Bereiche.</span>}
              {blurs.map((b, idx) => (
                <div key={b.id} className={styles.blurItem}>
                  <span>#{idx + 1} · {Math.round(b.width)}×{Math.round(b.height)}</span>
                  <button onClick={() => deleteBlur(b.id)} title="Entfernen">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <p className={styles.status}>{img ? `${img.naturalWidth}×${img.naturalHeight}px` : "Lade Bild…"}</p>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.secondaryBtn} onClick={onClose}><FaX /> Abbrechen</button>
            {!isWebP && !isSVG && (
              <button className={styles.primaryBtn} disabled={saving} onClick={() => handleSave("replace", "webp")} title="Bild zu WebP konvertieren und Original ersetzen">
                <RiImageAiLine /> Optimieren & Ersetzen
              </button>
            )}
            <button className={styles.primaryBtn} disabled={saving} onClick={() => handleSave("copy")}>
              <FaCopy /> Als Kopie speichern
            </button>
            <button className={styles.dangerBtn} disabled={saving} onClick={() => handleSave("replace")}>
              <FaCheck /> Original ersetzen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
